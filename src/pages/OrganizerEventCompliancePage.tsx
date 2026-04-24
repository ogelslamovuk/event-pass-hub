import React, { useEffect, useMemo, useState } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const organizer = useMemo(() => selectCurrentOrganizer(state), [state]);
  const approved = useMemo(() => selectIsCurrentOrganizerApproved(state), [state]);
  const myApps = useMemo(() => selectMyEventComplianceApplications(state), [state]);
  const [form, setForm] = useState(defaultEventComplianceData());
  const [tierErrors, setTierErrors] = useState<number[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const complianceStatusLabel: Record<string, string> = {
    draft: "Черновик",
    submitted: "На рассмотрении",
    approved: "Одобрена",
    rejected: "Отклонена",
    needs_rework: "Требует доработки",
  };

  const editId = searchParams.get("edit");
  const editingApplication = editId ? myApps.find((app) => app.eventComplianceApplicationId === editId) : null;
  useEffect(() => {
    if (!organizer || !approved || !editId || !editingApplication) return;
    setEditingId(editId);
    setForm({
      ...editingApplication.data,
      ticketTiers: editingApplication.data.ticketTiers?.length ? editingApplication.data.ticketTiers : [{ name: "Стандарт", quantity: 0, price: 0 }],
    });
  }, [approved, editId, editingApplication, organizer]);

  if (!organizer) return <Navigate to="/organizer/login" replace />;
  if (!approved) return <Navigate to="/organizer" replace />;

  const totalPlannedTickets = form.ticketTiers.reduce((acc, tier) => acc + (Number.isFinite(tier.quantity) ? Math.max(0, Math.floor(tier.quantity)) : 0), 0);
  const fee = calculateComplianceFee(form.projectedCapacity, totalPlannedTickets, form.ticketTiers);

  const normalizeDateTimeLocal = (value: string | null | undefined): string => {
    const raw = (value || "").trim();
    if (!raw) return "";
    const m = raw.match(/^(\d{4}-\d{2}-\d{2})[T ](\d{2}:\d{2})/);
    if (m) return `${m[1]}T${m[2]}`;
    const parsed = new Date(raw);
    if (Number.isNaN(parsed.getTime())) return "";
    const yyyy = parsed.getFullYear();
    const mm = String(parsed.getMonth() + 1).padStart(2, "0");
    const dd = String(parsed.getDate()).padStart(2, "0");
    const hh = String(parsed.getHours()).padStart(2, "0");
    const mi = String(parsed.getMinutes()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}T${hh}:${mi}`;
  };

  const normalizeFormPayload = () => {
    const normalizedTitle = (form.title || "").replace(/\s+/g, " ").trim();
    const firstDateSlot = normalizeDateTimeLocal(form.dateSlots[0]);
    const normalizedTiers = (form.ticketTiers || []).map((tier) => ({
      name: (tier.name || "").trim(),
      quantity: Number.isFinite(tier.quantity) ? Math.max(0, Math.floor(tier.quantity)) : 0,
      price: Number.isFinite(tier.price) ? Math.max(0, tier.price) : 0,
    }));
    return {
      ...form,
      title: normalizedTitle,
      dateSlots: [firstDateSlot, ...form.dateSlots.slice(1)],
      ticketTiers: normalizedTiers,
      plannedTicketsForSale: normalizedTiers.reduce((acc, tier) => acc + tier.quantity, 0),
    };
  };

  const validateTicketTiers = () => {
    const rows = form.ticketTiers || [];
    const invalidRows = rows.reduce<number[]>((acc, tier, index) => {
      if (!tier.name?.trim() || !Number.isFinite(tier.quantity) || tier.quantity <= 0 || !Number.isFinite(tier.price) || tier.price < 0) {
        acc.push(index);
      }
      return acc;
    }, []);
    setTierErrors(invalidRows);
    return rows.length > 0 && totalPlannedTickets > 0 && invalidRows.length === 0;
  };

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
    if (submit && !validateTicketTiers()) {
      toast.error("Заполните тарифы билетов: название, количество и стоимость.");
      return;
    }
    const payload = normalizeFormPayload();
    if (submit && !payload.title) {
      toast.error("Укажите наименование мероприятия");
      return;
    }

    const ok = editingId
      ? updateEventComplianceApplication(state, editingId, payload, submit)
      : !!createEventComplianceApplication(state, organizer.organizerId, payload, submit);

    if (!ok) {
      toast.error("Не удалось сохранить заявку");
      return;
    }
    update({ ...state });
    toast.success(submit ? "Заявка отправлена." : "Черновик сохранён.");
    if (submit) {
      setEditingId(null);
      setForm(defaultEventComplianceData());
      setTierErrors([]);
    }
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#0B0F14", color: "#F5F7FA" }}>
      <Sonner />
      <div className="mx-auto max-w-5xl rounded-2xl border p-6 space-y-6" style={{ borderColor: "rgba(255,255,255,0.10)", background: "#111A24" }}>
        <div className="flex justify-between items-start gap-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">Заявка на согласование мероприятия</h1>
            <p className="text-sm" style={{ color: "rgba(245,247,250,0.72)" }}>Надстройка над существующим процессом. После одобрения заявка уйдёт в основной конвейер.</p>
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
            <input className="h-10 rounded px-3 bg-[#0F1620] border" type="datetime-local" value={normalizeDateTimeLocal(form.dateSlots[0])} onChange={(e) => setForm((p) => ({ ...p, dateSlots: [normalizeDateTimeLocal(e.target.value), ...p.dateSlots.slice(1)] }))} />
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
          <div className="grid md:grid-cols-2 gap-3">
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Тип площадки" value={form.venueType} onChange={(e) => setForm((p) => ({ ...p, venueType: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" type="number" placeholder="Проектная вместимость" value={form.projectedCapacity ?? ""} onChange={(e) => setForm((p) => ({ ...p, projectedCapacity: e.target.value ? Number(e.target.value) : null }))} />
          </div>
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Тарифы билетов</h2>
          <p className="text-xs" style={{ color: "rgba(245,247,250,0.72)" }}>Количество билетов и стоимость задаются по каждому тарифу отдельно.</p>
          <div className="space-y-2">
            {form.ticketTiers.map((tier, idx) => {
              const hasError = tierErrors.includes(idx);
              return (
                <div key={`${idx}-${tier.name}`} className="grid md:grid-cols-[1.2fr_1fr_1fr_auto] gap-2 items-center">
                  <input
                    className="h-10 rounded px-3 bg-[#0F1620] border"
                    style={hasError ? { borderColor: "#f87171" } : undefined}
                    placeholder="Тариф"
                    value={tier.name}
                    onChange={(e) => setForm((p) => ({ ...p, ticketTiers: p.ticketTiers.map((row, rowIdx) => rowIdx === idx ? { ...row, name: e.target.value } : row) }))}
                  />
                  <input
                    className="h-10 rounded px-3 bg-[#0F1620] border"
                    style={hasError ? { borderColor: "#f87171" } : undefined}
                    type="number"
                    min={0}
                    placeholder="Количество"
                    value={Number.isFinite(tier.quantity) ? tier.quantity : 0}
                    onChange={(e) => setForm((p) => ({ ...p, ticketTiers: p.ticketTiers.map((row, rowIdx) => rowIdx === idx ? { ...row, quantity: e.target.value ? Number(e.target.value) : 0 } : row) }))}
                  />
                  <input
                    className="h-10 rounded px-3 bg-[#0F1620] border"
                    style={hasError ? { borderColor: "#f87171" } : undefined}
                    type="number"
                    min={0}
                    placeholder="Стоимость билета"
                    value={Number.isFinite(tier.price) ? tier.price : 0}
                    onChange={(e) => setForm((p) => ({ ...p, ticketTiers: p.ticketTiers.map((row, rowIdx) => rowIdx === idx ? { ...row, price: e.target.value ? Number(e.target.value) : 0 } : row) }))}
                  />
                  <button
                    className="h-10 px-3 rounded bg-[#1d2a3b] disabled:opacity-50"
                    disabled={form.ticketTiers.length <= 1}
                    onClick={() => setForm((p) => ({ ...p, ticketTiers: p.ticketTiers.filter((_, rowIdx) => rowIdx !== idx) }))}
                  >
                    Удалить
                  </button>
                </div>
              );
            })}
          </div>
          <div className="flex items-center justify-between gap-3">
            <button
              className="px-3 h-9 rounded bg-[#1d2a3b]"
              onClick={() => setForm((p) => ({ ...p, ticketTiers: [...p.ticketTiers, { name: "", quantity: 0, price: 0 }] }))}
            >
              Добавить тариф
            </button>
            <div className="text-xs" style={{ color: "rgba(245,247,250,0.72)" }}>Итого планируемых билетов: {totalPlannedTickets}</div>
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
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("program", "eventDocuments")}>Программа (тест)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("venue-right", "eventDocuments")}>Право на площадку (тест)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("performer-agreement", "eventDocuments")}>Договорённости с исполнителями (тест)</button>
            <button className="px-3 py-2 rounded bg-[#2b3f57]" onClick={() => addMockAttachment("sample", "eventDocuments", true)}>Скачать образец</button>
          </div>
          {form.hasForeignPerformers && (
            <p className="text-xs" style={{ color: "#F2C94C" }}>Для зарубежных исполнителей обязательно: документ на площадку и подтверждение договорённостей.</p>
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
              <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("payment-order", "paymentAttachments")}>Платёжка (тест)</button>
            </div>
          )}
        </section>

        <section className="space-y-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.adRestrictionConfirmed} onChange={(e) => setForm((p) => ({ ...p, adRestrictionConfirmed: e.target.checked }))} /> Подтверждаю ограничение на рекламу до получения удостоверения</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.cancelled} onChange={(e) => setForm((p) => ({ ...p, cancelled: e.target.checked }))} /> Мероприятие отменено</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.changesDeclared} onChange={(e) => setForm((p) => ({ ...p, changesDeclared: e.target.checked }))} /> Изменены дата / место / состав участников</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.executiveCommitteeNotified} onChange={(e) => setForm((p) => ({ ...p, executiveCommitteeNotified: e.target.checked }))} /> Исполком уведомлён</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.citizensNotified} onChange={(e) => setForm((p) => ({ ...p, citizensNotified: e.target.checked }))} /> Граждане уведомлены</label>
          <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addMockAttachment("notify-proof", "notificationsAttachment")}>Подтверждение уведомления (тест)</button>
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
          <h2 className="font-semibold">Мои заявки</h2>
          {myApps.length === 0 ? <div className="text-sm opacity-70">Пока нет заявок.</div> : (
            <div className="space-y-2">
              {myApps.map((app) => (
                <div key={app.eventComplianceApplicationId} className="rounded border p-3 flex items-center justify-between" style={{ borderColor: "rgba(255,255,255,0.12)" }}>
                  <div>
                    <div className="font-medium">{app.data.title || "Без названия"}</div>
                    <div className="text-xs opacity-70">{app.eventComplianceApplicationId} · {complianceStatusLabel[app.status] || app.status}</div>
                    {!!app.adminComment && <div className="text-xs mt-1"><span className="opacity-70">Комментарий администратора:</span> {app.adminComment}</div>}
                  </div>
                  {(app.status === "needs_rework" || app.status === "draft") && (
                    <button
                      className="px-3 py-2 rounded bg-[#1d2a3b]"
                      onClick={() => {
                        setEditingId(app.eventComplianceApplicationId);
                        setForm({
                          ...app.data,
                          ticketTiers: app.data.ticketTiers?.length ? app.data.ticketTiers : [{ name: "Стандарт", quantity: 0, price: 0 }],
                        });
                        setTierErrors([]);
                      }}
                    >
                      {app.status === "draft" ? "Продолжить" : "Доработать"}
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
