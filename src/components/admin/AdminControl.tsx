import React, { useMemo, useState } from "react";
import type { AppState } from "@/lib/store";
import { A, statusChip } from "./adminStyles";
import { ShieldAlert, X } from "lucide-react";

interface Flag {
  id: string;
  object: string;
  objectId: string;
  type: string;
  priority: 'high' | 'medium' | 'low';
  status: string;
  reason: string;
  ts: string;
}

interface Props { state: AppState; }

const priorityChip = (p: string) => {
  switch (p) {
    case 'high': return statusChip('error');
    case 'medium': return statusChip('warn');
    default: return statusChip('neutral');
  }
};

export default function AdminControl({ state }: Props) {
  const [drawer, setDrawer] = useState<Flag | null>(null);

  const flags = useMemo<Flag[]>(() => {
    const result: Flag[] = [];
    // Error ops → flags
    state.ops.filter(o => o.result === "error").forEach(o => {
      let flagType = "Ошибка операции";
      if (o.reason?.includes("погашен")) flagType = "Повторный redeem";
      else if (o.reason?.includes("возвращён")) flagType = "Операция над возвратом";
      else if (o.reason?.includes("Нет доступных")) flagType = "Превышение лимита";
      result.push({
        id: `FLG-${o.opId}`,
        object: o.type,
        objectId: o.ticketId || o.eventId,
        type: flagType,
        priority: flagType === "Повторный redeem" ? 'high' : 'medium',
        status: "Открыт",
        reason: o.reason || "",
        ts: o.ts,
      });
    });
    // High refund rate
    const refunds = state.ops.filter(o => o.type === "refund" && o.result === "ok").length;
    const sells = state.ops.filter(o => o.type === "sell" && o.result === "ok").length;
    if (sells > 0 && refunds / sells > 0.3) {
      result.push({
        id: "FLG-REFUND-RATE",
        object: "Система",
        objectId: "—",
        type: "Возвраты выше нормы",
        priority: 'high',
        status: "Мониторинг",
        reason: `Уровень возвратов ${Math.round(refunds / sells * 100)}% (порог 30%)`,
        ts: new Date().toISOString(),
      });
    }
    return result;
  }, [state.ops]);

  return (
    <div className="space-y-5">
      <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="overflow-hidden">
        {flags.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <ShieldAlert size={28} style={{ color: A.textMuted }} className="mb-2" />
            <p style={{ color: A.textMuted }} className="text-sm">Нарушений не обнаружено</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: A.tableHeaderBg }}>
                  {["ID", "Объект", "Тип нарушения", "Приоритет", "Статус", "Основание", "Время"].map((h, i) => (
                    <th key={i} className="text-left py-3 px-4 font-medium text-xs" style={{ color: A.textSecondary, borderBottom: `1px solid ${A.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flags.map(f => {
                  const pChip = priorityChip(f.priority);
                  return (
                    <tr key={f.id} className="transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${A.border}` }}
                      onClick={() => setDrawer(f)}
                      onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="py-3 px-4 font-mono text-xs" style={{ color: A.cyan }}>{f.id}</td>
                      <td className="py-3 px-4" style={{ color: A.textSecondary }}>{f.objectId}</td>
                      <td className="py-3 px-4" style={{ color: A.textPrimary }}>{f.type}</td>
                      <td className="py-3 px-4">
                        <span style={{ background: pChip.bg, color: pChip.color, borderRadius: 999 }} className="text-xs px-2.5 py-0.5 font-medium">{f.priority.toUpperCase()}</span>
                      </td>
                      <td className="py-3 px-4" style={{ color: A.textSecondary }}>{f.status}</td>
                      <td className="py-3 px-4 text-xs max-w-[200px] truncate" style={{ color: A.textMuted }}>{f.reason}</td>
                      <td className="py-3 px-4 text-xs" style={{ color: A.textMuted }}>{f.ts?.replace("T", " ").slice(0, 16)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {drawer && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawer(null)}>
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md h-full overflow-y-auto animate-in slide-in-from-right duration-300"
            style={{ background: A.glassGradient + ', ' + A.sidebarBg, borderLeft: `1px solid ${A.borderGlass}` }}
            onClick={e => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex items-center justify-between p-5" style={{ background: A.topbarBg, backdropFilter: 'blur(16px)', borderBottom: `1px solid ${A.border}` }}>
              <h3 style={{ color: A.textPrimary }} className="text-base font-semibold">{drawer.id}</h3>
              <button onClick={() => setDrawer(null)} style={{ color: A.textMuted }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {([["Тип", drawer.type], ["Объект", drawer.objectId], ["Приоритет", drawer.priority.toUpperCase()], ["Статус", drawer.status], ["Основание", drawer.reason], ["Время", drawer.ts?.replace("T", " ").slice(0, 19)]] as [string, string][]).map(([k, v]) => (
                <div key={k}>
                  <div style={{ color: A.textMuted }} className="text-xs font-medium mb-1">{k}</div>
                  <div style={{ color: A.textPrimary }} className="text-sm">{v}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
