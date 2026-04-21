import React, { useMemo, useState } from "react";
import type { AppState } from "@/lib/store";
import { calculateComplianceFee, setEventComplianceReview } from "@/lib/store";
import { A } from "./adminStyles";
import HelpTooltip from "@/components/ui/help-tooltip";

interface Props { state: AppState; onUpdate: (s: AppState) => void; }

export default function AdminEventComplianceApplications({ state, onUpdate }: Props) {
  const [comment, setComment] = useState<Record<string, string>>({});
  const [certificateNumber, setCertificateNumber] = useState<Record<string, string>>({});
  const [certificateDate, setCertificateDate] = useState<Record<string, string>>({});
  const [confirmFee, setConfirmFee] = useState<Record<string, boolean>>({});

  const rows = useMemo(() => state.eventComplianceApplications.slice().reverse(), [state.eventComplianceApplications]);

  const applyDecision = (id: string, decision: "approved" | "rejected" | "needs_rework") => {
    const ok = setEventComplianceReview(state, id, {
      decision,
      comment: comment[id] || "",
      certificateNumber: certificateNumber[id] || "",
      certificateDate: certificateDate[id] || "",
      confirmFeePayment: !!confirmFee[id],
    });
    if (!ok) return;
    onUpdate({ ...state });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-1.5">
        <h2 className="text-sm" style={{ color: A.textSecondary }}>Event compliance applications</h2>
        <HelpTooltip text="При одобрении заполните номер и дату удостоверения, а также отметьте подтверждение пошлины." />
      </div>
      <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 12 }} className="overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ background: A.tableHeaderBg }}>
              {[
                "ID",
                "Организатор",
                "Название",
                "Дата",
                "Площадка",
                "Режим",
                "Пошлина",
                "Статус",
                "Действия",
              ].map((h) => (
                <th key={h} className="text-left py-2 px-3 text-xs" style={{ color: A.textSecondary }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => {
              const organizerName = state.organizers.find((o) => o.organizerId === r.organizerId)?.name || r.organizerId;
              const fee = r.data.approvalMode === "certificate_required"
                ? `${calculateComplianceFee(r.data.projectedCapacity, r.data.plannedTicketsForSale)} БВ`
                : "—";
              return (
                <tr key={r.eventComplianceApplicationId} style={{ borderTop: `1px solid ${A.border}` }}>
                  <td className="py-2 px-3 font-mono text-xs">{r.eventComplianceApplicationId}</td>
                  <td className="py-2 px-3">{organizerName}</td>
                  <td className="py-2 px-3">{r.data.title}</td>
                  <td className="py-2 px-3">{r.data.dateSlots[0]?.replace("T", " ") || "—"}</td>
                  <td className="py-2 px-3">{r.data.venueName}</td>
                  <td className="py-2 px-3">{r.data.approvalMode}</td>
                  <td className="py-2 px-3">{fee}</td>
                  <td className="py-2 px-3">{r.status}</td>
                  <td className="py-2 px-3 space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        className="h-8 rounded px-2 text-xs"
                        placeholder="№ удостоверения"
                        value={certificateNumber[r.eventComplianceApplicationId] || ""}
                        onChange={(e) => setCertificateNumber((p) => ({ ...p, [r.eventComplianceApplicationId]: e.target.value }))}
                        style={{ background: A.surfaceBg, border: `1px solid ${A.border}`, color: A.textPrimary }}
                      />
                      <input
                        className="h-8 rounded px-2 text-xs"
                        type="date"
                        value={certificateDate[r.eventComplianceApplicationId] || ""}
                        onChange={(e) => setCertificateDate((p) => ({ ...p, [r.eventComplianceApplicationId]: e.target.value }))}
                        style={{ background: A.surfaceBg, border: `1px solid ${A.border}`, color: A.textPrimary }}
                      />
                    </div>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={!!confirmFee[r.eventComplianceApplicationId]}
                        onChange={(e) => setConfirmFee((p) => ({ ...p, [r.eventComplianceApplicationId]: e.target.checked }))}
                      />
                      Подтвердить оплату
                    </label>
                    <textarea
                      className="w-full min-h-14 rounded px-2 py-1 text-xs"
                      placeholder="Комментарий (обязателен при reject и needs rework)"
                      value={comment[r.eventComplianceApplicationId] || ""}
                      onChange={(e) => setComment((p) => ({ ...p, [r.eventComplianceApplicationId]: e.target.value }))}
                      style={{ background: A.surfaceBg, border: `1px solid ${A.border}`, color: A.textPrimary }}
                    />
                    <div className="flex gap-2 flex-wrap">
                      <button className="px-2 py-1 rounded text-xs" style={{ background: A.statusOkBg, color: A.statusOk }} onClick={() => applyDecision(r.eventComplianceApplicationId, "approved")}>Одобрить заявку</button>
                      <button className="px-2 py-1 rounded text-xs" style={{ background: A.statusWarnBg, color: A.statusWarn }} onClick={() => applyDecision(r.eventComplianceApplicationId, "needs_rework")}>Вернуть на доработку</button>
                      <button className="px-2 py-1 rounded text-xs" style={{ background: A.statusErrorBg, color: A.statusError }} onClick={() => applyDecision(r.eventComplianceApplicationId, "rejected")}>Отклонить</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr>
                <td className="py-6 px-3 text-center" colSpan={9} style={{ color: A.textMuted }}>Пока нет event compliance applications</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
