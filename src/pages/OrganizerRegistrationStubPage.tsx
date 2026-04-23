import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import HelpTooltip from "@/components/ui/help-tooltip";
import { useStorageSync } from "@/hooks/useStorageSync";
import {
  createPendingOrganizerAccount,
  defaultIdentityRecord,
  defaultOrganizerApplicationData,
  type IdentityRecord,
  upsertOrganizerApplication,
} from "@/lib/store";

function emptyPerson(): IdentityRecord {
  return defaultIdentityRecord();
}

export default function OrganizerRegistrationStubPage() {
  const navigate = useNavigate();
  const { state, update } = useStorageSync();
  const [form, setForm] = useState(defaultOrganizerApplicationData());
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const missingRequiredFields = useMemo(() => {
    const missing: string[] = [];
    if (!form.legalName.trim()) missing.push("legalName");
    if (!form.registrationNumber.trim()) missing.push("registrationNumber");
    if (!form.postalCode.trim()) missing.push("postalCode");
    if (!form.region.trim()) missing.push("region");
    if (!form.locality.trim()) missing.push("locality");
    if (!form.street.trim()) missing.push("street");
    if (!form.houseNumber.trim()) missing.push("houseNumber");
    if (!form.contactPhone.trim()) missing.push("contactPhone");
    if (!form.email.trim()) missing.push("email");
    if (!form.director.fullName.trim()) missing.push("director.fullName");
    if (!form.director.docType.trim()) missing.push("director.docType");
    if (!form.director.docNumber.trim()) missing.push("director.docNumber");
    if (!form.director.issueDate.trim()) missing.push("director.issueDate");
    if (!form.director.issueAuthority.trim()) missing.push("director.issueAuthority");
    if (form.activities.length === 0 && !form.activityOther.trim()) missing.push("activities");
    if (!form.accountCredentials.login.trim()) missing.push("accountCredentials.login");
    if (!form.accountCredentials.password.trim()) missing.push("accountCredentials.password");
    return missing;
  }, [form]);

  const hasMissingRequiredFields = missingRequiredFields.length > 0;
  const hasMissingConfirmations = !form.confirmations.adminReviewConsent || !form.confirmations.isAccurate;

  const fieldClass = (invalid: boolean) =>
    `h-10 rounded px-3 bg-[#0F1620] border ${invalid ? "border-[#EF4444]" : ""}`;

  const updateDirector = (patch: Partial<IdentityRecord>) => {
    setForm((prev) => ({ ...prev, director: { ...prev.director, ...patch } }));
  };

  const addAttachment = (kind: string, isSample = false) => {
    const file = {
      attachmentId: `${kind}-${Date.now()}`,
      kind,
      isSample,
      name: isSample ? `Образец: ${kind}` : `dummy-${kind}-${new Date().toLocaleTimeString()}`,
      uploadedAt: new Date().toISOString(),
    };
    if (kind.startsWith("past")) {
      setForm((prev) => ({ ...prev, pastMaterials: [...prev.pastMaterials, file] }));
    } else {
      setForm((prev) => ({ ...prev, documents: [...prev.documents, file] }));
    }
  };

  const save = (submit: boolean) => {
    if (submit) {
      setSubmitAttempted(true);
    }

    if (submit && hasMissingRequiredFields) {
      toast.error("Заполните обязательные поля.");
      return;
    }

    if (submit && hasMissingConfirmations) {
      toast.error("Подтвердите достоверность сведений и согласие на рассмотрение заявки.");
      return;
    }

    const organizer = createPendingOrganizerAccount(state, {
      legalName: form.legalName,
      registrationNumber: form.registrationNumber,
      directorName: form.director.fullName,
      email: form.email,
      phone: form.contactPhone,
      login: form.accountCredentials.login,
      password: form.accountCredentials.password,
    });

    const rec = upsertOrganizerApplication(state, organizer.organizerId, form, submit);
    update({ ...state });

    toast.success(submit ? "Заявка отправлена на рассмотрение. Результат будет направлен на указанный email." : "Черновик сохранён");
    if (submit) {
      navigate("/organizer/login", { replace: true, state: { showSubmittedSuccess: true } });
    }
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#0B0F14", color: "#F5F7FA" }}>
      <Sonner />
      <div className="mx-auto max-w-4xl rounded-2xl border p-6 space-y-6" style={{ borderColor: "rgba(255,255,255,0.10)", background: "#111A24" }}>
        <div>
          <h1 className="text-2xl font-bold mb-2">Заявка на статус организатора</h1>
          <p className="text-sm" style={{ color: "rgba(245,247,250,0.72)" }}>MVP форма для включения в mock-реестр организаторов.</p>
          <p className="text-xs mt-2" style={{ color: "rgba(245,247,250,0.72)" }}>Поля, отмеченные *, обязательны.</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-semibold">Данные организации</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="relative">
              <input className={`h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("legalName") ? "border-[#EF4444]" : ""}`} placeholder="Полное наименование *" value={form.legalName} onChange={(e) => setForm((p) => ({ ...p, legalName: e.target.value }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Укажите официальное наименование юридического лица без сокращений." /></div>
            </div>
            <div className="relative">
              <input className={`h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("registrationNumber") ? "border-[#EF4444]" : ""}`} placeholder="Регистрационный номер *" value={form.registrationNumber} onChange={(e) => setForm((p) => ({ ...p, registrationNumber: e.target.value }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Введите номер госрегистрации или УНП, как в регистрационных документах." /></div>
            </div>
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("postalCode"))} placeholder="Почтовый индекс *" value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} />
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("region"))} placeholder="Область *" value={form.region} onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))} />
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("locality"))} placeholder="Населённый пункт *" value={form.locality} onChange={(e) => setForm((p) => ({ ...p, locality: e.target.value }))} />
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("street"))} placeholder="Улица / проспект *" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} />
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("houseNumber"))} placeholder="Номер дома *" value={form.houseNumber} onChange={(e) => setForm((p) => ({ ...p, houseNumber: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Помещение" value={form.roomTypeAndNumber} onChange={(e) => setForm((p) => ({ ...p, roomTypeAndNumber: e.target.value }))} />
            <div className="relative">
              <input className={`h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("contactPhone") ? "border-[#EF4444]" : ""}`} placeholder="Контактный телефон *" value={form.contactPhone} onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Телефон нужен для связи по доработкам и статусу заявки." /></div>
            </div>
            <div className="relative">
              <input className={`h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("email") ? "border-[#EF4444]" : ""}`} placeholder="Email *" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="На этот email придут уведомления по решению и комментариям администратора." /></div>
            </div>
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Интернет-сайт" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} />
            <select className="h-10 rounded px-3 bg-[#0F1620] border" value={form.ownershipType} onChange={(e) => setForm((p) => ({ ...p, ownershipType: e.target.value as "private" | "state" | "mixed" }))}>
              <option value="private">Частная</option>
              <option value="state">Государственная</option>
              <option value="mixed">Смешанная</option>
            </select>
          </div>
          <textarea className="w-full min-h-20 rounded px-3 py-2 bg-[#0F1620] border" placeholder="Дополнительные сведения об адресе" value={form.addressExtra} onChange={(e) => setForm((p) => ({ ...p, addressExtra: e.target.value }))} />
        </section>

        <section className="space-y-3">
          <h2 className="font-semibold">Руководитель</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="relative">
              <input className={`h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("director.fullName") ? "border-[#EF4444]" : ""}`} placeholder="ФИО руководителя *" value={form.director.fullName} onChange={(e) => updateDirector({ fullName: e.target.value })} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Укажите ФИО руководителя точно как в удостоверяющем документе." /></div>
            </div>
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("director.docType"))} placeholder="Вид документа *" value={form.director.docType} onChange={(e) => updateDirector({ docType: e.target.value })} />
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("director.docNumber"))} placeholder="Серия / номер документа *" value={form.director.docNumber} onChange={(e) => updateDirector({ docNumber: e.target.value })} />
            <input className={fieldClass(submitAttempted && missingRequiredFields.includes("director.issueDate"))} type="date" value={form.director.issueDate} onChange={(e) => updateDirector({ issueDate: e.target.value })} />
          </div>
          <input className={`h-10 w-full rounded px-3 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("director.issueAuthority") ? "border-[#EF4444]" : ""}`} placeholder="Орган выдачи *" value={form.director.issueAuthority} onChange={(e) => updateDirector({ issueAuthority: e.target.value })} />
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Работники и учредители</h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => setForm((p) => ({ ...p, workers: [...p.workers, emptyPerson()] }))}>+ Добавить сотрудника</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => setForm((p) => ({ ...p, founders: [...p.founders, emptyPerson()] }))}>+ Добавить учредителя</button>
          </div>
          <p className="text-xs" style={{ color: "rgba(245,247,250,0.65)" }}>Демо-блок. Для подачи заявки в MVP заполнение не требуется.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Вид деятельности *</h2>
          <div className="flex gap-4 text-sm">
            {[
              "Концерты",
              "Фестивали",
              "Театр",
              "Выставки",
            ].map((item) => (
              <label key={item} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.activities.includes(item)}
                  onChange={() =>
                    setForm((p) => ({
                      ...p,
                      activities: p.activities.includes(item) ? p.activities.filter((x) => x !== item) : [...p.activities, item],
                    }))
                  }
                />
                {item}
              </label>
            ))}
          </div>
          <input className={`h-10 w-full rounded px-3 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("activities") ? "border-[#EF4444]" : ""}`} placeholder="Иное" value={form.activityOther} onChange={(e) => setForm((p) => ({ ...p, activityOther: e.target.value }))} />
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Ранее проведённые мероприятия</h2>
          <textarea className="w-full min-h-24 rounded px-3 py-2 bg-[#0F1620] border" placeholder="Описание" value={form.pastEventsDescription} onChange={(e) => setForm((p) => ({ ...p, pastEventsDescription: e.target.value }))} />
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("past-video")}>Загрузить видео (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("past-audio")}>Загрузить аудио (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("past-script")}>Загрузить сценарий (mock)</button>
          </div>
          <p className="text-xs" style={{ color: "rgba(245,247,250,0.65)" }}>Демо-блок. Для подачи заявки в MVP заполнение не требуется.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Документы</h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("registry-statement")}>Загрузить заявление (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("registry-appendix")}>Загрузить приложение (mock)</button>
            <button className="px-3 py-2 rounded bg-[#2b3f57]" onClick={() => addAttachment("sample-registry", true)}>Скачать образец</button>
          </div>
          <p className="text-xs" style={{ color: "rgba(245,247,250,0.65)" }}>Демо-блок. Для подачи заявки в MVP заполнение не требуется.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Доступ в кабинет</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <div className="relative">
              <input className={`h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("accountCredentials.login") ? "border-[#EF4444]" : ""}`} placeholder="Желаемый логин *" value={form.accountCredentials.login} onChange={(e) => setForm((p) => ({ ...p, accountCredentials: { ...p.accountCredentials, login: e.target.value } }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Этот логин будет использоваться для входа в кабинет организатора." /></div>
            </div>
            <div className="relative">
              <input className={`h-10 w-full rounded px-3 pr-9 bg-[#0F1620] border ${submitAttempted && missingRequiredFields.includes("accountCredentials.password") ? "border-[#EF4444]" : ""}`} type="password" placeholder="Пароль *" value={form.accountCredentials.password} onChange={(e) => setForm((p) => ({ ...p, accountCredentials: { ...p.accountCredentials, password: e.target.value } }))} />
              <div className="absolute right-2 top-1/2 -translate-y-1/2"><HelpTooltip text="Задайте пароль не короче 6 символов для первого входа." /></div>
            </div>
          </div>
        </section>

        <section className="space-y-2 text-sm">
          <label className={`flex items-center gap-2 ${submitAttempted && !form.confirmations.isAccurate ? "text-[#FCA5A5]" : ""}`}>
            <input type="checkbox" checked={form.confirmations.isAccurate} onChange={(e) => setForm((p) => ({ ...p, confirmations: { ...p.confirmations, isAccurate: e.target.checked } }))} />
            Подтверждаю достоверность сведений *
          </label>
          <label className={`flex items-center gap-2 ${submitAttempted && !form.confirmations.adminReviewConsent ? "text-[#FCA5A5]" : ""}`}>
            <input type="checkbox" checked={form.confirmations.adminReviewConsent} onChange={(e) => setForm((p) => ({ ...p, confirmations: { ...p.confirmations, adminReviewConsent: e.target.checked } }))} />
            Согласен на рассмотрение заявки администратором *
          </label>
        </section>

        <div className="flex flex-wrap gap-3 pt-2">
          <div className="inline-flex items-center gap-1">
            <button className="px-4 h-10 rounded bg-[#2b3f57]" onClick={() => save(false)}>Сохранить черновик</button>
            <HelpTooltip text="Сохранит текущие данные без отправки на рассмотрение." />
          </div>
          <div className="inline-flex items-center gap-1">
            <button className="px-4 h-10 rounded font-semibold" style={{ background: "#F2C94C", color: "#111" }} onClick={() => save(true)}>Отправить заявку</button>
            <HelpTooltip text="Отправит текущую версию заявки в администрацию на проверку." />
          </div>
          <Link to="/organizer/login" className="px-4 h-10 inline-flex items-center rounded border">Вернуться ко входу</Link>
        </div>
      </div>
    </div>
  );
}
