import React, { useMemo, useState } from "react";
import type { AppState } from "@/lib/store";
import { setOrganizerApplicationReview } from "@/lib/store";
import { A } from "./adminStyles";
import HelpTooltip from "@/components/ui/help-tooltip";

interface Props { state: AppState; onUpdate: (s: AppState) => void; }

export default function AdminOrganizerApplications({ state, onUpdate }: Props) {
  const [comment, setComment] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const rows = useMemo(() => state.organizerApplications.slice().reverse(), [state.organizerApplications]);

  const applyDecision = (id: string, decision: "approved" | "rejected" | "needs_rework") => {
    const row = state.organizerApplications.find((application) => application.organizerApplicationId === id);
    if (!row || row.status !== "submitted") {
      setErrors((prev) => ({ ...prev, [id]: "Решение уже принято для этой заявки." }));
      return;
    }
    if ((decision === "rejected" || decision === "needs_rework") && !(comment[id] || "").trim()) {
      setErrors((prev) => ({ ...prev, [id]: "Укажите комментарий для отклонения или возврата на доработку." }));
      return;
    }
    const ok = setOrganizerApplicationReview(state, id, decision, comment[id] || "");
    if (!ok) {
      setErrors((prev) => ({ ...prev, [id]: "Укажите комментарий для отклонения или возврата на доработку." }));
      return;
    }
    setErrors((prev) => ({ ...prev, [id]: "" }));
    onUpdate({ ...state });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5">
        <h2 className="text-sm" style={{ color: A.textSecondary }}>Заявки организаторов</h2>
        <HelpTooltip text="Перед отклонением или возвратом на доработку добавьте комментарий с причиной." />
      </div>
      <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 12 }} className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: A.tableHeaderBg }}>
              {[
                "ID",
                "Дата подачи",
                "Организация",
                "Рег. номер",
                "Руководитель",
                "Файлы",
                "Статус",
                "Действия",
              ].map((h) => (
                <th key={h} className="text-left py-2 px-3 text-xs" style={{ color: A.textSecondary }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.organizerApplicationId} style={{ borderTop: `1px solid ${A.border}` }}>
                <td className="py-2 px-3 font-mono text-xs">{r.organizerApplicationId}</td>
                <td className="py-2 px-3">{r.submittedAt ? r.submittedAt.slice(0, 16).replace("T", " ") : "—"}</td>
                <td className="py-2 px-3">{r.data.legalName}</td>
                <td className="py-2 px-3">{r.data.registrationNumber}</td>
                <td className="py-2 px-3">{r.data.director.fullName}</td>
                <td className="py-2 px-3">{r.data.documents.length + r.data.pastMaterials.length}</td>
                <td className="py-2 px-3">{r.status}</td>
                <td className="py-2 px-3 space-y-2">
                  <textarea
                    className="w-full min-h-16 rounded px-2 py-1 text-xs"
                    placeholder="Комментарий (обязателен при отклонении и возврате на доработку)"
                    value={comment[r.organizerApplicationId] || ""}
                    onChange={(e) => {
                      setComment((p) => ({ ...p, [r.organizerApplicationId]: e.target.value }));
                      setErrors((p) => ({ ...p, [r.organizerApplicationId]: "" }));
                    }}
                    style={{ background: A.surfaceBg, border: `1px solid ${A.border}`, color: A.textPrimary }}
                  />
                  {errors[r.organizerApplicationId] && (
                    <div className="text-xs" style={{ color: A.statusError }}>
                      {errors[r.organizerApplicationId]}
                    </div>
                  )}
                  <div className="flex gap-2 flex-wrap">
                    <button disabled={r.status !== "submitted"} className="px-2 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: A.statusOkBg, color: A.statusOk }} onClick={() => applyDecision(r.organizerApplicationId, "approved")}>Одобрить</button>
                    <button disabled={r.status !== "submitted"} className="px-2 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: A.statusWarnBg, color: A.statusWarn }} onClick={() => applyDecision(r.organizerApplicationId, "needs_rework")}>Вернуть на доработку</button>
                    <button disabled={r.status !== "submitted"} className="px-2 py-1 rounded text-xs disabled:opacity-50 disabled:cursor-not-allowed" style={{ background: A.statusErrorBg, color: A.statusError }} onClick={() => applyDecision(r.organizerApplicationId, "rejected")}>Отклонить</button>
                  </div>
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td className="py-6 px-3 text-center" colSpan={8} style={{ color: A.textMuted }}>Пока нет organizer applications</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
