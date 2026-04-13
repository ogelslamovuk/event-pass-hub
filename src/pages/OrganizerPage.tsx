import React, { useState, useMemo } from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import type { Application, AppState } from "@/lib/store";
import { createApplication, submitApplication } from "@/lib/store";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import {
  LayoutDashboard, FileText, Calendar, BarChart3, Megaphone,
  FolderOpen, HelpCircle, Plus, Search, X, TrendingUp,
  Clock, CheckCircle, XCircle, ChevronRight, ShieldCheck
} from "lucide-react";

type Section = "dashboard" | "applications" | "events" | "sales" | "reports" | "marketing" | "documents" | "support";

const sidebarItems: { id: Section; label: string; icon: React.ElementType; demo?: boolean }[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "applications", label: "Заявки", icon: FileText },
  { id: "events", label: "Мероприятия", icon: Calendar },
  { id: "sales", label: "Продажи и билеты", icon: BarChart3 },
  { id: "reports", label: "Отчетность", icon: BarChart3 },
  { id: "marketing", label: "Маркетинг", icon: Megaphone, demo: true },
  { id: "documents", label: "Документы", icon: FolderOpen },
  { id: "support", label: "Поддержка", icon: HelpCircle, demo: true },
];

const statusBadge: Record<string, string> = {
  draft: "bg-[#F3F4F6] text-[#374151]",
  submitted: "bg-[#DBEAFE] text-[#1D4ED8]",
  approved: "bg-[#D1FAE5] text-[#065F46]",
  rejected: "bg-[#FEE2E2] text-[#991B1B]",
};
const statusLabel: Record<string, string> = {
  draft: "Черновик",
  submitted: "На рассмотрении",
  approved: "Одобрена",
  rejected: "Отклонена",
};

