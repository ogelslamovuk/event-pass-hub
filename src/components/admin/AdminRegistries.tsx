import React, { useMemo, useState } from "react";
import type { AppState } from "@/lib/store";
import { A, statusChip } from "./adminStyles";
import { Building2, MapPin, X } from "lucide-react";
import HelpTooltip from "@/components/ui/help-tooltip";

// Organizer Registry
export function AdminOrgRegistry({ state }: { state: AppState }) {
  const [drawer, setDrawer] = useState<any>(null);

  const orgs = useMemo(() => {
    const approvedOrganizerIds = new Set(state.organizerRegistry.map((record) => record.organizerId));
    return state.organizers
      .filter((organizer) => approvedOrganizerIds.has(organizer.organizerId))
      .map((organizer) => {
        const latestOrganizerApplication = state.organizerApplications
          .filter((application) => application.organizerId === organizer.organizerId)
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0] || null;
        const apps = state.applications.filter((a) => a.organizerId === organizer.organizerId);
        const events = state.events.filter((e) => e.organizerId === organizer.organizerId);
        const eventIds = new Set(events.map((e) => e.eventId));
        const violations = state.ops.filter((o) => o.result === "error" && eventIds.has(o.eventId)).length;
        const updatedAt = [
          organizer.registryRegisteredAt ? `${organizer.registryRegisteredAt}T00:00:00` : "",
          ...apps.map((a) => a.updatedAt),
          ...events.map((e) => e.updatedAt),
        ].filter(Boolean).sort((a, b) => b.localeCompare(a))[0] || "";
        return {
          id: organizer.organizerId,
          name: organizer.name,
          registryNumber: state.organizerRegistry.find((r) => r.organizerId === organizer.organizerId)?.internalNumber || "—",
          apps: apps.length,
          events: events.length,
          violations,
          lastActivity: updatedAt,
          risk: violations > 2 ? "high" : violations > 0 ? "medium" : "low",
          latestOrganizerApplication,
        };
      });
  }, [state]);

  const riskChip = (r: string) => r === 'high' ? statusChip('error') : r === 'medium' ? statusChip('warn') : statusChip('ok');

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs" style={{ color: A.textSecondary }}>Реестр организаторов</span>
        <HelpTooltip text="Нажмите на строку, чтобы открыть карточку организатора с деталями и риском." />
      </div>
      <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="overflow-hidden">
        {orgs.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <Building2 size={28} style={{ color: A.textMuted }} className="mb-2" />
            <p style={{ color: A.textMuted }} className="text-sm">Нет организаторов</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: A.tableHeaderBg }}>
                  {["Организатор", "№ в реестре", "Заявки", "Мероприятия", "Нарушения", "Риск", "Последняя активность"].map((h, i) => (
                    <th key={i} className="text-left py-3 px-4 font-medium text-xs" style={{ color: A.textSecondary, borderBottom: `1px solid ${A.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orgs.map(o => {
                  const rc = riskChip(o.risk);
                  return (
                    <tr key={o.id} className="transition-colors cursor-pointer"
                      style={{ borderBottom: `1px solid ${A.border}` }}
                      onClick={() => setDrawer(o)}
                      onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                      <td className="py-3 px-4" style={{ color: A.textPrimary }}>{o.name}</td>
                      <td className="py-3 px-4" style={{ color: A.textSecondary }}>{o.registryNumber}</td>
                      <td className="py-3 px-4" style={{ color: A.textPrimary }}>{o.apps}</td>
                      <td className="py-3 px-4" style={{ color: A.textPrimary }}>{o.events}</td>
                      <td className="py-3 px-4" style={{ color: A.textPrimary }}>{o.violations}</td>
                      <td className="py-3 px-4">
                        <span style={{ background: rc.bg, color: rc.color, borderRadius: 999 }} className="text-xs px-2.5 py-0.5 font-medium">{o.risk.toUpperCase()}</span>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: A.textMuted }}>{o.lastActivity?.replace("T", " ").slice(0, 16)}</td>
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
              <h3 style={{ color: A.textPrimary }} className="text-base font-semibold">{drawer.name}</h3>
              <button onClick={() => setDrawer(null)} style={{ color: A.textMuted }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {([["Полное наименование", drawer.latestOrganizerApplication?.data?.legalName || drawer.name || "—"], ["Регистрационный номер", drawer.latestOrganizerApplication?.data?.registrationNumber || state.organizers.find((organizer) => organizer.organizerId === drawer.id)?.unp || "—"], ["Контактный телефон", drawer.latestOrganizerApplication?.data?.contactPhone || state.organizers.find((organizer) => organizer.organizerId === drawer.id)?.phone || "—"], ["Email", drawer.latestOrganizerApplication?.data?.email || state.organizers.find((organizer) => organizer.organizerId === drawer.id)?.email || "—"], ["ФИО руководителя", drawer.latestOrganizerApplication?.data?.director?.fullName || state.organizers.find((organizer) => organizer.organizerId === drawer.id)?.director || "—"], ["Адрес", [drawer.latestOrganizerApplication?.data?.postalCode, drawer.latestOrganizerApplication?.data?.region, drawer.latestOrganizerApplication?.data?.locality, drawer.latestOrganizerApplication?.data?.street, drawer.latestOrganizerApplication?.data?.houseNumber, drawer.latestOrganizerApplication?.data?.roomTypeAndNumber, drawer.latestOrganizerApplication?.data?.addressExtra].filter((part: string | undefined) => Boolean(part && part.trim())).join(", ") || "—"], ["Вид деятельности / выбранные категории", [Array.isArray(drawer.latestOrganizerApplication?.data?.activities) ? drawer.latestOrganizerApplication.data.activities.join(", ") : "", drawer.latestOrganizerApplication?.data?.activityOther || ""].filter(Boolean).join(", ") || "—"], ["Реестровый номер", drawer.registryNumber], ["Последняя активность", drawer.lastActivity?.replace("T", " ").slice(0, 16) || "—"]] as [string, string][]).map(([k, v]) => (
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

// Venue Registry
export function AdminVenueRegistry({ state }: { state: AppState }) {
  const [drawer, setDrawer] = useState<any>(null);

  const venues = useMemo(() => {
    const map = new Map<string, { venue: string; city: string; type: string; source: string; maxCapacity: number; events: number; violations: number }>();
    const allVenues = [...new Set([...state.applications.map((a) => a.venue), ...state.events.map((e) => e.venue)])].filter(Boolean);
    allVenues.forEach((v) => {
      const apps = state.applications.filter((a) => a.venue === v);
      const evts = state.events.filter((e) => e.venue === v);
      const maxCap = Math.max(0, ...apps.map(a => a.capacity), ...evts.map(e => e.capacity));
      const hasRegistryEvents = evts.some((e) => e.status === "published" || e.status === "approved");
      const source = hasRegistryEvents ? "Реестровая/постоянная" : "Кейсовая/временная";
      map.set(v, {
        venue: v,
        city: evts[0]?.city || apps[0]?.city || "Минск",
        type: v.includes("зал") ? "Концертный зал" : v.includes("театр") ? "Театр" : "Площадка",
        source,
        maxCapacity: maxCap,
        events: evts.length,
        violations: 0,
      });
    });
    return Array.from(map.values());
  }, [state]);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5">
        <span className="text-xs" style={{ color: A.textSecondary }}>Реестр площадок</span>
        <HelpTooltip text="Нажмите на строку площадки, чтобы открыть подробные сведения в боковой панели." />
      </div>
      <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="overflow-hidden">
        {venues.length === 0 ? (
          <div className="flex flex-col items-center py-12">
            <MapPin size={28} style={{ color: A.textMuted }} className="mb-2" />
            <p style={{ color: A.textMuted }} className="text-sm">Нет площадок</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ background: A.tableHeaderBg }}>
                  {["Площадка", "Источник", "Город", "Тип", "Вместимость", "События", "Нарушения"].map((h, i) => (
                    <th key={i} className="text-left py-3 px-4 font-medium text-xs" style={{ color: A.textSecondary, borderBottom: `1px solid ${A.border}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {venues.map(v => (
                  <tr key={v.venue} className="transition-colors cursor-pointer"
                    style={{ borderBottom: `1px solid ${A.border}` }}
                    onClick={() => setDrawer(v)}
                    onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <td className="py-3 px-4" style={{ color: A.textPrimary }}>{v.venue}</td>
                    <td className="py-3 px-4" style={{ color: A.textSecondary }}>{v.source}</td>
                    <td className="py-3 px-4" style={{ color: A.textSecondary }}>{v.city}</td>
                    <td className="py-3 px-4" style={{ color: A.textSecondary }}>{v.type}</td>
                    <td className="py-3 px-4" style={{ color: A.textPrimary }}>{v.maxCapacity}</td>
                    <td className="py-3 px-4" style={{ color: A.textPrimary }}>{v.events}</td>
                    <td className="py-3 px-4" style={{ color: A.textPrimary }}>{v.violations}</td>
                  </tr>
                ))}
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
              <h3 style={{ color: A.textPrimary }} className="text-base font-semibold">{drawer.venue}</h3>
              <button onClick={() => setDrawer(null)} style={{ color: A.textMuted }}><X size={18} /></button>
            </div>
            <div className="p-5 space-y-4">
              {([["Источник", drawer.source], ["Город", drawer.city], ["Тип", drawer.type], ["Вместимость", String(drawer.maxCapacity)], ["События", String(drawer.events)], ["Нарушения", String(drawer.violations)]] as [string, string][]).map(([k, v]) => (
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
