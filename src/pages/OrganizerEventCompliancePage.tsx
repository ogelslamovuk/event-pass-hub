import React, { useMemo, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import HelpTooltip from "@/components/ui/help-tooltip";
import { useStorageSync } from "@/hooks/useStorageSync";
import {
  calculateComplianceFee,
  createEventComplianceApplication,
  defaultEventComplianceData,
  updateEventComplianceApplication,
} from "@/lib/store";
import {
  selectCurrentOrganizer,
  selectIsCurrentOrganizerApproved,
  selectMyEventComplianceApplications,
} from "@/lib/organizerSelectors";

export default function OrganizerEventCompliancePage() {
  const { state, update } = useStorageSync();
  const organizer = useMemo(() => selectCurrentOrganizer(state), [state]);
  const approved = useMemo(() => selectIsCurrentOrganizerApproved(state), [state]);
  const myApps = useMemo(() => selectMyEventComplianceApplications(state), [state]);
  const [form, setForm] = useState(defaultEventComplianceData());
  const [editingId, setEditingId] = useState<string | null>(null);

  if (!organizer) return <Navigate to="/organizer/login" replace />;
  if (!approved) return <Navigate to="/organizer" replace />;

  const fee = calculateComplianceFee(form.projectedCapacity, form.plannedTicketsForSale);

  const addMockAttachment = (kind: string, target: "eventDocuments" | "paymentAttachments" | "notificationsAttachment", sample = false) => {
    const file = {
      attachmentId: `${kind}-${Date.now()}`,
      kind,
      name: sample ? `Образец: ${kind}` : `dummy-${kind}-${new Date().toLocaleTimeString()}`,
      uploadedAt: new Date().toISOString(),
      isSample: sample,
    };
    setForm((prev) => ({ ...prev, [target]: [...prev[target], file] }));
  };

  const save = (submit: boolean) => {
    if (submit && !form.title.trim()) {
      toast.error("Укажите наименование мероприятия");
      return;
    }

    const ok = editingId
      ? updateEventComplianceApplication(state, editingId, form, submit)
      : !!createEventComplianceApplication(state, organizer.organizerId, form, submit);

    if (!ok) {
      toast.error("Не удалось сохранить заявку");
      return;
    }
    update({ ...state });
    toast.success(submit ? "Заявка отправлена" : "Черновик сохранён");
    setEditingId(null);
    setForm(defaultEventComplianceData());
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#0B0F14", color: "#F5F7FA" }}>
      <Sonner />
      <div className="mx-auto max-w-5xl rounded-2xl border p-6 space-y-6" style={{ borderColor: "rgba(255,255,255,0.10)", background: "#111A24" }}>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Event Compliance Application</h1>
            <p className="text-sm" style={{ color: "rgba(245,247,250,0.72)" }}>Надстройка над существующим flow. После approve заявка уйдёт в legacy pipeline.</p>
          </div>
          <Link to="/organizer" className="px-3 h-9 inline-flex items-center rounded border">Назад в кабинет</Link>
        </div>

        <section className="space-y-3">
          <h2 className="font-semibold">Основные сведения о мероприятии</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="relative">
              <input className="h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border" placeholder="Наименование" value={form.title} onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Укажите официальное название мероприятия для рассмотрения." /></div>
            </div>
            <div className="relative">
              <input className="h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border" placeholder="Тип мероприятия" value={form.eventType} onChange={(e) => setForm((p) => ({ ...p, eventType: e.target.value }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Например: концерт, спектакль, фестиваль или выставка." /></div>
            </div>
            <input className="h-10 rounded px-3 bg-[#0F1620] border" type="datetime-local" value={form.dateSlots[0] || ""} onChange={(e) => setForm((p) => ({ ...p, dateSlots: [e.target.value] }))} />
            <div className="relative">
              <input className="h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border" placeholder="Место проведения" value={form.venueName} onChange={(e) => setForm((p) => ({ ...p, venueName: e.target.value }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Укажите название площадки, как в договоре или уведомлении." /></div>
            </div>
          </div>
          <div className="relative">
            <input className="h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border" placeholder="Адрес площадки" value={form.venueAddress} onChange={(e) => setForm((p) => ({ ...p, venueAddress: e.target.value }))} />
            <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Введите фактический адрес проведения, включая город и улицу." /></div>
          </div>
          <textarea className="w-full min-h-20 rounded px-3 py-2 bg-[#0F1620] border" placeholder="Краткое описание" value={form.shortDescription} onChange={(e) => setForm((p) => ({ ...p, shortDescription: e.target.value }))} />
          <textarea className="w-full min-h-20 rounded px-3 py-2 bg-[#0F1620] border" placeholder="Программа" value={form.program} onChange={(e) => setForm((p) => ({ ...p, program: e.target.value }))} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Исполнители</h2>
          <div className="flex gap-5 text-sm">
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.onlyBelarusianPerformers} onChange={(e) => setForm((p) => ({ ...p, onlyBelarusianPerformers: e.target.checked }))} /> Только белорусские исполнители</label>
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.hasForeignPerformers} onChange={(e) => setForm((p) => ({ ...p, hasForeignPerformers: e.target.checked }))} /> Есть зарубежные исполнители</label>
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Площадка и вместимость</h2>
          <div className="grid md:grid-cols-3 gap-3">
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Тип площадки" value={form.venueType} onChange={(e) => setForm((p) => ({ ...p, venueType: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" type="number" placeholder="Проектная вместимость" value={form.projectedCapacity ?? ""} onChange={(e) => setForm((p) => ({ ...p, projectedCapacity: e.target.value ? Number(e.target.value) : null }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" type="number" placeholder="Планируемые билеты" value={form.plannedTicketsForSale ?? ""} onChange={(e) => setForm((p) => ({ ...p, plannedTicketsForSale: e.target.value ? Number(e.target.value) : null }))} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Возрастная категория и режим согласования</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <select className="h-10 rounded px-3 bg-[#0F1620] border" value={form.ageCategory} onChange={(e) => setForm((p) => ({ ...p, ageCategory: e.target.value as "0+" | "6+" | "12+" | "16+" | "18+" }))}>
              <option value="0+">0+</option><option value="6+">6+</option><option value="12+">12+</option><option value="16+">16+</option><option value="18+">18+</option>
            </select>
            <select className="h-10 rounded px-3 bg-[#0F1620] border" value={form.approvalMode} onChange={(e) => setForm((p) => ({ ...p, approvalMode: e.target.value as "certificate_required" | "notice_only" | "certificate_not_required" }))}>
              <option value="certificate_required">Требуется удостоверение</option>
              <option value="notice_only">Требуется только уведомление</option>
              <option value="certificate_not_required">Удостоверение не требуется</option>
            </select>
          </div>
          <textarea className="w-full min-h-16 rounded px-3 py-2 bg-[#0F1620] border" placeholder="Основание / комментарий" value={form.approvalBasis} onChange={(e) => setForm((p) => ({ ...p, approvalBasis: e.target.value }))} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Документы по мероприятию</h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("program", "eventDocuments")}>Программа (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("venue-right", "eventDocuments")}>Право на площадку (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("performer-agreement", "eventDocuments")}>Договорённости с исполнителями (mock)</button>
            <button className="px-3 py-2 rounded bg-[#2b3f57]" onClick={() => addMockAttachment("sample", "eventDocuments", true)}>Скачать образец</button>
          </div>
          {form.hasForeignPerformers && (
            <p className="text-xs" style={{ color: "#F2C94C" }}>Для зарубежных исполнителей визуально required: документ на площадку и подтверждение договорённостей.</p>
          )}
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Сроки и госпошлина</h2>
          <input className="h-10 w-full rounded px-3 bg-[#0F1620] border" type="date" value={form.salesStartDate} onChange={(e) => setForm((p) => ({ ...p, salesStartDate: e.target.value }))} />
          <p className="text-xs" style={{ color: "#F2C94C" }}>Документы на удостоверение должны быть поданы заранее, не позднее чем за 10 рабочих дней до начала реализации билетов.</p>
          {form.approvalMode === "certificate_required" && (
            <div className="rounded-xl border p-4 space-y-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0F1620" }}>
              <div>Расчёт пошлины: <b>{fee} БВ</b></div>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.feeExempt} onChange={(e) => setForm((p) => ({ ...p, feeExempt: e.target.checked }))} /> Освобождён от пошлины</label>
              <input className="h-10 w-full rounded px-3 bg-[#111A24] border" placeholder="Основание освобождения" value={form.feeExemptReason} onChange={(e) => setForm((p) => ({ ...p, feeExemptReason: e.target.value }))} />
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.feePaid} onChange={(e) => setForm((p) => ({ ...p, feePaid: e.target.checked }))} /> Пошлина оплачена</label>
              <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("payment-order", "paymentAttachments")}>Платёжка (mock)</button>
            </div>
          )}
        </section>

        <section className="space-y-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.adRestrictionConfirmed} onChange={(e) => setForm((p) => ({ ...p, adRestrictionConfirmed: e.target.checked }))} /> Подтверждаю ограничение на рекламу до получения удостоверения</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.cancelled} onChange={(e) => setForm((p) => ({ ...p, cancelled: e.target.checked }))} /> Мероприятие отменено</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.changesDeclared} onChange={(e) => setForm((p) => ({ ...p, changesDeclared: e.target.checked }))} /> Изменены дата / место / состав участников</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.executiveCommitteeNotified} onChange={(e) => setForm((p) => ({ ...p, executiveCommitteeNotified: e.target.checked }))} /> Исполком уведомлён</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.citizensNotified} onChange={(e) => setForm((p) => ({ ...p, citizensNotified: e.target.checked }))} /> Граждане уведомлены</label>
          <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("notify-proof", "notificationsAttachment")}>Подтверждение уведомления (mock)</button>
          <textarea className="w-full min-h-16 rounded px-3 py-2 bg-[#0F1620] border" placeholder="Комментарий" value={form.cancellationComment} onChange={(e) => setForm((p) => ({ ...p, cancellationComment: e.target.value }))} />
        </section>

        <div className="flex gap-3">
          <div className="inline-flex items-center gap-1">
            <button className="px-4 h-10 rounded bg-[#2b3f57]" onClick={() => save(false)}>Сохранить черновик</button>
            <HelpTooltip text="Сохранит заполненные поля без отправки в регуляторный контур." />
          </div>
          <div className="inline-flex items-center gap-1">
            <button className="px-4 h-10 rounded font-semibold" style={{ background: "#F2C94C", color: "#111" }} onClick={() => save(true)}>Отправить заявку</button>
            <HelpTooltip text="Отправит заявку с текущими данными и приложениями на рассмотрение." />
          </div>
        </div>

        <section className="space-y-2">
          <h2 className="font-semibold">Мои compliance-заявки</h2>
          {myApps.length === 0 ? <div className="text-sm opacity-70">Пока нет заявок.</div> : (
            <div className="space-y-2">
              {myApps.map((app) => (
                <div key={app.eventComplianceApplicationId} className="rounded border p-3 flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                  <div>
                    <div className="font-medium">{app.data.title || "Без названия"}</div>
                    <div className="text-xs opacity-70">{app.eventComplianceApplicationId} · {app.status}</div>
                    {!!app.adminComment && <div className="text-xs mt-1">Комментарий: {app.adminComment}</div>}
                  </div>
                  {app.status === "needs_rework" && (
                    <button
                      className="px-3 py-2 rounded bg-[#1d2a3b]"
                      onClick={() => {
                        setEditingId(app.eventComplianceApplicationId);
                        setForm(app.data);
                      }}
                    >
                      Доработать
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
