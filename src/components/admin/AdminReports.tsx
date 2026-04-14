import React from "react";
import { A } from "./adminStyles";
import { BarChart3, Users, Ticket, Activity, ShieldAlert, RotateCcw, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const reports = [
  { title: "По мероприятиям", desc: "Сводка по всем событиям, статусам и вместимости", icon: BarChart3, accent: A.cyan },
  { title: "По организаторам", desc: "Реестр организаторов, активность и риск-профили", icon: Users, accent: A.blue },
  { title: "По билетам", desc: "Статистика выпуска, продаж и использования билетов", icon: Ticket, accent: A.violet },
  { title: "По операциям", desc: "Аналитика операций sell/refund/redeem/verify", icon: Activity, accent: A.gold },
  { title: "По нарушениям", desc: "Обзор флагов, нарушений и блокировок", icon: ShieldAlert, accent: A.statusError },
  { title: "По возвратам", desc: "Детализация возвратов, причины и частота", icon: RotateCcw, accent: A.statusWarn },
];

export default function AdminReports() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {reports.map((r, i) => (
        <div key={i} className="p-5 transition-all duration-200 hover:-translate-y-0.5 group"
          style={{ background: A.glassGradient + ', ' + A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.glassShadow }}
          onMouseEnter={e => (e.currentTarget.style.borderColor = r.accent + '40')}
          onMouseLeave={e => (e.currentTarget.style.borderColor = A.border)}>
          <div className="flex items-center gap-3 mb-3">
            <div style={{ background: r.accent + '18', borderRadius: 10 }} className="w-10 h-10 flex items-center justify-center">
              <r.icon size={20} style={{ color: r.accent }} />
            </div>
            <h3 style={{ color: A.textPrimary }} className="text-sm font-semibold">{r.title}</h3>
          </div>
          <p style={{ color: A.textSecondary }} className="text-xs mb-4 leading-relaxed">{r.desc}</p>
          <div className="flex gap-2">
            <button onClick={() => toast.info("Функция в разработке")}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors"
              style={{ background: A.surfaceBg, border: `1px solid ${A.borderLight}`, color: A.textPrimary }}>
              <ExternalLink size={12} />Открыть
            </button>
            <button onClick={() => toast.info("Экспорт в разработке")}
              className="flex items-center gap-1.5 px-3 h-8 rounded-lg text-xs font-medium transition-colors"
              style={{ background: 'transparent', border: `1px solid ${A.border}`, color: A.textSecondary }}>
              <Download size={12} />Экспорт
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
