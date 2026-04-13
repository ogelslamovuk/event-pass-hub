import React, { useState, useMemo } from "react";
import type { AppState, Channel, OpOutcome } from "@/lib/store";
import { sell, refund, redeem, verify } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  state: AppState;
  onUpdate: (s: AppState) => void;
}

const channels: Channel[] = ["ByCard", "TicketPro", "SellerPOS"];

export default function ChannelView({ state, onUpdate }: Props) {
  const [channel, setChannel] = useState<Channel>(state.ui.selectedChannel);
  const [opTab, setOpTab] = useState<"sell" | "refund" | "redeem" | "verify">("sell");
  const [sellEvent, setSellEvent] = useState("");
  const [sellTier, setSellTier] = useState("");
  const [ticketIdInput, setTicketIdInput] = useState("");
  const [lastResult, setLastResult] = useState<OpOutcome | null>(null);
  const [sellModal, setSellModal] = useState<{ eventId: string } | null>(null);
  const [sellModalTier, setSellModalTier] = useState("");

  const published = useMemo(() => state.events.filter((e) => e.status === "published"), [state.events]);

  const doSell = (eventId: string, tier: string) => {
    const res = sell(state, eventId, tier, channel);
    setLastResult(res);
    if (res.ok) toast.success(`Продано: ${res.ticketId}`);
    else toast.error(res.reason || "Ошибка");
    onUpdate({ ...state });
  };

  const doOp = (type: "refund" | "redeem" | "verify") => {
    if (!ticketIdInput.trim()) { toast.error("Введите TicketID"); return; }
    const fn = type === "refund" ? refund : type === "redeem" ? redeem : verify;
    const res = fn(state, ticketIdInput.trim(), channel);
    setLastResult(res);
    if (res.ok) toast.success(`${type}: OK — ${res.ticketId} (${res.status})`);
    else toast.error(res.reason || "Ошибка");
    onUpdate({ ...state });
  };

  const opTabs = [
    { key: "sell" as const, label: "Продажа" },
    { key: "refund" as const, label: "Возврат" },
    { key: "redeem" as const, label: "Погашение" },
    { key: "verify" as const, label: "Проверка" },
  ];

  return (
    <div className="space-y-6">
      {/* Channel selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm font-medium">Канал:</span>
        <select className="border border-border rounded-md px-3 py-2 text-sm bg-card"
          value={channel} onChange={(e) => setChannel(e.target.value as Channel)}>
          {channels.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Showcase */}
        <div className="bg-card rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold mb-4">Витрина канала</h2>
          {published.length === 0 ? (
            <p className="text-center py-8 opacity-60">Нет опубликованных событий</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="py-2 px-2 font-medium">EventID</th>
                    <th className="py-2 px-2 font-medium">Название</th>
                    <th className="py-2 px-2 font-medium">Дата</th>
                    <th className="py-2 px-2 font-medium">Остаток</th>
                    <th className="py-2 px-2 font-medium">Категории</th>
                    <th className="py-2 px-2 font-medium"></th>
                  </tr>
                </thead>
                <tbody>
                  {published.map((e) => (
                    <tr key={e.eventId} className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">{e.eventId}</td>
                      <td className="py-2 px-2">{e.title}</td>
                      <td className="py-2 px-2 text-xs">{e.dateTime?.replace("T", " ")}</td>
                      <td className="py-2 px-2">{e.remaining}</td>
                      <td className="py-2 px-2 text-xs">{e.tiers.map((t) => t.name).join(", ")}</td>
                      <td className="py-2 px-2">
                        <button onClick={() => { setSellModal({ eventId: e.eventId }); setSellModalTier(e.tiers[0]?.name || ""); }}
                          className="px-3 h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs">
                          Продать
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Right: Operations */}
        <div className="bg-card rounded-lg p-6 shadow-card border border-border">
          <h2 className="text-lg font-semibold mb-4">Операции</h2>
          <div className="flex gap-1 mb-4 bg-muted rounded-lg p-1">
            {opTabs.map((t) => (
              <button key={t.key} onClick={() => setOpTab(t.key)}
                className={`px-3 py-2 rounded-md text-xs font-medium flex-1 transition-colors ${opTab === t.key ? "bg-card shadow-sm" : "hover:bg-card/50"}`}>
                {t.label}
              </button>
            ))}
          </div>

          {opTab === "sell" && (
            <div className="space-y-3">
              <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card"
                value={sellEvent} onChange={(e) => { setSellEvent(e.target.value); setSellTier(""); }}>
                <option value="">Выберите событие</option>
                {published.map((e) => <option key={e.eventId} value={e.eventId}>{e.eventId} — {e.title}</option>)}
              </select>
              {sellEvent && (() => {
                const evt = published.find((e) => e.eventId === sellEvent);
                return (
                  <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card"
                    value={sellTier} onChange={(e) => setSellTier(e.target.value)}>
                    <option value="">Выберите категорию</option>
                    {evt?.tiers.map((t) => <option key={t.name} value={t.name}>{t.name} — {t.price}₽</option>)}
                  </select>
                );
              })()}
              <button onClick={() => { if (sellEvent && sellTier) doSell(sellEvent, sellTier); }}
                disabled={!sellEvent || !sellTier}
                className="px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm disabled:opacity-40">
                Продать
              </button>
            </div>
          )}

          {opTab !== "sell" && (
            <div className="space-y-3">
              <input className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card"
                placeholder="TicketID (например TCK-000001)"
                value={ticketIdInput} onChange={(e) => setTicketIdInput(e.target.value)} />
              <button onClick={() => doOp(opTab)}
                className="px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
                {opTab === "refund" ? "Возврат" : opTab === "redeem" ? "Погасить" : "Проверить"}
              </button>
            </div>
          )}

          {/* Response panel */}
          {lastResult && (
            <div className={`mt-4 p-4 rounded-lg border text-sm ${lastResult.ok ? "bg-role-channel/30 border-role-channel" : "bg-role-regulator/30 border-role-regulator"}`}>
              <div className="font-semibold mb-1">{lastResult.ok ? "OK" : "ОТКАЗ"}</div>
              {lastResult.ticketId && <div>TicketID: {lastResult.ticketId}</div>}
              {lastResult.status && <div>Статус: {lastResult.status}</div>}
              {lastResult.reason && <div>Причина: {lastResult.reason}</div>}
              <div className="text-xs opacity-60 mt-1">op_id: {lastResult.op.opId}</div>
            </div>
          )}
        </div>
      </div>

      {/* Sell modal */}
      {sellModal && (() => {
        const evt = published.find((e) => e.eventId === sellModal.eventId);
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setSellModal(null)}>
            <div className="absolute inset-0 bg-foreground/30" />
            <div className="relative bg-card rounded-lg p-6 shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-semibold mb-3">Продажа билета</h3>
              <p className="text-sm opacity-70 mb-3">{evt?.title} ({sellModal.eventId})</p>
              <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card mb-4"
                value={sellModalTier} onChange={(e) => setSellModalTier(e.target.value)}>
                {evt?.tiers.map((t) => <option key={t.name} value={t.name}>{t.name} — {t.price}₽</option>)}
              </select>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setSellModal(null)}
                  className="px-4 h-10 rounded-xl border border-border text-sm font-medium">Отмена</button>
                <button onClick={() => { doSell(sellModal.eventId, sellModalTier); setSellModal(null); }}
                  className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                  Подтвердить продажу
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