export default function OrganizerPage() {
  const { state, update } = useStorageSync();
  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerApp, setDrawerApp] = useState<Application | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [venue, setVenue] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [capacity, setCapacity] = useState("");
  const [tiers, setTiers] = useState([
    { name: "Партер", price: "" },
    { name: "Балкон", price: "" },
  ]);
  const [search, setSearch] = useState("");

  const addTier = () => { if (tiers.length < 3) setTiers([...tiers, { name: "", price: "" }]); };
  const removeTier = (i: number) => { if (tiers.length > 2) setTiers(tiers.filter((_, idx) => idx !== i)); };

  const isValid = title.trim() && venue.trim() && dateTime && Number(capacity) > 0 && Number(capacity) <= 5000 &&
    tiers.every((t) => t.name.trim() && Number(t.price) > 0);

  const handleSave = (submit: boolean) => {
    if (!isValid) { toast.error("Заполните все поля корректно"); return; }
    const app = createApplication(state, {
      title: title.trim(), venue: venue.trim(), dateTime,
      capacity: Number(capacity),
      tiers: tiers.map((t) => ({ name: t.name.trim(), price: Number(t.price) })),
    }, submit);
    toast.success(submit ? `Заявка ${app.appId} отправлена` : `Черновик ${app.appId} сохранён`);
    update({ ...state });
    setTitle(""); setVenue(""); setDateTime(""); setCapacity("");
    setTiers([{ name: "Партер", price: "" }, { name: "Балкон", price: "" }]);
    setDrawerOpen(false);
  };

  const handleSubmit = (appId: string) => {
    submitApplication(state, appId);
    toast.success(`Заявка ${appId} отправлена`);
    update({ ...state });
  };

  const filtered = useMemo(() => {
    const s = search.toLowerCase();
    return state.applications.filter((a) =>
      !s || a.appId.toLowerCase().includes(s) || a.title.toLowerCase().includes(s) || a.venue.toLowerCase().includes(s)
    );
  }, [state.applications, search]);

  // KPI
  const kpi = useMemo(() => ({
    draft: state.applications.filter(a => a.status === "draft").length,
    submitted: state.applications.filter(a => a.status === "submitted").length,
    approved: state.applications.filter(a => a.status === "approved").length,
    rejected: state.applications.filter(a => a.status === "rejected").length,
  }), [state.applications]);

  const recentOps = useMemo(() => {
    return state.ops.slice(-6).reverse();
  }, [state.ops]);

  const upcomingEvents = useMemo(() => {
    return state.events.slice(0, 5);
  }, [state.events]);

  const sectionTiles: { id: Section; label: string; desc: string; icon: React.ElementType; coming?: boolean }[] = [
    { id: "applications", label: "Новая заявка", desc: "Создать заявку на мероприятие", icon: Plus },
    { id: "applications", label: "Мои заявки", desc: "Все поданные заявки", icon: FileText },
    { id: "reports", label: "Отчетность", desc: "Финансы и статистика", icon: BarChart3 },
    { id: "marketing", label: "Маркетинг", desc: "Продвижение мероприятий", icon: Megaphone, coming: true },
    { id: "documents", label: "Документы", desc: "Лицензии и договоры", icon: FolderOpen },
    { id: "support", label: "Поддержка", desc: "Помощь и FAQ", icon: HelpCircle, coming: true },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: "#F7F7F8" }}>
      <Sonner />

      {/* Sidebar */}
      <aside className="w-60 min-h-screen border-r flex-shrink-0 flex flex-col"
        style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <div className="font-bold text-base tracking-tight" style={{ color: "#111" }}>Organizer Portal</div>
          <div className="text-xs mt-0.5" style={{ color: "rgba(17,17,17,0.45)" }}>Размещение мероприятий</div>
        </div>
        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {sidebarItems.map(item => {
            const active = activeSection === item.id;
            return (
              <button key={item.id} onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors relative"
                style={{
                  color: active ? "#111" : "rgba(17,17,17,0.70)",
                  background: active ? "rgba(242,201,76,0.15)" : "transparent",
                }}>
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: "#F2C94C" }} />}
                <item.icon size={18} strokeWidth={active ? 2 : 1.5} />
                <span>{item.label}</span>
                {item.demo && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-semibold"
                    style={{ background: "rgba(242,201,76,0.25)", color: "#92710C" }}>demo</span>
                )}
              </button>
            );
          })}
        </nav>
        {/* Avatar placeholder */}
        <div className="px-5 py-4 border-t flex items-center gap-3" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "rgba(242,201,76,0.3)", color: "#92710C" }}>О</div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: "#111" }}>Организатор</div>
            <div className="text-[11px]" style={{ color: "rgba(17,17,17,0.45)" }}>organizer@demo</div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b flex items-center justify-between px-6 h-14"
          style={{ background: "#FFFFFF", borderColor: "rgba(0,0,0,0.08)" }}>
          <h1 className="text-lg font-bold" style={{ color: "#111" }}>
            {sidebarItems.find(s => s.id === activeSection)?.label || "Dashboard"}
          </h1>
          <div className="flex items-center gap-3">
            <button onClick={() => {}} className="h-9 px-4 rounded-xl border text-[13px] font-semibold flex items-center gap-2"
              style={{ borderColor: "rgba(0,0,0,0.14)", color: "#111" }}>
              <ShieldCheck size={14} /> Проверить УНП
            </button>
            <button onClick={() => setDrawerOpen(true)} className="h-9 px-4 rounded-xl text-[13px] font-semibold flex items-center gap-2"
              style={{ background: "#111", color: "#FFF" }}>
              <Plus size={14} /> Создать заявку
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "rgba(242,201,76,0.3)", color: "#92710C" }}>О</div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-5">

            {activeSection === "dashboard" && (
              <>
                {/* KPI row */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {([
                    { label: "Черновики", value: kpi.draft, icon: Clock, trend: "" },
                    { label: "На рассмотрении", value: kpi.submitted, icon: FileText, trend: "" },
                    { label: "Одобрено", value: kpi.approved, icon: CheckCircle, trend: "+2 за неделю" },
                    { label: "Отклонено", value: kpi.rejected, icon: XCircle, trend: "" },
                  ]).map((k, i) => (
                    <div key={i} className="rounded-2xl border p-5"
                      style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                      <div className="flex items-center justify-between mb-3">
                        <k.icon size={18} style={{ color: "rgba(17,17,17,0.45)" }} />
                        {k.trend && (
                          <span className="text-[10px] font-semibold flex items-center gap-0.5"
                            style={{ color: "#059669" }}>
                            <TrendingUp size={10} /> {k.trend}
                          </span>
                        )}
                      </div>
                      <div className="text-2xl font-bold" style={{ color: "#111" }}>{k.value}</div>
                      <div className="text-[13px] mt-1" style={{ color: "rgba(17,17,17,0.45)" }}>{k.label}</div>
                    </div>
                  ))}
                </div>

                {/* Two cols */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Status card */}
                  <div className="rounded-2xl border p-6"
                    style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                    <h2 className="text-lg font-bold mb-4" style={{ color: "#111" }}>Статус организатора</h2>
                    <dl className="space-y-3 text-[13px]">
                      <div className="flex justify-between">
                        <dt style={{ color: "rgba(17,17,17,0.45)" }}>УНП</dt>
                        <dd className="font-medium" style={{ color: "#111" }}>192837465</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt style={{ color: "rgba(17,17,17,0.45)" }}>Реестр</dt>
                        <dd className="font-medium" style={{ color: "#111" }}>Активен</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt style={{ color: "rgba(17,17,17,0.45)" }}>Пошлины</dt>
                        <dd className="font-medium" style={{ color: "#111" }}>Оплачены</dd>
                      </div>
                      <div className="flex justify-between">
                        <dt style={{ color: "rgba(17,17,17,0.45)" }}>Всего заявок</dt>
                        <dd className="font-medium" style={{ color: "#111" }}>{state.applications.length}</dd>
                      </div>
                    </dl>
                  </div>

                  {/* Recent actions */}
                  <div className="rounded-2xl border p-6"
                    style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                    <h2 className="text-lg font-bold mb-4" style={{ color: "#111" }}>Последние действия</h2>
                    {recentOps.length === 0 ? (
                      <div className="text-center py-6">
                        <Clock size={32} className="mx-auto mb-2" style={{ color: "rgba(17,17,17,0.20)" }} />
                        <p className="text-[13px]" style={{ color: "rgba(17,17,17,0.45)" }}>Нет действий</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {recentOps.map(op => (
                          <div key={op.opId} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                            <div>
                              <span className="text-[13px] font-medium" style={{ color: "#111" }}>{op.type}</span>
                              <span className="text-[11px] ml-2" style={{ color: "rgba(17,17,17,0.45)" }}>{op.ticketId || op.eventId}</span>
                            </div>
                            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${op.result === "ok" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"}`}>
                              {op.result}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Upcoming events table */}
                <div className="rounded-2xl border p-6"
                  style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "#111" }}>Ближайшие мероприятия</h2>
                  {upcomingEvents.length === 0 ? (
                    <div className="text-center py-8">
                      <Calendar size={36} className="mx-auto mb-3" style={{ color: "rgba(17,17,17,0.15)" }} />
                      <p className="text-[14px] font-medium mb-1" style={{ color: "rgba(17,17,17,0.45)" }}>Нет мероприятий</p>
                      <p className="text-[13px] mb-4" style={{ color: "rgba(17,17,17,0.35)" }}>Создайте заявку, чтобы начать</p>
                      <button onClick={() => setDrawerOpen(true)} className="h-10 px-5 rounded-xl text-[13px] font-semibold"
                        style={{ background: "#111", color: "#FFF" }}>
                        Создать заявку
                      </button>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-[13px]">
                        <thead>
                          <tr style={{ background: "#F3F4F6" }}>
                            <th className="py-2.5 px-3 text-left font-semibold rounded-l-lg" style={{ color: "rgba(17,17,17,0.70)" }}>EventID</th>
                            <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Название</th>
                            <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Дата</th>
                            <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Статус</th>
                            <th className="py-2.5 px-3 text-left font-semibold rounded-r-lg" style={{ color: "rgba(17,17,17,0.70)" }}>Осталось</th>
                          </tr>
                        </thead>
                        <tbody>
                          {upcomingEvents.map(e => (
                            <tr key={e.eventId} className="border-b transition-colors hover:bg-[rgba(0,0,0,0.02)]" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                              <td className="py-2.5 px-3 font-mono text-xs">{e.eventId}</td>
                              <td className="py-2.5 px-3 font-medium">{e.title}</td>
                              <td className="py-2.5 px-3">{e.dateTime?.replace("T", " ")}</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${e.status === "published" ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#DBEAFE] text-[#1D4ED8]"}`}>
                                  {e.status === "published" ? "Опубликовано" : "Одобрено"}
                                </span>
                              </td>
                              <td className="py-2.5 px-3">{e.remaining}/{e.capacity}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Section tiles */}
                <div>
                  <h2 className="text-lg font-bold mb-4" style={{ color: "#111" }}>Разделы</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionTiles.map((tile, i) => (
                      <button key={i}
                        onClick={() => tile.label === "Новая заявка" ? setDrawerOpen(true) : setActiveSection(tile.id)}
                        className="rounded-2xl border p-5 text-left transition-all hover:shadow-lg group relative"
                        style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}>
                        {tile.coming && (
                          <span className="absolute top-3 right-3 text-[10px] px-2 py-0.5 rounded-full font-semibold"
                            style={{ background: "rgba(242,201,76,0.25)", color: "#92710C" }}>Coming soon</span>
                        )}
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                          style={{ background: "rgba(242,201,76,0.15)" }}>
                          <tile.icon size={20} style={{ color: "#92710C" }} />
                        </div>
                        <div className="text-[14px] font-semibold mb-1" style={{ color: "#111" }}>{tile.label}</div>
                        <div className="text-[12px]" style={{ color: "rgba(17,17,17,0.45)" }}>{tile.desc}</div>
                        <ChevronRight size={16} className="absolute bottom-5 right-5 opacity-0 group-hover:opacity-40 transition-opacity" />
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSection === "applications" && (
              <ApplicationsTable
                filtered={filtered}
                search={search}
                setSearch={setSearch}
                onOpen={setDrawerApp}
                onSubmit={handleSubmit}
                onCreateNew={() => setDrawerOpen(true)}
              />
            )}

            {(activeSection === "events" || activeSection === "sales" || activeSection === "reports" ||
              activeSection === "marketing" || activeSection === "documents" || activeSection === "support") && (
              <PlaceholderSection section={activeSection} onGoBack={() => setActiveSection("dashboard")} />
            )}
          </div>
        </main>
      </div>

      {/* Create Application Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawerOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />
          <div className="relative w-full max-w-md h-full overflow-y-auto animate-in slide-in-from-right"
            style={{ background: "#FFF", boxShadow: "-10px 0 40px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b"
              style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)" }}>
              <h3 className="text-lg font-bold" style={{ color: "#111" }}>Новая заявка</h3>
              <button onClick={() => setDrawerOpen(false)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(0,0,0,0.05)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <Field label="Название *">
                <input className="w-full border rounded-xl px-3 py-2.5 text-[14px]"
                  style={{ borderColor: "rgba(0,0,0,0.14)", background: "#FFF" }}
                  maxLength={80} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Концерт..." />
              </Field>
              <Field label="Площадка *">
                <input className="w-full border rounded-xl px-3 py-2.5 text-[14px]"
                  style={{ borderColor: "rgba(0,0,0,0.14)", background: "#FFF" }}
                  maxLength={60} value={venue} onChange={(e) => setVenue(e.target.value)} placeholder="Зал..." />
              </Field>
              <Field label="Дата и время *">
                <input type="datetime-local" className="w-full border rounded-xl px-3 py-2.5 text-[14px]"
                  style={{ borderColor: "rgba(0,0,0,0.14)", background: "#FFF" }}
                  value={dateTime} onChange={(e) => setDateTime(e.target.value)} />
              </Field>
              <Field label="Вместимость * (1–5000)">
                <input type="number" min={1} max={5000} className="w-full border rounded-xl px-3 py-2.5 text-[14px]"
                  style={{ borderColor: "rgba(0,0,0,0.14)", background: "#FFF" }}
                  value={capacity} onChange={(e) => setCapacity(e.target.value)} />
              </Field>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[13px] font-semibold" style={{ color: "#111" }}>Ценовые категории</span>
                  {tiers.length < 3 && (
                    <button onClick={addTier} className="text-[12px] font-medium" style={{ color: "#F2C94C" }}>+ Добавить</button>
                  )}
                </div>
                {tiers.map((t, i) => (
                  <div key={i} className="flex gap-2 mb-2 items-center">
                    <input className="flex-1 border rounded-xl px-3 py-2.5 text-[14px]"
                      style={{ borderColor: "rgba(0,0,0,0.14)" }}
                      maxLength={20} value={t.name}
                      onChange={(e) => { const n = [...tiers]; n[i].name = e.target.value; setTiers(n); }} placeholder="Категория" />
                    <input type="number" min={1} className="w-24 border rounded-xl px-3 py-2.5 text-[14px]"
                      style={{ borderColor: "rgba(0,0,0,0.14)" }}
                      value={t.price}
                      onChange={(e) => { const n = [...tiers]; n[i].price = e.target.value; setTiers(n); }} placeholder="Цена" />
                    {tiers.length > 2 && (
                      <button onClick={() => removeTier(i)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(0,0,0,0.05)]">
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex gap-3 pt-2">
                <button onClick={() => handleSave(false)} disabled={!isValid}
                  className="flex-1 h-11 rounded-xl border text-[13px] font-semibold disabled:opacity-40"
                  style={{ borderColor: "rgba(0,0,0,0.14)", color: "#111" }}>
                  Черновик
                </button>
                <button onClick={() => handleSave(true)} disabled={!isValid}
                  className="flex-1 h-11 rounded-xl text-[13px] font-semibold disabled:opacity-40"
                  style={{ background: "#111", color: "#FFF" }}>
                  Отправить заявку
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Detail Drawer */}
      {drawerApp && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDrawerApp(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.25)" }} />
          <div className="relative w-full max-w-md h-full overflow-y-auto animate-in slide-in-from-right"
            style={{ background: "#FFF", boxShadow: "-10px 0 40px rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b"
              style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)" }}>
              <h3 className="text-lg font-bold" style={{ color: "#111" }}>Карточка заявки</h3>
              <button onClick={() => setDrawerApp(null)} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-[rgba(0,0,0,0.05)]">
                <X size={18} />
              </button>
            </div>
            <div className="p-6">
              <div className="mb-4">
                <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${statusBadge[drawerApp.status]}`}>
                  {statusLabel[drawerApp.status]}
                </span>
              </div>
              <dl className="space-y-4 text-[13px]">
                {([
                  ["APP ID", drawerApp.appId],
                  ["Название", drawerApp.title],
                  ["Площадка", drawerApp.venue],
                  ["Дата/время", drawerApp.dateTime?.replace("T", " ")],
                  ["Вместимость", String(drawerApp.capacity)],
                  ...(drawerApp.licenseId ? [["LicenseID", drawerApp.licenseId]] : []),
                  ...(drawerApp.eventId ? [["EventID", drawerApp.eventId]] : []),
                ] as [string, string][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <dt style={{ color: "rgba(17,17,17,0.45)" }}>{k}</dt>
                    <dd className="font-medium" style={{ color: "#111" }}>{v}</dd>
                  </div>
                ))}
                <div>
                  <dt className="mb-1" style={{ color: "rgba(17,17,17,0.45)" }}>Категории</dt>
                  <dd className="font-medium" style={{ color: "#111" }}>
                    {drawerApp.tiers.map((t) => `${t.name}: ${t.price}₽`).join(", ")}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-[13px] font-semibold mb-1.5" style={{ color: "#111" }}>{label}</label>
      {children}
    </div>
  );
}

function ApplicationsTable({ filtered, search, setSearch, onOpen, onSubmit, onCreateNew }: {
  filtered: Application[];
  search: string;
  setSearch: (s: string) => void;
  onOpen: (a: Application) => void;
  onSubmit: (id: string) => void;
  onCreateNew: () => void;
}) {
  return (
    <div className="rounded-2xl border p-6"
      style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold" style={{ color: "#111" }}>Мои заявки</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "rgba(17,17,17,0.35)" }} />
            <input className="border rounded-xl pl-9 pr-3 py-2 text-[13px] w-56"
              style={{ borderColor: "rgba(0,0,0,0.14)" }}
              placeholder="Поиск..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <button onClick={onCreateNew} className="h-9 px-4 rounded-xl text-[13px] font-semibold flex items-center gap-2"
            style={{ background: "#111", color: "#FFF" }}>
            <Plus size={14} /> Создать
          </button>
        </div>
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-10">
          <FileText size={36} className="mx-auto mb-3" style={{ color: "rgba(17,17,17,0.15)" }} />
          <p className="text-[14px] font-medium mb-1" style={{ color: "rgba(17,17,17,0.45)" }}>Нет заявок</p>
          <p className="text-[13px] mb-4" style={{ color: "rgba(17,17,17,0.35)" }}>Создайте первую заявку</p>
          <button onClick={onCreateNew} className="h-10 px-5 rounded-xl text-[13px] font-semibold"
            style={{ background: "#111", color: "#FFF" }}>
            Создать заявку
          </button>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: "#F3F4F6" }}>
                <th className="py-2.5 px-3 text-left font-semibold rounded-l-lg" style={{ color: "rgba(17,17,17,0.70)" }}>APP ID</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Название</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Площадка</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Дата/время</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Вместимость</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: "rgba(17,17,17,0.70)" }}>Статус</th>
                <th className="py-2.5 px-3 text-left font-semibold rounded-r-lg" style={{ color: "rgba(17,17,17,0.70)" }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((a) => (
                <tr key={a.appId} className="border-b transition-colors hover:bg-[rgba(0,0,0,0.02)]" style={{ borderColor: "rgba(0,0,0,0.06)" }}>
                  <td className="py-2.5 px-3 font-mono text-xs">{a.appId}</td>
                  <td className="py-2.5 px-3 font-medium">{a.title}</td>
                  <td className="py-2.5 px-3">{a.venue}</td>
                  <td className="py-2.5 px-3">{a.dateTime?.replace("T", " ")}</td>
                  <td className="py-2.5 px-3">{a.capacity}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${statusBadge[a.status]}`}>
                      {statusLabel[a.status]}
                    </span>
                  </td>
                  <td className="py-2.5 px-3 space-x-2">
                    <button onClick={() => onOpen(a)}
                      className="h-7 px-3 rounded-lg border text-[12px] font-medium hover:bg-[rgba(0,0,0,0.03)]"
                      style={{ borderColor: "rgba(0,0,0,0.14)" }}>
                      Открыть
                    </button>
                    {a.status === "draft" && (
                      <button onClick={() => onSubmit(a.appId)}
                        className="h-7 px-3 rounded-lg text-[12px] font-medium"
                        style={{ background: "#111", color: "#FFF" }}>
                        Отправить
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function PlaceholderSection({ section, onGoBack }: { section: string; onGoBack: () => void }) {
  const labels: Record<string, string> = {
    events: "Мероприятия",
    sales: "Продажи и билеты",
    reports: "Отчетность",
    marketing: "Маркетинг",
    documents: "Документы",
    support: "Поддержка",
  };
  return (
    <div className="rounded-2xl border p-10 text-center"
      style={{ background: "#FFF", borderColor: "rgba(0,0,0,0.08)", boxShadow: "0 10px 30px rgba(0,0,0,0.08)" }}>
      <FolderOpen size={40} className="mx-auto mb-3" style={{ color: "rgba(17,17,17,0.15)" }} />
      <h2 className="text-lg font-bold mb-1" style={{ color: "#111" }}>{labels[section] || section}</h2>
      <p className="text-[13px] mb-4" style={{ color: "rgba(17,17,17,0.45)" }}>Раздел в разработке</p>
      <button onClick={onGoBack} className="h-9 px-4 rounded-xl border text-[13px] font-semibold"
        style={{ borderColor: "rgba(0,0,0,0.14)", color: "#111" }}>
        ← Вернуться
      </button>
    </div>
  );
}
