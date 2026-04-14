import React, { useMemo, useState } from "react";
import type { AppState, Channel, OpOutcome, Ticket } from "@/lib/store";
import { sell, refund, redeem, verify } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  state: AppState;
  onUpdate: (s: AppState) => void;
}

type OperationTab = "sell" | "refund" | "redeem" | "verify";
type EventStatusFilter = "all" | "published" | "approved";

const channels: Channel[] = ["ByCard", "TicketPro", "SellerPOS"];
const capabilities: OperationTab[] = ["sell", "refund", "verify", "redeem"];

const opTitles: Record<OperationTab, string> = {
  sell: "Продажа",
  refund: "Возврат",
  redeem: "Погашение",
  verify: "Проверка",
};

function formatDate(value?: string) {
  if (!value) return "—";
  return new Date(value).toLocaleString("ru-RU", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function channelId(channel: Channel) {
  return `CH-${channel.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8)}`;
}

export default function ChannelView({ state, onUpdate }: Props) {
  const [channel, setChannel] = useState<Channel>(state.ui.selectedChannel);
  const [opTab, setOpTab] = useState<OperationTab>("sell");
  const [selectedEventId, setSelectedEventId] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<EventStatusFilter>("all");
  const [dateFilter, setDateFilter] = useState("");

  const [sellTier, setSellTier] = useState("");
  const [sellQty, setSellQty] = useState(1);

  const [ticketIdInput, setTicketIdInput] = useState("");
  const [ticketLookup, setTicketLookup] = useState<Ticket | null>(null);
  const [lastResult, setLastResult] = useState<OpOutcome | null>(null);

  const activeEvents = useMemo(() => state.events.filter((e) => e.status === "published"), [state.events]);

  const events = useMemo(() => {
    return state.events
      .filter((e) => (statusFilter === "all" ? true : e.status === statusFilter))
      .filter((e) => {
        if (!dateFilter) return true;
        return e.dateTime.startsWith(dateFilter);
      })
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return [e.eventId, e.title, e.venue].some((field) => field.toLowerCase().includes(q));
      })
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime));
  }, [state.events, statusFilter, dateFilter, search]);

  const selectedEvent = useMemo(
    () => state.events.find((e) => e.eventId === selectedEventId) || null,
    [state.events, selectedEventId],
  );

  const selectedTier = useMemo(
    () => selectedEvent?.tiers.find((tier) => tier.name === sellTier) || null,
    [selectedEvent, sellTier],
  );

  const channelOps = useMemo(
    () => state.ops.filter((op) => op.channel === channel).sort((a, b) => b.ts.localeCompare(a.ts)),
    [state.ops, channel],
  );

  const today = new Date().toISOString().slice(0, 10);
  const soldToday = channelOps.filter((op) => op.type === "sell" && op.result === "ok" && op.ts.startsWith(today)).length;
  const refundsToday = channelOps.filter((op) => op.type === "refund" && op.result === "ok" && op.ts.startsWith(today)).length;
  const lastOperation = channelOps[0] || null;

  const kpi = [
    { label: "Активные события", value: activeEvents.length.toString(), hint: "published" },
    {
      label: "Доступно билетов",
      value: activeEvents.reduce((acc, e) => acc + e.remaining, 0).toString(),
      hint: "для продажи",
    },
    { label: "Продано сегодня", value: soldToday.toString(), hint: channel },
    { label: "Возвратов сегодня", value: refundsToday.toString(), hint: channel },
    {
      label: "Последняя операция",
      value: lastOperation ? opTitles[lastOperation.type] : "—",
      hint: lastOperation ? formatDate(lastOperation.ts) : "нет операций",
    },
  ];

  const persistChannel = (next: Channel) => {
    setChannel(next);
    const nextState = { ...state, ui: { ...state.ui, selectedChannel: next } };
    onUpdate(nextState);
  };

  const selectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setSellTier("");
    setLastResult(null);
  };

  const lookupTicket = () => {
    const ticketId = ticketIdInput.trim();
    if (!ticketId) {
      toast.error("Введите TicketID");
      setTicketLookup(null);
      return;
    }
    const ticket = state.tickets.find((t) => t.ticketId === ticketId) || null;
    setTicketLookup(ticket);
    if (!ticket) {
      toast.error("Билет не найден");
      return;
    }
    toast.success(`Найден ${ticket.ticketId}`);
  };

  const doSell = () => {
    if (!selectedEvent) {
      toast.error("Сначала выберите событие");
      return;
    }
    if (!sellTier) {
      toast.error("Выберите категорию");
      return;
    }

    let successCount = 0;
    let failed: OpOutcome | null = null;

    for (let i = 0; i < sellQty; i++) {
      const res = sell(state, selectedEvent.eventId, sellTier, channel);
      if (res.ok) {
        successCount += 1;
        setLastResult(res);
      } else {
        failed = res;
        setLastResult(res);
        break;
      }
    }

    onUpdate({ ...state });

    if (successCount > 0 && !failed) {
      toast.success(`Продано билетов: ${successCount}`);
      return;
    }

    if (successCount > 0 && failed) {
      toast.warning(`Частично выполнено: ${successCount}/${sellQty}`);
      return;
    }

    toast.error(failed?.reason || "Ошибка продажи");
  };

  const doTicketOperation = (type: Exclude<OperationTab, "sell">) => {
    const ticketId = ticketIdInput.trim();
    if (!ticketId) {
      toast.error("Введите TicketID");
      return;
    }

    const fn = type === "refund" ? refund : type === "redeem" ? redeem : verify;
    const res = fn(state, ticketId, channel);
    setLastResult(res);
    onUpdate({ ...state });

    const refreshed = state.tickets.find((t) => t.ticketId === ticketId) || null;
    setTicketLookup(refreshed);

    if (res.ok) {
      toast.success(`${opTitles[type]}: OK`);
      return;
    }
    toast.error(res.reason || "Операция отклонена");
  };

  const relatedOps = useMemo(() => {
    if (!ticketLookup) return [];
    return state.ops
      .filter((op) => op.ticketId === ticketLookup.ticketId)
      .sort((a, b) => b.ts.localeCompare(a.ts))
      .slice(0, 5);
  }, [state.ops, ticketLookup]);

  const canRefund = ticketLookup?.status === "sold";
  const canRedeem = ticketLookup?.status === "sold";

  return (
    <div className="space-y-5">
      <section className="rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 via-slate-900 to-indigo-950/40 p-5 shadow-[0_20px_60px_rgba(1,8,30,0.35)]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Sales Channel</p>
            <h1 className="mt-2 text-2xl font-semibold text-white">{channel}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
              <span className="rounded-full border border-emerald-300/40 bg-emerald-500/10 px-2 py-1 text-emerald-200">Подключён</span>
              <span className="rounded-full border border-cyan-300/40 bg-cyan-500/10 px-2 py-1 text-cyan-100">Sandbox</span>
              <span className="rounded-full border border-violet-300/40 bg-violet-500/10 px-2 py-1 text-violet-100">Connected to TicketHub: Да</span>
            </div>
          </div>

          <div className="grid w-full gap-3 text-sm text-slate-200 lg:w-auto lg:min-w-[360px] lg:grid-cols-2">
            <label className="flex flex-col gap-1">
              <span className="text-xs text-slate-400">Канал</span>
              <select
                value={channel}
                onChange={(e) => persistChannel(e.target.value as Channel)}
                className="h-10 rounded-lg border border-white/15 bg-slate-950/70 px-3 text-sm outline-none ring-cyan-400/40 focus:ring-2"
              >
                {channels.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <div className="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2">
              <p className="text-xs text-slate-400">Channel ID</p>
              <p className="mt-1 font-mono text-sm text-slate-100">{channelId(channel)}</p>
            </div>
            <div className="rounded-lg border border-white/10 bg-slate-950/50 px-3 py-2 lg:col-span-2">
              <p className="text-xs text-slate-400">Последняя синхронизация</p>
              <p className="mt-1 text-sm text-slate-100">{formatDate(state.meta.updatedAt)}</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {capabilities.map((capability) => (
            <span
              key={capability}
              className="rounded-md border border-white/15 bg-slate-900/80 px-2.5 py-1 text-xs font-medium text-slate-100"
            >
              {capability}
            </span>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
        {kpi.map((item) => (
          <article key={item.label} className="rounded-xl border border-white/10 bg-slate-900/75 px-4 py-3">
            <p className="text-xs text-slate-400">{item.label}</p>
            <p className="mt-1 text-2xl font-semibold text-white">{item.value}</p>
            <p className="mt-1 text-xs text-slate-500">{item.hint}</p>
          </article>
        ))}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-5">
        <article className="xl:col-span-3 rounded-xl border border-white/10 bg-slate-950/75 p-4">
          <div className="mb-3 flex flex-wrap gap-2">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по EventID, названию, площадке"
              className="h-10 min-w-[220px] flex-1 rounded-lg border border-white/15 bg-slate-900/70 px-3 text-sm text-slate-100 outline-none ring-cyan-400/40 focus:ring-2"
            />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as EventStatusFilter)}
              className="h-10 rounded-lg border border-white/15 bg-slate-900/70 px-3 text-sm text-slate-100"
            >
              <option value="all">Все статусы</option>
              <option value="published">published</option>
              <option value="approved">approved</option>
            </select>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="h-10 rounded-lg border border-white/15 bg-slate-900/70 px-3 text-sm text-slate-100"
            />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[780px] text-left text-sm">
              <thead className="text-xs uppercase tracking-wide text-slate-400">
                <tr className="border-b border-white/10">
                  <th className="px-2 py-2">EventID</th>
                  <th className="px-2 py-2">Событие</th>
                  <th className="px-2 py-2">Дата/время</th>
                  <th className="px-2 py-2">Площадка</th>
                  <th className="px-2 py-2">Остаток</th>
                  <th className="px-2 py-2">Категории</th>
                  <th className="px-2 py-2">Статус</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 && (
                  <tr>
                    <td className="px-2 py-8 text-center text-slate-500" colSpan={7}>
                      События не найдены по выбранным фильтрам.
                    </td>
                  </tr>
                )}
                {events.map((event) => {
                  const isSelected = selectedEventId === event.eventId;
                  return (
                    <tr
                      key={event.eventId}
                      onClick={() => selectEvent(event.eventId)}
                      className={`cursor-pointer border-b border-white/5 transition-colors ${
                        isSelected ? "bg-cyan-500/15" : "hover:bg-slate-800/55"
                      }`}
                    >
                      <td className="px-2 py-2 font-mono text-xs text-slate-200">{event.eventId}</td>
                      <td className="px-2 py-2 text-slate-100">{event.title}</td>
                      <td className="px-2 py-2 text-xs text-slate-300">{formatDate(event.dateTime)}</td>
                      <td className="px-2 py-2 text-xs text-slate-300">{event.venue}</td>
                      <td className="px-2 py-2 font-semibold text-white">{event.remaining}</td>
                      <td className="px-2 py-2 text-xs text-slate-300">{event.tiers.map((tier) => `${tier.name} (${tier.price}₽)`).join(", ")}</td>
                      <td className="px-2 py-2">
                        <span className="rounded-md border border-white/10 bg-slate-900/70 px-2 py-1 text-xs text-slate-200">
                          {event.status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </article>

        <article className="xl:col-span-2 rounded-xl border border-white/10 bg-slate-900/80 p-4">
          <div className="grid grid-cols-4 gap-1 rounded-lg bg-slate-950/70 p-1">
            {(Object.keys(opTitles) as OperationTab[]).map((tab) => (
              <button
                key={tab}
                onClick={() => {
                  setOpTab(tab);
                  setLastResult(null);
                }}
                className={`h-9 rounded-md text-xs font-medium transition-colors ${
                  opTab === tab ? "bg-cyan-500/20 text-cyan-100" : "text-slate-400 hover:bg-slate-800/80"
                }`}
              >
                {opTitles[tab]}
              </button>
            ))}
          </div>

          {selectedEvent ? (
            <div className="mt-3 rounded-lg border border-white/10 bg-slate-950/70 p-3 text-sm">
              <p className="text-xs text-slate-400">Выбранное событие</p>
              <p className="mt-1 font-semibold text-white">{selectedEvent.title}</p>
              <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-slate-300">
                <p>EventID: {selectedEvent.eventId}</p>
                <p>Остаток: {selectedEvent.remaining}</p>
                <p>{formatDate(selectedEvent.dateTime)}</p>
                <p>{selectedEvent.venue}</p>
              </div>
              <p className="mt-2 text-xs text-slate-400">Категории: {selectedEvent.tiers.map((t) => t.name).join(", ")}</p>
            </div>
          ) : (
            <div className="mt-3 rounded-lg border border-dashed border-white/15 bg-slate-950/40 p-4 text-sm text-slate-400">
              Выберите событие в каталоге, чтобы выполнить операцию продажи.
            </div>
          )}

          {opTab === "sell" && (
            <div className="mt-4 space-y-3 text-sm">
              <div>
                <p className="mb-1 text-xs text-slate-400">Событие</p>
                <input
                  disabled
                  value={selectedEvent ? `${selectedEvent.eventId} — ${selectedEvent.title}` : "Событие не выбрано"}
                  className="h-10 w-full rounded-lg border border-white/10 bg-slate-950/70 px-3 text-slate-300"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">Категория</span>
                  <select
                    value={sellTier}
                    onChange={(e) => setSellTier(e.target.value)}
                    disabled={!selectedEvent}
                    className="h-10 rounded-lg border border-white/15 bg-slate-950/70 px-3 text-sm"
                  >
                    <option value="">Выберите категорию</option>
                    {selectedEvent?.tiers.map((tier) => (
                      <option key={tier.name} value={tier.name}>
                        {tier.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="flex flex-col gap-1">
                  <span className="text-xs text-slate-400">Количество</span>
                  <input
                    type="number"
                    min={1}
                    max={50}
                    value={sellQty}
                    onChange={(e) => setSellQty(Math.max(1, Number(e.target.value) || 1))}
                    className="h-10 rounded-lg border border-white/15 bg-slate-950/70 px-3 text-sm"
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg border border-white/10 bg-slate-950/60 p-2">
                  <p className="text-slate-400">Цена за билет</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedTier ? `${selectedTier.price} ₽` : "—"}</p>
                </div>
                <div className="rounded-lg border border-white/10 bg-slate-950/60 p-2">
                  <p className="text-slate-400">Итоговая сумма</p>
                  <p className="mt-1 text-sm font-semibold text-white">{selectedTier ? `${selectedTier.price * sellQty} ₽` : "—"}</p>
                </div>
              </div>

              <button
                onClick={doSell}
                disabled={!selectedEvent || !sellTier}
                className="h-11 w-full rounded-lg bg-cyan-500/90 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                Создать продажу
              </button>
            </div>
          )}

          {opTab !== "sell" && (
            <div className="mt-4 space-y-3 text-sm">
              <div className="grid grid-cols-[1fr_auto] gap-2">
                <input
                  value={ticketIdInput}
                  onChange={(e) => setTicketIdInput(e.target.value)}
                  placeholder="TicketID"
                  className="h-10 rounded-lg border border-white/15 bg-slate-950/70 px-3"
                />
                <button
                  onClick={lookupTicket}
                  className="h-10 rounded-lg border border-white/20 bg-slate-800 px-3 text-xs font-semibold text-slate-100"
                >
                  Найти
                </button>
              </div>

              <div className="rounded-lg border border-white/10 bg-slate-950/70 p-3 text-xs text-slate-300">
                {!ticketLookup ? (
                  <p className="text-slate-400">Введите TicketID и выполните поиск.</p>
                ) : (
                  <div className="space-y-1">
                    <p>TicketID: {ticketLookup.ticketId}</p>
                    <p>EventID: {ticketLookup.eventId}</p>
                    <p>Статус: {ticketLookup.status}</p>
                    <p>Канал: {ticketLookup.soldByChannel || "—"}</p>
                    <p>Последняя операция: {relatedOps[0] ? `${opTitles[relatedOps[0].type]} (${formatDate(relatedOps[0].ts)})` : "—"}</p>
                  </div>
                )}
              </div>

              {opTab === "verify" && ticketLookup && (
                <div className="rounded-lg border border-white/10 bg-slate-950/70 p-3 text-xs text-slate-300">
                  <p className="mb-2 text-slate-400">Краткая история</p>
                  <ul className="space-y-1">
                    {relatedOps.length === 0 && <li className="text-slate-500">Операции не найдены.</li>}
                    {relatedOps.map((op) => (
                      <li key={op.opId}>{formatDate(op.ts)} · {opTitles[op.type]} · {op.result}</li>
                    ))}
                  </ul>
                </div>
              )}

              <button
                onClick={() => doTicketOperation(opTab as Exclude<OperationTab, "sell">)}
                disabled={
                  !ticketIdInput.trim() ||
                  (opTab === "refund" && !canRefund) ||
                  (opTab === "redeem" && !canRedeem)
                }
                className="h-11 w-full rounded-lg bg-cyan-500/90 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400"
              >
                {opTab === "refund" ? "Оформить возврат" : opTab === "redeem" ? "Погасить билет" : "Проверить билет"}
              </button>

              {opTab === "refund" && ticketLookup && !canRefund && (
                <p className="text-xs text-amber-300">Возврат доступен только для статуса sold.</p>
              )}
              {opTab === "redeem" && ticketLookup && !canRedeem && (
                <p className="text-xs text-amber-300">Погашение доступно только для статуса sold.</p>
              )}
              {opTab === "verify" && <p className="text-xs text-slate-500">Проверка не меняет статус билета.</p>}
            </div>
          )}

          {lastResult && (
            <div
              className={`mt-4 rounded-lg border p-3 text-xs ${
                lastResult.ok
                  ? "border-emerald-300/30 bg-emerald-500/10 text-emerald-100"
                  : "border-rose-300/30 bg-rose-500/10 text-rose-100"
              }`}
            >
              <p className="font-semibold">{lastResult.ok ? "Операция выполнена" : "Операция отклонена"}</p>
              <p className="mt-1">op_id: {lastResult.op.opId}</p>
              {lastResult.ticketId && <p>TicketID: {lastResult.ticketId}</p>}
              {lastResult.status && <p>Статус: {lastResult.status}</p>}
              {lastResult.reason && <p>Причина: {lastResult.reason}</p>}
            </div>
          )}
        </article>
      </section>

      <section className="rounded-xl border border-white/10 bg-slate-950/80 p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">Журнал операций канала</h2>
          <span className="text-xs text-slate-500">{channel}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[840px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-slate-400">
              <tr className="border-b border-white/10">
                <th className="px-2 py-2">Время</th>
                <th className="px-2 py-2">op_id</th>
                <th className="px-2 py-2">Тип</th>
                <th className="px-2 py-2">TicketID</th>
                <th className="px-2 py-2">EventID</th>
                <th className="px-2 py-2">Результат</th>
                <th className="px-2 py-2">Примечание</th>
              </tr>
            </thead>
            <tbody>
              {channelOps.length === 0 && (
                <tr>
                  <td className="px-2 py-6 text-center text-slate-500" colSpan={7}>
                    У выбранного канала пока нет операций.
                  </td>
                </tr>
              )}
              {channelOps.slice(0, 50).map((op) => (
                <tr key={op.opId} className="border-b border-white/5 text-xs text-slate-200">
                  <td className="px-2 py-2">{formatDate(op.ts)}</td>
                  <td className="px-2 py-2 font-mono">{op.opId}</td>
                  <td className="px-2 py-2">{op.type}</td>
                  <td className="px-2 py-2 font-mono">{op.ticketId || "—"}</td>
                  <td className="px-2 py-2 font-mono">{op.eventId || "—"}</td>
                  <td className="px-2 py-2">
                    <span className={`rounded px-1.5 py-0.5 ${op.result === "ok" ? "bg-emerald-500/15 text-emerald-200" : "bg-rose-500/15 text-rose-200"}`}>
                      {op.result}
                    </span>
                  </td>
                  <td className="px-2 py-2 text-slate-400">{op.reason || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="rounded-xl border border-white/10 bg-slate-900/70 p-3 text-xs text-slate-400">
        <p className="font-medium text-slate-300">Правила операций</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>Возврат доступен только для билетов в статусе sold.</li>
          <li>Погашение недоступно для refunded/redeemed.</li>
          <li>Проверка фиксируется в журнале, но не меняет статус билета.</li>
          <li>Продажа уменьшает остаток билетов события.</li>
        </ul>
      </section>
    </div>
  );
}
