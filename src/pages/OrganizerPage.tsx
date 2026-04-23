import React, { useMemo, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import HelpTooltip from "@/components/ui/help-tooltip";
import { useStorageSync } from "@/hooks/useStorageSync";
import type { Application, EventRecord, OrganizerDocument, OrganizerSaleRecord } from "@/lib/store";
import { logoutOrganizer, submitApplication } from "@/lib/store";
import {
  DEMO_VAT_RATE,
  selectCurrentOrganizer,
  selectIsCurrentOrganizerApproved,
  selectMyEventComplianceApplications,
  selectMyApplications,
  selectMyDocuments,
  selectMyEvents,
  selectMyOrganizerApplication,
  selectMyOrganizerApplicationHistory,
  selectMyOrganizerRegistryRecord,
  selectMyReportingRows,
  selectMySales,
} from "@/lib/organizerSelectors";
import {
  BarChart3,
  Calendar,
  CheckCircle,
  ChevronDown,
  Clock,
  FileText,
  FolderOpen,
  HelpCircle,
  LayoutDashboard,
  Megaphone,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  User,
  X,
  XCircle,
} from "lucide-react";

type Section = "dashboard" | "applications" | "events" | "sales" | "reports" | "marketing" | "documents" | "support";
type AppFilter = "all" | "draft" | "submitted" | "approved" | "rejected";
type SortDirection = "asc" | "desc";

const sidebarItems: { id: Section; label: string; icon: React.ElementType; demo?: boolean }[] = [
  { id: "dashboard", label: "Дашборд", icon: LayoutDashboard },
  { id: "applications", label: "Заявки", icon: FileText },
  { id: "events", label: "Мероприятия", icon: Calendar },
  { id: "sales", label: "Продажи и билеты", icon: BarChart3 },
  { id: "reports", label: "Отчетность", icon: BarChart3 },
  { id: "marketing", label: "Маркетинг", icon: Megaphone, demo: true },
  { id: "documents", label: "Документы", icon: FolderOpen },
  { id: "support", label: "Поддержка", icon: HelpCircle },
];

const statusStyle: Record<string, React.CSSProperties> = {
  draft: { background: "rgba(148,163,184,0.18)", color: "#94A3B8" },
  submitted: { background: "rgba(59,130,246,0.18)", color: "#3B82F6" },
  approved: { background: "rgba(34,197,94,0.18)", color: "#22C55E" },
  rejected: { background: "rgba(239,68,68,0.18)", color: "#EF4444" },
};

const statusLabel: Record<string, string> = {
  draft: "Черновик",
  submitted: "На рассмотрении",
  approved: "Одобрено",
  rejected: "Отклонено",
};

const T = {
  pageBg: "#0B0F14",
  sidebarBg: "#0F1620",
  cardBg: "#111A24",
  border: "rgba(255,255,255,0.06)",
  textPrimary: "#F5F7FA",
  textSecondary: "rgba(245,247,250,0.84)",
  textMuted: "rgba(245,247,250,0.62)",
  gold: "#F2C94C",
  goldBg: "rgba(242,201,76,0.14)",
  goldBgHover: "rgba(242,201,76,0.08)",
  goldBorder: "rgba(242,201,76,0.25)",
  tableHeaderBg: "rgba(255,255,255,0.04)",
  cardShadow: "0 14px 40px rgba(0,0,0,0.35)",
  cardGradient: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
  btnSecondaryBorder: "rgba(255,255,255,0.12)",
  btnSecondaryHover: "rgba(255,255,255,0.04)",
};

function fmtDateTime(v: string): string {
  return v?.replace("T", " ").slice(0, 16) || "—";
}

function sortDir(next: boolean): SortDirection {
  return next ? "asc" : "desc";
}

export default function OrganizerPage() {
  const navigate = useNavigate();
  const { state, update } = useStorageSync();
  const organizer = selectCurrentOrganizer(state);

  const [activeSection, setActiveSection] = useState<Section>("dashboard");
  const [drawerApp, setDrawerApp] = useState<Application | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [profileCardOpen, setProfileCardOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [appFilter, setAppFilter] = useState<AppFilter>("all");
  const [appSort, setAppSort] = useState<{ key: "title" | "city" | "dateTime" | "capacity" | "status"; dir: SortDirection } | null>(null);
  const [eventSort, setEventSort] = useState<{ key: "title" | "city" | "dateTime" | "capacity" | "status"; dir: SortDirection } | null>(null);

  const myApplications = useMemo(() => selectMyApplications(state), [state]);
  const myComplianceApplications = useMemo(() => selectMyEventComplianceApplications(state), [state]);
  const myEvents = useMemo(() => selectMyEvents(state), [state]);
  const mySales = useMemo(() => selectMySales(state), [state]);
  const reportingRows = useMemo(() => selectMyReportingRows(state), [state]);
  const myDocuments = useMemo(() => selectMyDocuments(state), [state]);
  const organizerApp = useMemo(() => selectMyOrganizerApplication(state), [state]);
  const organizerAppHistory = useMemo(() => selectMyOrganizerApplicationHistory(state), [state]);
  const isOrganizerApproved = useMemo(() => selectIsCurrentOrganizerApproved(state), [state]);
  const organizerRegistryRecord = useMemo(() => selectMyOrganizerRegistryRecord(state), [state]);

  const kpi = {
    draft: myApplications.filter((a) => a.status === "draft").length,
    submitted: myApplications.filter((a) => a.status === "submitted").length,
    approved: myApplications.filter((a) => a.status === "approved").length,
    rejected: myApplications.filter((a) => a.status === "rejected").length,
  };

  const recentOps = useMemo(() => {
    const allowedEventIds = new Set(myEvents.map((e) => e.eventId));
    return state.ops.filter((op) => allowedEventIds.has(op.eventId)).slice(-6).reverse();
  }, [state.ops, myEvents]);

  const upcomingEvents = useMemo(() => {
    return [...myEvents]
      .sort((a, b) => a.dateTime.localeCompare(b.dateTime))
      .slice(0, 5);
  }, [myEvents]);

  const filteredApplications = useMemo(() => {
    const q = search.trim().toLowerCase();
    const filtered = myApplications.filter((a) => {
      if (appFilter !== "all" && a.status !== appFilter) return false;
      if (!q) return true;
      return [a.appId, a.title, a.venue, a.city, a.category].join(" ").toLowerCase().includes(q);
    });
    if (!appSort) return filtered;
    const sorted = [...filtered].sort((a, b) => {
      const va = String(a[appSort.key]);
      const vb = String(b[appSort.key]);
      return appSort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
    return sorted;
  }, [myApplications, appFilter, search, appSort]);

  const filteredEvents = useMemo(() => {
    const filtered = [...myEvents];
    if (!eventSort) return filtered;
    return filtered.sort((a, b) => {
      const va = String(a[eventSort.key]);
      const vb = String(b[eventSort.key]);
      return eventSort.dir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
    });
  }, [myEvents, eventSort]);

  const totals = useMemo(() => {
    const salesCount = reportingRows.length;
    const totalTickets = reportingRows.reduce((sum, r) => sum + r.quantity, 0);
    const revenue = reportingRows.reduce((sum, r) => sum + r.saleAmount, 0);
    const vat = reportingRows.reduce((sum, r) => sum + r.vatAmount, 0);
    const net = reportingRows.reduce((sum, r) => sum + r.netRevenue, 0);
    return { salesCount, totalTickets, revenue, vat, net };
  }, [reportingRows]);

  if (!organizer) {
    return <Navigate to="/organizer/login" replace />;
  }

  if (!isOrganizerApproved) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F14", color: "#F5F7FA" }}>
        <div className="w-full max-w-2xl rounded-2xl border p-7 space-y-5" style={{ borderColor: "rgba(255,255,255,0.10)", background: "#111A24" }}>
          <h1 className="text-2xl font-bold">Кабинет организатора (ограниченный режим)</h1>
          <p className="text-sm" style={{ color: "rgba(245,247,250,0.75)" }}>
            Полный кабинет откроется после одобрения заявки на статус организатора.
          </p>
          <div className="rounded-xl border p-4 text-sm space-y-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0F1620" }}>
            <div>Статус заявки: <b>{organizerApp?.status ?? "заявка отсутствует"}</b></div>
            {organizerApp?.adminComment && <div>Комментарий администратора: {organizerApp.adminComment}</div>}
            <div>Отправлена: {organizerApp?.submittedAt ? organizerApp.submittedAt.slice(0, 16).replace("T", " ") : "—"}</div>
          </div>
          {organizerAppHistory.length > 0 && (
            <div className="rounded-xl border p-4 text-xs space-y-2" style={{ borderColor: "rgba(255,255,255,0.12)", background: "#0F1620" }}>
              <div className="font-semibold">История попыток</div>
              {organizerAppHistory.slice(0, 5).map((attempt) => (
                <div key={attempt.organizerApplicationId} className="flex flex-wrap gap-2">
                  <span>{attempt.organizerApplicationId}</span>
                  <span>·</span>
                  <span>{attempt.status}</span>
                  <span>·</span>
                  <span>{attempt.submittedAt ? attempt.submittedAt.slice(0, 16).replace("T", " ") : "черновик"}</span>
                </div>
              ))}
            </div>
          )}
          <div className="text-xs" style={{ color: "rgba(245,247,250,0.55)" }}>
            Если статус Needs rework, обновите и отправьте заявку на странице «Стать организатором».
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                logoutOrganizer(state);
                update({ ...state });
                navigate("/organizer/login", { replace: true });
              }}
              className="px-4 h-10 rounded-xl text-sm font-semibold"
              style={{ background: "#F2C94C", color: "#111" }}
            >
              Выйти
            </button>
          </div>
        </div>
      </div>
    );
  }
  void organizerRegistryRecord;

  const handleSubmit = (appId: string) => {
    submitApplication(state, appId);
    toast.success(`Заявка ${appId} отправлена`);
    update({ ...state });
  };

  const openFilteredApplications = (filter: AppFilter) => {
    setAppFilter(filter);
    setActiveSection("applications");
  };

  const handleLogout = () => {
    logoutOrganizer(state);
    update({ ...state });
    navigate("/organizer/login", { replace: true });
  };

  const openUnpCheck = () => {
    toast.success(`УНП подтвержден: ${organizer.unp}. Организатор зарегистрирован в реестре. Данные актуальны на 15.04.2026.`);
  };

  const sectionTiles: { id: Section; label: string; desc: string; icon: React.ElementType }[] = [
    { id: "applications", label: "Новая заявка", desc: "Создать заявку на мероприятие", icon: Plus },
    { id: "applications", label: "Мои заявки", desc: "Управление статусами заявок", icon: FileText },
    { id: "reports", label: "Отчетность", desc: "Финансовые показатели и НДС", icon: BarChart3 },
    { id: "marketing", label: "Маркетинг", desc: "Раздел будет расширен позже", icon: Megaphone },
    { id: "documents", label: "Документы", desc: "Реестр, договоры, реквизиты", icon: FolderOpen },
    { id: "support", label: "Поддержка", desc: "Каналы связи и AI-помощник", icon: HelpCircle },
  ];

  return (
    <div className="min-h-screen flex" style={{ background: T.pageBg, color: T.textPrimary }}>
      <Sonner
        theme="dark"
        toastOptions={{
          style: { background: T.cardBg, border: `1px solid ${T.border}`, color: T.textPrimary },
        }}
      />
      <button
        onClick={() => navigate("/organizer/compliance")}
        className="fixed right-5 bottom-5 z-20 px-4 h-10 rounded-xl text-sm font-semibold shadow-lg"
        style={{ background: T.gold, color: "#111" }}
      >
        Новая заявка
      </button>

      <aside className="w-60 min-h-screen border-r flex-shrink-0 flex flex-col" style={{ background: T.sidebarBg, borderColor: T.border }}>
        <div className="px-5 py-5 border-b" style={{ borderColor: T.border }}>
          <div className="font-semibold text-base" style={{ color: T.textPrimary }}>Кабинет организатора</div>
          <div className="text-xs mt-0.5" style={{ color: T.textMuted }}>Управление мероприятиями и продажами</div>
        </div>

        <nav className="flex-1 py-3 px-2 space-y-0.5">
          {sidebarItems.map((item) => {
            const active = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-colors relative"
                style={{ color: active ? T.textPrimary : T.textSecondary, background: active ? "rgba(242,201,76,0.10)" : "transparent" }}
              >
                {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full" style={{ background: T.gold }} />}
                <item.icon size={18} strokeWidth={active ? 2 : 1.5} style={{ color: active ? T.textPrimary : T.textSecondary }} />
                <span>{item.label}</span>
                {item.demo && (
                  <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full font-semibold" style={{ background: T.goldBg, color: T.gold }}>
                    демо
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <button
          onClick={() => setProfileCardOpen(true)}
          className="px-5 py-4 border-t flex items-center gap-3 text-left transition-colors"
          style={{ borderColor: T.border }}
          onMouseEnter={(e) => { e.currentTarget.style.background = T.btnSecondaryHover; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
        >
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: T.goldBg, color: T.gold }}>
            {organizer.name[0]}
          </div>
          <div>
            <div className="text-[13px] font-semibold" style={{ color: T.textPrimary }}>{organizer.name}</div>
            <div className="text-[11px]" style={{ color: T.textMuted }}>{organizer.email}</div>
          </div>
        </button>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="sticky top-0 z-40 border-b flex items-center justify-between px-6 h-14" style={{ background: T.sidebarBg, borderColor: T.border }}>
          <h1 className="text-lg font-semibold" style={{ color: T.textPrimary }}>
            {sidebarItems.find((s) => s.id === activeSection)?.label || "Дашборд"}
          </h1>
          <div className="flex items-center gap-3">
            <button
              onClick={openUnpCheck}
              className="h-9 px-4 rounded-xl border text-[13px] font-semibold flex items-center gap-2 transition-colors"
              style={{ borderColor: T.btnSecondaryBorder, color: T.textSecondary, background: "transparent" }}
            >
              <ShieldCheck size={14} /> Проверить УНП
            </button>
            <button onClick={() => navigate("/organizer/compliance")} className="h-9 px-4 rounded-xl text-[13px] font-semibold flex items-center gap-2 org-btn-primary" style={{ background: "#111111", color: "#FFF" }}>
              <Plus size={14} /> Создать заявку
            </button>
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
                style={{ background: T.goldBg, color: T.gold }}
              >
                {organizer.name[0]}
              </button>
              {profileOpen && (
                <div className="absolute right-0 mt-2 w-72 rounded-xl border p-4 z-50" style={{ background: T.cardBg, borderColor: T.border }}>
                  <div className="text-sm font-semibold mb-2">Профиль организатора</div>
                  <div className="space-y-1 text-xs" style={{ color: T.textSecondary }}>
                    <p><span style={{ color: T.textMuted }}>Организация:</span> {organizer.fullName}</p>
                    <p><span style={{ color: T.textMuted }}>УНП:</span> {organizer.unp}</p>
                    <p><span style={{ color: T.textMuted }}>Реестр:</span> {organizer.registryStatus}</p>
                    <p><span style={{ color: T.textMuted }}>Дата регистрации:</span> {organizer.registryRegisteredAt}</p>
                    <p><span style={{ color: T.textMuted }}>Директор:</span> {organizer.director}</p>
                    <p><span style={{ color: T.textMuted }}>Email:</span> {organizer.email}</p>
                    <p><span style={{ color: T.textMuted }}>Телефон:</span> {organizer.phone}</p>
                  </div>
                  <button onClick={handleLogout} className="mt-3 w-full h-9 rounded-lg text-sm font-semibold" style={{ background: "rgba(239,68,68,0.18)", color: "#EF4444" }}>
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          <div className="max-w-[1200px] mx-auto space-y-5">
            {activeSection === "dashboard" && (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: "Черновики", value: kpi.draft, icon: Clock, filter: "draft" as const },
                    { label: "На рассмотрении", value: kpi.submitted, icon: FileText, filter: "submitted" as const },
                    { label: "Одобрено", value: kpi.approved, icon: CheckCircle, filter: "approved" as const },
                    { label: "Отклонено", value: kpi.rejected, icon: XCircle, filter: "rejected" as const },
                  ].map((k) => (
                    <button
                      key={k.label}
                      onClick={() => openFilteredApplications(k.filter)}
                      className="rounded-[18px] border p-5 text-left transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: T.cardBg, backgroundImage: T.cardGradient, borderColor: T.border, boxShadow: T.cardShadow }}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: T.goldBg }}>
                          <k.icon size={18} style={{ color: T.gold }} />
                        </div>
                      </div>
                      <div className="text-[28px] font-bold" style={{ color: T.textPrimary }}>{k.value}</div>
                      <div className="text-[13px] mt-1" style={{ color: T.textSecondary }}>{k.label}</div>
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Статус организатора</h2>
                    <dl className="space-y-3 text-[13px]">
                      <Row dt="УНП" dd={organizer.unp} />
                      <Row dt="Статус" dd={organizer.registryStatus} />
                      <Row dt="Дата регистрации" dd={organizer.registryRegisteredAt} />
                      <Row dt="Пошлины" dd={organizer.feesStatus} />
                      <Row dt="Всего заявок" dd={String(myApplications.length)} />
                    </dl>
                  </div>

                  <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
                    <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Последние действия</h2>
                    {recentOps.length === 0 ? (
                      <p className="text-[13px]" style={{ color: T.textSecondary }}>Пока нет действий.</p>
                    ) : (
                      <div className="space-y-2">
                        {recentOps.map((op) => (
                          <div key={op.opId} className="flex items-center justify-between py-2 border-b" style={{ borderColor: T.border }}>
                            <span className="text-[12px]" style={{ color: T.textSecondary }}>
                              {op.type} · {op.ticketId || op.eventId}
                            </span>
                            <span className="text-[11px] px-2 py-0.5 rounded-full" style={op.result === "ok" ? { background: "rgba(34,197,94,0.18)", color: "#22C55E" } : { background: "rgba(239,68,68,0.18)", color: "#EF4444" }}>
                              {op.result === "ok" ? "Успешно" : "Ошибка"}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Ближайшие мероприятия</h2>
                  <EventsTable rows={upcomingEvents} compact />
                </div>

                <div>
                  <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Разделы</h2>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionTiles.map((tile) => (
                      <button
                        key={tile.label}
                        onClick={() => tile.id === "applications" && tile.label === "Новая заявка" ? navigate("/organizer/compliance") : setActiveSection(tile.id)}
                        className="rounded-[18px] border p-5 text-left transition-all duration-200 hover:-translate-y-0.5 group"
                        style={{ background: T.cardBg, borderColor: T.border }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: T.goldBg }}>
                          <tile.icon size={20} style={{ color: T.gold }} />
                        </div>
                        <div className="text-[14px] font-semibold mb-1">{tile.label}</div>
                        <div className="text-[12px]" style={{ color: T.textSecondary }}>{tile.desc}</div>
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeSection === "applications" && (
              <ApplicationsTable
                rows={filteredApplications}
                search={search}
                setSearch={setSearch}
                appFilter={appFilter}
                setAppFilter={setAppFilter}
                sort={appSort}
                setSort={setAppSort}
                onOpen={setDrawerApp}
                onSubmit={handleSubmit}
                onCreateNew={() => navigate("/organizer/compliance")}
              />
            )}

            {activeSection === "events" && (
              <EventsSection rows={filteredEvents} sort={eventSort} setSort={setEventSort} />
            )}

            {activeSection === "sales" && (
              <SalesSection rows={mySales} />
            )}

            {activeSection === "reports" && (
              <ReportsSection rows={reportingRows} totals={totals} />
            )}

            {activeSection === "documents" && (
              <DocumentsSection rows={myDocuments} complianceRows={myComplianceApplications} />
            )}

            {activeSection === "support" && (
              <SupportSection />
            )}

            {activeSection === "marketing" && (
              <SimpleCard title="Маркетинг" text="Раздел будет расширен в следующих версиях демо-кабинета." />
            )}
          </div>
        </main>
      </div>

      {drawerApp && (
        <ApplicationDetailsDrawer app={drawerApp} onClose={() => setDrawerApp(null)} />
      )}

      {profileCardOpen && (
        <OrganizerProfileCard organizer={organizer} onClose={() => setProfileCardOpen(false)} />
      )}

      <style>{`
        .org-btn-primary {
          transition: box-shadow 0.2s, border-color 0.2s;
          border: 1px solid transparent;
        }
        .org-btn-primary:hover:not(:disabled) {
          border-color: rgba(242,201,76,0.35);
          box-shadow: 0 0 0 4px rgba(242,201,76,0.08);
        }
      `}</style>
    </div>
  );
}

function Row({ dt, dd }: { dt: string; dd: string }) {
  return (
    <div className="flex justify-between">
      <dt style={{ color: T.textSecondary }}>{dt}</dt>
      <dd className="font-medium" style={{ color: T.textPrimary }}>{dd}</dd>
    </div>
  );
}

function SortableHeader({ label, active, direction, onClick }: { label: string; active: boolean; direction: SortDirection | null; onClick: () => void }) {
  return (
    <button onClick={onClick} className="inline-flex items-center gap-1" style={{ color: T.textPrimary }}>
      <span>{label}</span>
      <ChevronDown size={12} style={{ opacity: active ? 1 : 0.3, transform: direction === "asc" ? "rotate(180deg)" : "rotate(0deg)" }} />
    </button>
  );
}

function ApplicationsTable({
  rows,
  search,
  setSearch,
  appFilter,
  setAppFilter,
  sort,
  setSort,
  onOpen,
  onSubmit,
  onCreateNew,
}: {
  rows: Application[];
  search: string;
  setSearch: (s: string) => void;
  appFilter: AppFilter;
  setAppFilter: (f: AppFilter) => void;
  sort: { key: "title" | "city" | "dateTime" | "capacity" | "status"; dir: SortDirection } | null;
  setSort: (s: { key: "title" | "city" | "dateTime" | "capacity" | "status"; dir: SortDirection } | null) => void;
  onOpen: (a: Application) => void;
  onSubmit: (id: string) => void;
  onCreateNew: () => void;
}) {
  const setColumnSort = (key: "title" | "city" | "dateTime" | "capacity" | "status") => {
    if (!sort || sort.key !== key) {
      setSort({ key, dir: sortDir(true) });
      return;
    }
    setSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
  };

  return (
    <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold" style={{ color: T.textPrimary }}>Мои заявки</h2>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: T.textMuted }} />
            <input
              className="border rounded-xl pl-9 pr-3 py-2 text-[13px] w-56"
              style={{ borderColor: T.btnSecondaryBorder, background: T.sidebarBg, color: T.textPrimary }}
              placeholder="Поиск"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select
            value={appFilter}
            onChange={(e) => setAppFilter(e.target.value as AppFilter)}
            className="border rounded-xl px-3 py-2 text-[13px]"
            style={{ borderColor: T.btnSecondaryBorder, background: T.sidebarBg, color: T.textPrimary }}
          >
            <option value="all">Все статусы</option>
            <option value="draft">Черновики</option>
            <option value="submitted">На рассмотрении</option>
            <option value="approved">Одобрено</option>
            <option value="rejected">Отклонено</option>
          </select>
          <HelpTooltip text="Фильтр применяет статусы заявок из таблицы. KPI-карточки выше используют ту же логику." />
          <button onClick={onCreateNew} className="h-9 px-4 rounded-xl text-[13px] font-semibold flex items-center gap-2 org-btn-primary" style={{ background: "#111111", color: "#FFF" }}>
            <Plus size={14} /> Создать
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <SimpleEmpty title="Нет заявок" desc="Создайте первую заявку или измените фильтр." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: T.tableHeaderBg }}>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>ID заявки</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Название" active={sort?.key === "title"} direction={sort?.key === "title" ? sort.dir : null} onClick={() => setColumnSort("title")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Площадка</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Город" active={sort?.key === "city"} direction={sort?.key === "city" ? sort.dir : null} onClick={() => setColumnSort("city")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Категория</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Дата и время" active={sort?.key === "dateTime"} direction={sort?.key === "dateTime" ? sort.dir : null} onClick={() => setColumnSort("dateTime")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Вместимость" active={sort?.key === "capacity"} direction={sort?.key === "capacity" ? sort.dir : null} onClick={() => setColumnSort("capacity")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Статус" active={sort?.key === "status"} direction={sort?.key === "status" ? sort.dir : null} onClick={() => setColumnSort("status")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Действия</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.appId} className="border-b" style={{ borderColor: T.border }}>
                  <td className="py-2.5 px-3 font-mono text-xs" style={{ color: T.textSecondary }}>{a.appId}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textPrimary }}>{a.title}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{a.venue}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{a.city || "—"}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{a.category || "—"}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{fmtDateTime(a.dateTime)}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{a.capacity}</td>
                  <td className="py-2.5 px-3">
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold" style={statusStyle[a.status]}>{statusLabel[a.status]}</span>
                  </td>
                  <td className="py-2.5 px-3 space-x-2">
                    <button onClick={() => onOpen(a)} className="h-7 px-3 rounded-lg border text-[12px]" style={{ borderColor: T.btnSecondaryBorder, color: T.textSecondary }}>Открыть</button>
                    {a.status === "draft" && (
                      <button onClick={() => onSubmit(a.appId)} className="h-7 px-3 rounded-lg text-[12px]" style={{ background: "#111111", color: "#FFF" }}>Отправить</button>
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

function EventsSection({ rows, sort, setSort }: {
  rows: EventRecord[];
  sort: { key: "title" | "city" | "dateTime" | "capacity" | "status"; dir: SortDirection } | null;
  setSort: (s: { key: "title" | "city" | "dateTime" | "capacity" | "status"; dir: SortDirection } | null) => void;
}) {
  const setColumnSort = (key: "title" | "city" | "dateTime" | "capacity" | "status") => {
    if (!sort || sort.key !== key) {
      setSort({ key, dir: sortDir(true) });
      return;
    }
    setSort({ key, dir: sort.dir === "asc" ? "desc" : "asc" });
  };

  return (
    <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Мои мероприятия</h2>
      {rows.length === 0 ? (
        <SimpleEmpty title="Нет одобренных мероприятий" desc="Одобренные заявки автоматически появляются в этом разделе." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: T.tableHeaderBg }}>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>ID мероприятия</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Название" active={sort?.key === "title"} direction={sort?.key === "title" ? sort.dir : null} onClick={() => setColumnSort("title")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Площадка</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Город" active={sort?.key === "city"} direction={sort?.key === "city" ? sort.dir : null} onClick={() => setColumnSort("city")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Категория</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Дата" active={sort?.key === "dateTime"} direction={sort?.key === "dateTime" ? sort.dir : null} onClick={() => setColumnSort("dateTime")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Вместимость" active={sort?.key === "capacity"} direction={sort?.key === "capacity" ? sort.dir : null} onClick={() => setColumnSort("capacity")} /></th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}><SortableHeader label="Статус" active={sort?.key === "status"} direction={sort?.key === "status" ? sort.dir : null} onClick={() => setColumnSort("status")} /></th>
              </tr>
            </thead>
            <tbody>
              {rows.map((e) => (
                <tr key={e.eventId} className="border-b" style={{ borderColor: T.border }}>
                  <td className="py-2.5 px-3 font-mono text-xs" style={{ color: T.textSecondary }}>{e.eventId}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textPrimary }}>{e.title}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.venue}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.city || "—"}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.category || "—"}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{fmtDateTime(e.dateTime)}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.capacity}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.status === "published" ? "Опубликовано" : "Одобрено"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function EventsTable({ rows, compact = false }: { rows: EventRecord[]; compact?: boolean }) {
  if (rows.length === 0) {
    return <SimpleEmpty title="Нет мероприятий" desc="Создайте заявку, чтобы добавить мероприятие." />;
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-[13px]">
        <thead>
          <tr style={{ background: T.tableHeaderBg }}>
            <th className="py-2.5 px-3 text-left font-semibold">ID мероприятия</th>
            <th className="py-2.5 px-3 text-left font-semibold">Название</th>
            <th className="py-2.5 px-3 text-left font-semibold">Дата и время</th>
            {!compact && <th className="py-2.5 px-3 text-left font-semibold">Площадка</th>}
            <th className="py-2.5 px-3 text-left font-semibold">Статус</th>
            <th className="py-2.5 px-3 text-left font-semibold">Осталось</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((e) => (
            <tr key={e.eventId} className="border-b" style={{ borderColor: T.border }}>
              <td className="py-2.5 px-3 font-mono text-xs" style={{ color: T.textSecondary }}>{e.eventId}</td>
              <td className="py-2.5 px-3" style={{ color: T.textPrimary }}>{e.title}</td>
              <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{fmtDateTime(e.dateTime)}</td>
              {!compact && <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.venue}</td>}
              <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.status === "published" ? "Опубликовано" : "Одобрено"}</td>
              <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{e.remaining}/{e.capacity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SalesSection({ rows }: { rows: OrganizerSaleRecord[] }) {
  return (
    <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
      <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Продажи и билеты</h2>
      {rows.length === 0 ? (
        <SimpleEmpty title="Пока нет продаж" desc="Продажи появляются после покупок в B2C по вашим мероприятиям." />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr style={{ background: T.tableHeaderBg }}>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>ID продажи</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Мероприятие</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Дата продажи</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Количество билетов</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Сумма</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Канал</th>
                <th className="py-2.5 px-3 text-left font-semibold" style={{ color: T.textPrimary }}>Статус</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((s) => (
                <tr key={s.saleId} className="border-b" style={{ borderColor: T.border }}>
                  <td className="py-2.5 px-3 font-mono text-xs" style={{ color: T.textSecondary }}>{s.saleId}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textPrimary }}>{s.eventTitle}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{fmtDateTime(s.soldAt)}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{s.quantity}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{s.amount.toFixed(2)} BYN</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{s.channel}</td>
                  <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{s.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function ReportsSection({ rows, totals }: {
  rows: ReturnType<typeof selectMyReportingRows>;
  totals: { salesCount: number; totalTickets: number; revenue: number; vat: number; net: number };
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-[18px] border p-4" style={{ background: T.cardBg, borderColor: T.border }}>
        <div className="text-sm" style={{ color: T.textSecondary }}>
          Демо-правило расчета: цена билета берется из ценовой категории мероприятия (tiers), сумма продажи = цена × количество,
          НДС = {Math.round(DEMO_VAT_RATE * 100)}% от суммы продажи.
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard title="Всего продаж" value={String(totals.salesCount)} />
        <KpiCard title="Всего билетов" value={String(totals.totalTickets)} />
        <KpiCard title="Выручка" value={`${totals.revenue.toFixed(2)} BYN`} />
        <KpiCard title="НДС" value={`${totals.vat.toFixed(2)} BYN`} />
        <KpiCard title="Чистая выручка" value={`${totals.net.toFixed(2)} BYN`} />
      </div>

      <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Таблица отчетности</h2>
        {rows.length === 0 ? (
          <SimpleEmpty title="Нет данных для отчета" desc="Когда в B2C появятся продажи, они автоматически попадут в отчетность." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-[13px]">
              <thead>
                <tr style={{ background: T.tableHeaderBg }}>
                  <th className="py-2.5 px-3 text-left font-semibold">Мероприятие</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Дата продажи</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Количество</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Цена билета</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Сумма продажи</th>
                  <th className="py-2.5 px-3 text-left font-semibold">НДС</th>
                  <th className="py-2.5 px-3 text-left font-semibold">Итоговая выручка</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.saleId} className="border-b" style={{ borderColor: T.border }}>
                    <td className="py-2.5 px-3" style={{ color: T.textPrimary }}>{r.eventTitle}</td>
                    <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{fmtDateTime(r.soldAt)}</td>
                    <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{r.quantity}</td>
                    <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{r.unitPrice.toFixed(2)} BYN</td>
                    <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{r.saleAmount.toFixed(2)} BYN</td>
                    <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{r.vatAmount.toFixed(2)} BYN</td>
                    <td className="py-2.5 px-3" style={{ color: T.textSecondary }}>{r.netRevenue.toFixed(2)} BYN</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function KpiCard({ title, value }: { title: string; value: string }) {
  return (
    <div className="rounded-[18px] border p-5" style={{ background: T.cardBg, borderColor: T.border }}>
      <div className="text-[13px]" style={{ color: T.textSecondary }}>{title}</div>
      <div className="text-[22px] font-bold mt-1" style={{ color: T.textPrimary }}>{value}</div>
    </div>
  );
}

function DocumentsSection({ rows, complianceRows }: { rows: OrganizerDocument[]; complianceRows: ReturnType<typeof selectMyEventComplianceApplications> }) {
  const [openedDoc, setOpenedDoc] = useState<OrganizerDocument | null>(null);
  const certificates = useMemo(
    () => complianceRows.filter((x) => x.status === "approved" && x.certificateNumber && x.linkedEventId),
    [complianceRows]
  );

  return (
    <>
      {certificates.length > 0 && (
        <div className="rounded-[18px] border p-6 mb-4" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
          <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Удостоверения по одобренным мероприятиям</h2>
          <div className="space-y-2">
            {certificates.map((item) => (
              <div key={item.eventComplianceApplicationId} className="rounded-xl border p-3 flex items-center justify-between gap-3" style={{ borderColor: T.border, background: T.sidebarBg }}>
                <div>
                  <div className="text-sm font-semibold">{item.data.title || "Без названия"}</div>
                  <div className="text-xs" style={{ color: T.textSecondary }}>
                    Event: {item.linkedEventId} · № удостоверения: {item.certificateNumber} · дата: {item.certificateDate || "—"}
                  </div>
                </div>
                <button
                  className="h-9 px-4 rounded-lg text-sm font-semibold"
                  style={{ background: "#111", color: "#FFF" }}
                  onClick={() => toast.success(`Удостоверение ${item.certificateNumber} готово к выдаче по событию ${item.linkedEventId}`)}
                >
                  Скачать удостоверение
                </button>
                <HelpTooltip text="Скачайте удостоверение только после одобрения compliance-заявки по мероприятию." />
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="rounded-[18px] border p-6" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
        <h2 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Документы организатора</h2>
        {rows.length === 0 ? (
          <SimpleEmpty title="Нет документов" desc="Документы появятся после добавления в профиль организатора." />
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
            {rows.map((doc) => (
              <button key={doc.documentId} onClick={() => setOpenedDoc(doc)} className="rounded-xl border p-4 text-left" style={{ borderColor: T.border, background: T.sidebarBg }}>
                <div className="font-semibold text-sm mb-1">{doc.title}</div>
                <div className="text-xs" style={{ color: T.textSecondary }}>Тип: {doc.type}</div>
                <div className="text-xs" style={{ color: T.textSecondary }}>Обновлено: {doc.updatedAt.slice(0, 10)}</div>
              </button>
            ))}
          </div>
        )}
      </div>
      {openedDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setOpenedDoc(null)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-md rounded-2xl border p-5" style={{ background: T.cardBg, borderColor: T.border }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: T.textPrimary }}>Открыт документ</h3>
            <p className="text-sm mb-1">{openedDoc.title}</p>
            <p className="text-xs" style={{ color: T.textSecondary }}>ID документа: {openedDoc.documentId}</p>
            <p className="text-xs" style={{ color: T.textSecondary }}>Статус: {openedDoc.status}</p>
            <button className="mt-4 h-9 px-4 rounded-lg text-sm" style={{ background: "#111", color: "#FFF" }} onClick={() => setOpenedDoc(null)}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SupportSection() {
  const [messageOpen, setMessageOpen] = useState(false);

  return (
    <>
      <div className="rounded-[18px] border p-6 space-y-4" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
        <h2 className="text-lg font-semibold" style={{ color: T.textPrimary }}>Поддержка TicketHub</h2>
        <div className="text-sm" style={{ color: T.textSecondary }}>
          Email: support@tickethub.by<br />
          Телефон: +375 (17) 300-00-00<br />
          Средняя скорость ответа: до 15 минут в рабочее время.
        </div>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => setMessageOpen(true)} className="h-9 px-4 rounded-lg text-sm" style={{ background: "#111", color: "#FFF" }}>
            Написать в поддержку
          </button>
          <button onClick={() => toast.success("Форма обращения будет добавлена в следующем релизе.")} className="h-9 px-4 rounded-lg border text-sm" style={{ borderColor: T.btnSecondaryBorder, color: T.textPrimary, background: "rgba(255,255,255,0.03)" }}>
            Оставить обращение
          </button>
          <button onClick={() => toast.success("AI-помощник откроется в отдельном виджете.")} className="h-9 px-4 rounded-lg border text-sm" style={{ borderColor: T.btnSecondaryBorder, color: T.textPrimary, background: "rgba(255,255,255,0.03)" }}>
            Открыть AI-помощника
          </button>
        </div>
      </div>
      {messageOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={() => setMessageOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative w-full max-w-md rounded-2xl border p-5" style={{ background: T.cardBg, borderColor: T.border }} onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold mb-2" style={{ color: T.textPrimary }}>Обращение в поддержку</h3>
            <p className="text-sm" style={{ color: T.textSecondary }}>Канал связи активирован. В демо-режиме сообщение не отправляется на внешний сервер.</p>
            <button className="mt-4 h-9 px-4 rounded-lg text-sm" style={{ background: "#111", color: "#FFF" }} onClick={() => setMessageOpen(false)}>
              Понятно
            </button>
          </div>
        </div>
      )}
    </>
  );
}

function SimpleCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-[18px] border p-10 text-center" style={{ background: T.cardBg, borderColor: T.border, boxShadow: T.cardShadow }}>
      <h2 className="text-lg font-semibold mb-1" style={{ color: T.textPrimary }}>{title}</h2>
      <p className="text-[13px]" style={{ color: T.textSecondary }}>{text}</p>
    </div>
  );
}

function SimpleEmpty({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="text-center py-10">
      <p className="text-[14px] font-medium mb-1" style={{ color: T.textSecondary }}>{title}</p>
      <p className="text-[13px]" style={{ color: T.textMuted }}>{desc}</p>
    </div>
  );
}

function OrganizerProfileCard({ organizer, onClose }: { organizer: NonNullable<ReturnType<typeof selectCurrentOrganizer>>; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative w-full max-w-xl rounded-2xl border p-6" style={{ background: T.cardBg, borderColor: T.border }} onClick={(e) => e.stopPropagation()}>
        <h3 className="text-lg font-semibold mb-4" style={{ color: T.textPrimary }}>Профиль организатора</h3>
        <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: T.textSecondary }}>
          <div><strong style={{ color: T.textPrimary }}>Полное название:</strong><br />{organizer.fullName}</div>
          <div><strong style={{ color: T.textPrimary }}>УНП:</strong><br />{organizer.unp}</div>
          <div><strong style={{ color: T.textPrimary }}>Регистрация:</strong><br />{organizer.registryStatus}</div>
          <div><strong style={{ color: T.textPrimary }}>Дата регистрации:</strong><br />{organizer.registryRegisteredAt}</div>
          <div><strong style={{ color: T.textPrimary }}>Директор:</strong><br />{organizer.director}</div>
          <div><strong style={{ color: T.textPrimary }}>Email:</strong><br />{organizer.email}</div>
          <div><strong style={{ color: T.textPrimary }}>Телефон:</strong><br />{organizer.phone}</div>
          <div><strong style={{ color: T.textPrimary }}>Статус аккаунта:</strong><br />{organizer.accountStatus}</div>
        </div>
        <button className="mt-5 h-9 px-4 rounded-lg text-sm" style={{ background: "#111", color: "#FFF" }} onClick={onClose}>
          Закрыть
        </button>
      </div>
    </div>
  );
}

function ApplicationDetailsDrawer({ app, onClose }: { app: Application; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end" onClick={onClose}>
      <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.55)" }} />
      <div className="relative w-full max-w-md h-full overflow-y-auto" style={{ background: T.cardBg, boxShadow: "-10px 0 50px rgba(0,0,0,0.4)" }} onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex justify-between items-center px-6 py-4 border-b" style={{ background: T.cardBg, borderColor: T.border }}>
          <h3 className="text-lg font-semibold" style={{ color: T.textPrimary }}>Карточка заявки</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center"><X size={18} /></button>
        </div>
        <div className="p-6">
          <div className="mb-4"><span className="px-2.5 py-1 rounded-full text-[11px] font-semibold" style={statusStyle[app.status]}>{statusLabel[app.status]}</span></div>
          <dl className="space-y-3 text-[13px]">
            <Item k="ID заявки" v={app.appId} />
            <Item k="ID организатора" v={app.organizerId} />
            <Item k="Название" v={app.title} />
            <Item k="Площадка" v={app.venue} />
            <Item k="Город" v={app.city || "—"} />
            <Item k="Категория" v={app.category || "—"} />
            <Item k="Дата и время" v={fmtDateTime(app.dateTime)} />
            <Item k="Вместимость" v={String(app.capacity)} />
            {app.licenseId && <Item k="ID лицензии" v={app.licenseId} />}
            {app.eventId && <Item k="ID мероприятия" v={app.eventId} />}
          </dl>
        </div>
      </div>
    </div>
  );
}

function Item({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between">
      <dt style={{ color: T.textSecondary }}>{k}</dt>
      <dd style={{ color: T.textPrimary }} className="font-medium">{v}</dd>
    </div>
  );
}
