import React, { useMemo } from "react";
import type { AppState } from "@/lib/store";
import { A, appStatusChip, opResultChip } from "./adminStyles";
import {
  LayoutDashboard, FileText, Calendar, Ticket, AlertTriangle, Activity,
} from "lucide-react";

interface Props { state: AppState; onNavigate: (tab: string) => void; }

const statusLabel: Record<string, string> = {
  draft: "Черновик", submitted: "Отправлена", approved: "Одобрена", rejected: "Отклонена",
};
const opTypeLabel: Record<string, string> = { sell: "Продажа", refund: "Возврат", redeem: "Погашение", verify: "Проверка" };

export default function AdminDashboard({ state, onNavigate }: Props) {
  const kpi = useMemo(() => {
    const apps = state.applications;
    const newApps = apps.filter(a => a.status === "submitted").length;
    const reviewing = apps.filter(a => a.status === "submitted").length;
    const activeEvents = state.events.filter(e => e.status === "published").length;
    const totalTickets = state.tickets.length;
    const errorOps = state.ops.filter(o => o.result === "error").length;
    const suspiciousOps = state.ops.filter(o => o.result === "error" && (o.type === "redeem" || o.type === "refund")).length;
    return { newApps, reviewing, activeEvents, totalTickets, errorOps, suspiciousOps };
  }, [state]);

  const recentApps = useMemo(() => [...state.applications].reverse().slice(0, 5), [state.applications]);
  const recentOps = useMemo(() => [...state.ops].reverse().slice(0, 6), [state.ops]);
  const criticalFlags = useMemo(() => {
    const flags: { id: string; text: string; type: 'error' | 'warn' }[] = [];
    state.ops.filter(o => o.result === "error").slice(-4).forEach(o => {
      flags.push({ id: o.opId, text: `${opTypeLabel[o.type] || o.type} отказ: ${o.reason || "неизвестно"}`, type: 'error' });
    });
    const refundCount = state.ops.filter(o => o.type === "refund").length;
    const soldCount = state.ops.filter(o => o.type === "sell" && o.result === "ok").length;
    if (soldCount > 0 && refundCount / soldCount > 0.3) {
      flags.push({ id: 'refund_rate', text: `Высокий уровень возвратов: ${Math.round(refundCount / soldCount * 100)}%`, type: 'warn' });
    }
    return flags;
  }, [state.ops]);

  const todayEvents = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return state.events.filter(e => e.dateTime?.startsWith(today));
  }, [state.events]);

  const kpiCards = [
    { label: "Новые заявки", value: kpi.newApps, icon: FileText, accent: A.cyan },
    { label: "На проверке", value: kpi.reviewing, icon: Activity, accent: A.blue },
    { label: "Активные события", value: kpi.activeEvents, icon: Calendar, accent: A.violet },
    { label: "Билеты выпущено", value: kpi.totalTickets, icon: Ticket, accent: A.gold },
    { label: "Нарушения", value: kpi.errorOps, icon: AlertTriangle, accent: A.statusError },
    { label: "Подозрительные", value: kpi.suspiciousOps, icon: Activity, accent: A.statusWarn },
  ];

  return (
    <div className="space-y-5">
      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {kpiCards.map((k, i) => (
          <div key={i} style={{
            background: A.glassGradient + ', ' + A.cardBg,
            border: `1px solid ${A.border}`,
            boxShadow: A.glassShadow,
            borderRadius: 16,
          }} className="p-5 transition-all duration-200 hover:-translate-y-0.5"
            onMouseEnter={e => (e.currentTarget.style.borderColor = k.accent + '40')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = A.border)}>
            <div className="flex items-center gap-3 mb-3">
              <div style={{ background: k.accent + '18', borderRadius: 10 }} className="w-9 h-9 flex items-center justify-center">
                <k.icon size={18} style={{ color: k.accent }} />
              </div>
            </div>
            <div style={{ color: A.textPrimary }} className="text-2xl font-bold tracking-tight">{k.value}</div>
            <div style={{ color: A.textSecondary }} className="text-xs mt-1">{k.label}</div>
          </div>
        ))}
      </div>

      {/* Mid row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Applications */}
        <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: A.textPrimary }} className="text-sm font-semibold tracking-tight">Последние заявки</h3>
            <button onClick={() => onNavigate("applications")} style={{ color: A.cyan }} className="text-xs hover:underline">Все заявки →</button>
          </div>
          {recentApps.length === 0 ? (
            <p style={{ color: A.textMuted }} className="text-sm py-6 text-center">Нет заявок</p>
          ) : (
            <div className="space-y-2">
              {recentApps.map(a => {
                const chip = appStatusChip(a.status);
                return (
                  <div key={a.appId} className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div>
                      <span style={{ color: A.textMuted }} className="text-xs font-mono mr-2">{a.appId}</span>
                      <span style={{ color: A.textPrimary }} className="text-sm">{a.title}</span>
                    </div>
                    <span style={{ background: chip.bg, color: chip.color, borderRadius: 999 }} className="text-xs px-2.5 py-0.5 font-medium">
                      {statusLabel[a.status]}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Operations */}
        <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 style={{ color: A.textPrimary }} className="text-sm font-semibold tracking-tight">Последние операции</h3>
            <button onClick={() => onNavigate("operations")} style={{ color: A.cyan }} className="text-xs hover:underline">Все операции →</button>
          </div>
          {recentOps.length === 0 ? (
            <p style={{ color: A.textMuted }} className="text-sm py-6 text-center">Нет операций</p>
          ) : (
            <div className="space-y-2">
              {recentOps.map(o => {
                const chip = opResultChip(o.result);
                return (
                  <div key={o.opId} className="flex items-center justify-between py-2 px-3 rounded-lg transition-colors"
                    style={{ background: 'transparent' }}
                    onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                    <div className="flex items-center gap-2">
                      <span style={{ color: A.textMuted }} className="text-xs font-mono">{o.opId}</span>
                      <span style={{ color: A.textPrimary }} className="text-sm">{opTypeLabel[o.type] || o.type}</span>
                      {o.ticketId && <span style={{ color: A.textMuted }} className="text-xs">{o.ticketId}</span>}
                    </div>
                    <span style={{ background: chip.bg, color: chip.color, borderRadius: 999 }} className="text-xs px-2.5 py-0.5 font-medium">
                      {o.result === "ok" ? "OK" : "ОТКАЗ"}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Critical flags */}
        <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="p-5">
          <h3 style={{ color: A.textPrimary }} className="text-sm font-semibold tracking-tight mb-4">Критические флаги</h3>
          {criticalFlags.length === 0 ? (
            <div className="flex flex-col items-center py-6">
              <AlertTriangle size={24} style={{ color: A.textMuted }} className="mb-2" />
              <p style={{ color: A.textMuted }} className="text-sm">Нарушений не обнаружено</p>
            </div>
          ) : (
            <div className="space-y-2">
              {criticalFlags.map((f, i) => (
                <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-lg"
                  style={{ background: f.type === 'error' ? A.statusErrorBg : A.statusWarnBg }}>
                  <AlertTriangle size={14} style={{ color: f.type === 'error' ? A.statusError : A.statusWarn }} />
                  <span style={{ color: f.type === 'error' ? A.statusError : A.statusWarn }} className="text-sm">{f.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Today events */}
        <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="p-5">
          <h3 style={{ color: A.textPrimary }} className="text-sm font-semibold tracking-tight mb-4">События сегодня</h3>
          {todayEvents.length === 0 ? (
            <div className="flex flex-col items-center py-6">
              <Calendar size={24} style={{ color: A.textMuted }} className="mb-2" />
              <p style={{ color: A.textMuted }} className="text-sm">Нет событий на сегодня</p>
            </div>
          ) : (
            <div className="space-y-2">
              {todayEvents.map(e => (
                <div key={e.eventId} className="py-2 px-3 rounded-lg" style={{ background: A.rowHover }}>
                  <div className="flex items-center justify-between">
                    <span style={{ color: A.textPrimary }} className="text-sm">{e.title}</span>
                    <span style={{ color: A.textMuted }} className="text-xs">{e.venue}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
