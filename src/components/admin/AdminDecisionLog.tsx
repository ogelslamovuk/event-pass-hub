import React, { useMemo } from "react";
import type { AppState } from "@/lib/store";
import { A, statusChip } from "./adminStyles";
import { BookOpen } from "lucide-react";

interface Decision {
  ts: string;
  object: string;
  decision: string;
  basis: string;
  executor: string;
}

interface Props { state: AppState; }

export default function AdminDecisionLog({ state }: Props) {
  const decisions = useMemo<Decision[]>(() => {
    const result: Decision[] = [];
    state.applications.forEach(a => {
      if (a.status === "approved") {
        result.push({ ts: a.updatedAt, object: a.appId, decision: "Одобрена", basis: "УНП OK, пошлина оплачена", executor: "Инспектор" });
      }
      if (a.status === "rejected") {
        result.push({ ts: a.updatedAt, object: a.appId, decision: "Отклонена", basis: "Ручное решение", executor: "Инспектор" });
      }
    });
    state.events.forEach(e => {
      if (e.status === "published") {
        result.push({ ts: e.updatedAt, object: e.eventId, decision: "Опубликовано", basis: "Автоматически", executor: "Система" });
      }
    });
    return result.sort((a, b) => b.ts.localeCompare(a.ts));
  }, [state]);

  const decisionChip = (d: string) => {
    if (d === "Одобрена" || d === "Опубликовано") return statusChip('ok');
    if (d === "Отклонена") return statusChip('error');
    return statusChip('neutral');
  };

  return (
    <div className="space-y-5">
      <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="overflow-hidden">
        {decisions.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <BookOpen size={28} style={{ color: A.textMuted }} className="mb-2" />
            <p style={{ color: A.textMuted }} className="text-sm">Нет решений</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: A.tableHeaderBg }}>
                  {["Дата/время", "Объект", "Решение", "Основание", "Исполнитель"].map((h, i) => (
                    <th key={i} className="text-left py-3 px-4 font-medium text-xs" style={{ color: A.textSecondary, borderBottom: `1px solid ${A.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {decisions.map((d, i) => {
                  const chip = decisionChip(d.decision);
                  return (
                    <tr key={i} className="transition-colors"
                      style={{ borderBottom: `1px solid ${A.border}` }}
                      onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="py-3 px-4 text-xs" style={{ color: A.textMuted }}>{d.ts?.replace("T", " ").slice(0, 19)}</td>
                      <td className="py-3 px-4 font-mono text-xs" style={{ color: A.cyan }}>{d.object}</td>
                      <td className="py-3 px-4">
                        <span style={{ background: chip.bg, color: chip.color, borderRadius: 999 }} className="text-xs px-2.5 py-0.5 font-medium">{d.decision}</span>
                      </td>
                      <td className="py-3 px-4" style={{ color: A.textSecondary }}>{d.basis}</td>
                      <td className="py-3 px-4" style={{ color: A.textSecondary }}>{d.executor}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
