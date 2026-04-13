import React, { useState, useMemo } from "react";
import type { AppState } from "@/lib/store";
import { sell } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  state: AppState;
  onUpdate: (s: AppState) => void;
}

const tktStatusLabel: Record<string, string> = { issued: "Выпущен", sold: "Продан", refunded: "Возврат", redeemed: "Погашен" };
const tktStatusBadge: Record<string, string> = { issued: "bg-role-tickethub", sold: "bg-role-channel", refunded: "bg-role-regulator", redeemed: "bg-role-b2c" };

export default function B2CView({ state, onUpdate }: Props) {
  const [buyModal, setBuyModal] = useState<{ eventId: string } | null>(null);
  const [buyTier, setBuyTier] = useState("");

  const published = useMemo(() => state.events.filter((e) => e.status === "published"), [state.events]);
  const myTickets = useMemo(() => state.tickets.filter((t) => t.soldToUserId === "demo_user_1"), [state.tickets]);

  const handleBuy = () => {
    if (!buyModal || !buyTier) return;
    const res = sell(state, buyModal.eventId, buyTier, "B2C-demo", "demo_user_1");
    if (res.ok) toast.success(`Куплено! ${res.ticketId}`);
    else toast.error(res.reason || "Ошибка");
    setBuyModal(null);
    onUpdate({ ...state });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Left: Poster */}
      <div className="bg-card rounded-lg p-6 shadow-card border border-border">
        <h2 className="text-lg font-semibold mb-4">Демо-афиша</h2>
        {published.length === 0 ? (
          <p className="text-center py-8 opacity-60">Нет событий. Нажмите «Сгенерировать демо-данные»</p>
        ) : (
          <div className="space-y-4">
            {published.map((e) => (
              <div key={e.eventId} className="border border-border rounded-lg p-4">
                <h3 className="font-semibold">{e.title}</h3>
                <p className="text-sm opacity-70">{e.venue} — {e.dateTime?.replace("T", " ")}</p>
                <p className="text-sm mt-1">Категории: {e.tiers.map((t) => `${t.name} (${t.price}₽)`).join(", ")}</p>
                <p className="text-sm mt-1">Осталось: {e.remaining}</p>
                <button onClick={() => { setBuyModal({ eventId: e.eventId }); setBuyTier(e.tiers[0]?.name || ""); }}
                  className="mt-3 px-5 h-11 rounded-xl bg-primary text-primary-foreground font-semibold text-sm">
                  Купить (демо)
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: My tickets */}
      <div className="bg-card rounded-lg p-6 shadow-card border border-border">
        <h2 className="text-lg font-semibold mb-4">Демо ЛК — Мои билеты</h2>
        {myTickets.length === 0 ? (
          <p className="text-center py-8 opacity-60">У вас нет билетов</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 px-2 font-medium">TicketID</th>
                  <th className="py-2 px-2 font-medium">Событие</th>
                  <th className="py-2 px-2 font-medium">Статус</th>
                  <th className="py-2 px-2 font-medium">Обновлён</th>
                </tr>
              </thead>
              <tbody>
                {myTickets.map((t) => {
                  const evt = state.events.find((e) => e.eventId === t.eventId);
                  return (
                    <tr key={t.ticketId} className="border-b border-border/50">
                      <td className="py-2 px-2 font-mono text-xs">{t.ticketId}</td>
                      <td className="py-2 px-2">{evt?.title || t.eventId}</td>
                      <td className="py-2 px-2">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${tktStatusBadge[t.status]}`}>
                          {tktStatusLabel[t.status]}
                        </span>
                      </td>
                      <td className="py-2 px-2 text-xs">{t.updatedAt?.replace("T", " ").slice(0, 19)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Buy modal */}
      {buyModal && (() => {
        const evt = published.find((e) => e.eventId === buyModal.eventId);
        return (
          <div className="fixed inset-0 z-[60] flex items-center justify-center" onClick={() => setBuyModal(null)}>
            <div className="absolute inset-0 bg-foreground/30" />
            <div className="relative bg-card rounded-lg p-6 shadow-xl max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              <h3 className="font-semibold mb-3">Купить билет (демо)</h3>
              <p className="text-sm opacity-70 mb-3">{evt?.title}</p>
              <select className="w-full border border-border rounded-md px-3 py-2 text-sm bg-card mb-4"
                value={buyTier} onChange={(e) => setBuyTier(e.target.value)}>
                {evt?.tiers.map((t) => <option key={t.name} value={t.name}>{t.name} — {t.price}₽</option>)}
              </select>
              <div className="flex gap-3 justify-end">
                <button onClick={() => setBuyModal(null)}
                  className="px-4 h-10 rounded-xl border border-border text-sm font-medium">Отмена</button>
                <button onClick={handleBuy}
                  className="px-4 h-10 rounded-xl bg-primary text-primary-foreground text-sm font-semibold">
                  Купить
                </button>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
