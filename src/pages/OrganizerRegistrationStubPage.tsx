import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
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

  const canSubmit = useMemo(() => {
    return (
      form.legalName.trim() &&
      form.registrationNumber.trim() &&
      form.director.fullName.trim() &&
      form.email.trim() &&
      form.accountCredentials.login.trim() &&
      form.accountCredentials.password.trim() &&
      form.confirmations.adminReviewConsent &&
      form.confirmations.isAccurate
    );
  }, [form]);

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
    if (submit && !canSubmit) {
      toast.error("Заполните обязательные поля и подтверждения");
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

    toast.success(submit ? `Заявка ${rec.organizerApplicationId} отправлена` : "Черновик сохранён");
    if (submit) {
      navigate("/organizer/login", { replace: true });
    }
  };

  return (
    <div className="min-h-screen px-4 py-8" style={{ background: "#0B0F14", color: "#F5F7FA" }}>
      <Sonner />
      <div className="mx-auto max-w-4xl rounded-2xl border p-6 space-y-6" style={{ borderColor: "rgba(255,255,255,0.10)", background: "#111A24" }}>
        <div>
          <h1 className="text-2xl font-bold mb-2">Заявка на статус организатора</h1>
          <p className="text-sm" style={{ color: "rgba(245,247,250,0.72)" }}>MVP форма для включения в mock-реестр организаторов.</p>
        </div>

        <section className="space-y-3">
          <h2 className="font-semibold">Данные организации</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Полное наименование" value={form.legalName} onChange={(e) => setForm((p) => ({ ...p, legalName: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Регистрационный номер" value={form.registrationNumber} onChange={(e) => setForm((p) => ({ ...p, registrationNumber: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Почтовый индекс" value={form.postalCode} onChange={(e) => setForm((p) => ({ ...p, postalCode: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Область" value={form.region} onChange={(e) => setForm((p) => ({ ...p, region: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Населённый пункт" value={form.locality} onChange={(e) => setForm((p) => ({ ...p, locality: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Улица / проспект" value={form.street} onChange={(e) => setForm((p) => ({ ...p, street: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Номер дома" value={form.houseNumber} onChange={(e) => setForm((p) => ({ ...p, houseNumber: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Помещение" value={form.roomTypeAndNumber} onChange={(e) => setForm((p) => ({ ...p, roomTypeAndNumber: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Контактный телефон" value={form.contactPhone} onChange={(e) => setForm((p) => ({ ...p, contactPhone: e.target.value }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
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
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="ФИО" value={form.director.fullName} onChange={(e) => updateDirector({ fullName: e.target.value })} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Вид документа" value={form.director.docType} onChange={(e) => updateDirector({ docType: e.target.value })} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Серия / номер" value={form.director.docNumber} onChange={(e) => updateDirector({ docNumber: e.target.value })} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" type="date" value={form.director.issueDate} onChange={(e) => updateDirector({ issueDate: e.target.value })} />
          </div>
          <input className="h-10 w-full rounded px-3 bg-[#0F1620] border" placeholder="Орган выдачи" value={form.director.issueAuthority} onChange={(e) => updateDirector({ issueAuthority: e.target.value })} />
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Работники и учредители</h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => setForm((p) => ({ ...p, workers: [...p.workers, emptyPerson()] }))}>+ Добавить сотрудника</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => setForm((p) => ({ ...p, founders: [...p.founders, emptyPerson()] }))}>+ Добавить учредителя</button>
          </div>
          <p className="text-xs" style={{ color: "rgba(245,247,250,0.65)" }}>В MVP сохраняются как список с ФИО + документом.</p>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Вид деятельности</h2>
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
          <input className="h-10 w-full rounded px-3 bg-[#0F1620] border" placeholder="Иное" value={form.activityOther} onChange={(e) => setForm((p) => ({ ...p, activityOther: e.target.value }))} />
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Ранее проведённые мероприятия</h2>
          <textarea className="w-full min-h-24 rounded px-3 py-2 bg-[#0F1620] border" placeholder="Описание" value={form.pastEventsDescription} onChange={(e) => setForm((p) => ({ ...p, pastEventsDescription: e.target.value }))} />
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("past-video")}>Загрузить видео (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("past-audio")}>Загрузить аудио (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("past-script")}>Загрузить сценарий (mock)</button>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Документы</h2>
          <div className="flex gap-2 flex-wrap">
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("registry-statement")}>Загрузить заявление (mock)</button>
            <button className="px-3 py-2 rounded bg-[#1d2a3b]" onClick={() => addAttachment("registry-appendix")}>Загрузить приложение (mock)</button>
            <button className="px-3 py-2 rounded bg-[#2b3f57]" onClick={() => addAttachment("sample-registry", true)}>Скачать образец</button>
          </div>
        </section>

        <section className="space-y-2">
          <h2 className="font-semibold">Доступ в кабинет</h2>
          <div className="grid md:grid-cols-2 gap-3">
            <input className="h-10 rounded px-3 bg-[#0F1620] border" placeholder="Желаемый логин" value={form.accountCredentials.login} onChange={(e) => setForm((p) => ({ ...p, accountCredentials: { ...p.accountCredentials, login: e.target.value } }))} />
            <input className="h-10 rounded px-3 bg-[#0F1620] border" type="password" placeholder="Пароль" value={form.accountCredentials.password} onChange={(e) => setForm((p) => ({ ...p, accountCredentials: { ...p.accountCredentials, password: e.target.value } }))} />
          </div>
        </section>

        <section className="space-y-2 text-sm">
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.confirmations.isAccurate} onChange={(e) => setForm((p) => ({ ...p, confirmations: { ...p.confirmations, isAccurate: e.target.checked } }))} /> Подтверждаю достоверность сведений</label>
          <label className="flex items-center gap-2"><input type="checkbox" checked={form.confirmations.adminReviewConsent} onChange={(e) => setForm((p) => ({ ...p, confirmations: { ...p.confirmations, adminReviewConsent: e.target.checked } }))} /> Согласен на рассмотрение заявки администратором</label>
        </section>

        <div className="flex flex-wrap gap-3 pt-2">
          <button className="px-4 h-10 rounded bg-[#2b3f57]" onClick={() => save(false)}>Сохранить черновик</button>
          <button className="px-4 h-10 rounded font-semibold" style={{ background: "#F2C94C", color: "#111" }} onClick={() => save(true)}>Отправить заявку</button>
          <Link to="/organizer/login" className="px-4 h-10 inline-flex items-center rounded border">Вернуться ко входу</Link>
        </div>
      </div>
    </div>
  );
}
