import React, { useMemo, useState } from "react";
import type { AppState } from "@/lib/store";
import { A, statusChip } from "./adminStyles";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import HelpTooltip from "@/components/ui/help-tooltip";

interface Props { state: AppState; }

function CardHelp({ text }: { text: string }) {
  return (
    <div className="absolute right-4 top-4 z-10">
      <HelpTooltip text={text} />
    </div>
  );
}

export default function AdminCalendar({ state }: Props) {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const eventsByDate = useMemo(() => {
    const map = new Map<string, typeof state.events>();
    state.events.forEach(e => {
      const date = e.dateTime?.slice(0, 10);
      if (date) {
        const list = map.get(date) || [];
        list.push(e);
        map.set(date, list);
      }
    });
    return map;
  }, [state.events]);

  const daysInMonth = new Date(currentMonth.year, currentMonth.month + 1, 0).getDate();
  const firstDay = new Date(currentMonth.year, currentMonth.month, 1).getDay();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1; // Monday start

  const monthNames = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

  const prev = () => setCurrentMonth(m => m.month === 0 ? { year: m.year - 1, month: 11 } : { ...m, month: m.month - 1 });
  const next = () => setCurrentMonth(m => m.month === 11 ? { year: m.year + 1, month: 0 } : { ...m, month: m.month + 1 });

  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) || []) : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
      {/* Calendar grid */}
      <div className="lg:col-span-2 relative" style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }}>
        <CardHelp text="Календарь показывает мероприятия по датам. Дни с точками содержат одно или несколько мероприятий." />
        <div className="flex items-center justify-between p-5" style={{ borderBottom: `1px solid ${A.border}` }}>
          <span className="inline-flex items-center gap-1">
            <button onClick={prev} className="p-1.5 rounded-lg transition-colors" style={{ color: A.textSecondary }}
            onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <ChevronLeft size={18} />
            </button>
            <HelpTooltip text="Показать предыдущий месяц." />
          </span>
          <h3 style={{ color: A.textPrimary }} className="text-base font-semibold">
            {monthNames[currentMonth.month]} {currentMonth.year}
          </h3>
          <span className="inline-flex items-center gap-1">
            <button onClick={next} className="p-1.5 rounded-lg transition-colors" style={{ color: A.textSecondary }}
            onMouseEnter={e => (e.currentTarget.style.background = A.rowHover)}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
            <ChevronRight size={18} />
            </button>
            <HelpTooltip text="Показать следующий месяц." />
          </span>
        </div>
        <div className="p-5">
          {/* Day names */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map(d => (
              <div key={d} className="text-center text-xs font-medium py-1" style={{ color: A.textMuted }}>{d}</div>
            ))}
          </div>
          {/* Days */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: adjustedFirstDay }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const day = i + 1;
              const dateStr = `${currentMonth.year}-${String(currentMonth.month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
              const evts = eventsByDate.get(dateStr) || [];
              const isSelected = selectedDate === dateStr;
              const today = new Date().toISOString().slice(0, 10) === dateStr;
              return (
                <button key={day} onClick={() => setSelectedDate(dateStr)}
                  className="relative aspect-square flex flex-col items-center justify-center rounded-xl text-sm transition-all"
                  style={{
                    background: isSelected ? A.selectedBg : 'transparent',
                    border: isSelected ? `1px solid ${A.cyan}40` : today ? `1px solid ${A.borderLight}` : '1px solid transparent',
                    color: A.textPrimary,
                  }}
                  onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = A.rowHover; }}
                  onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'transparent'; }}>
                  <span className="font-medium">{day}</span>
                  {evts.length > 0 && (
                    <div className="flex gap-0.5 mt-0.5">
                      {evts.slice(0, 3).map((_, j) => (
                        <div key={j} className="w-1.5 h-1.5 rounded-full" style={{ background: A.cyan }} />
                      ))}
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Events list */}
      <div style={{ background: A.cardBg, border: `1px solid ${A.border}`, borderRadius: 16, boxShadow: A.cardShadow }} className="relative p-5">
        <CardHelp text="Список мероприятий на выбранную дату. Если дата не выбрана, список не отображается." />
        <h3 style={{ color: A.textPrimary }} className="text-sm font-semibold mb-4">
          {selectedDate ? `События: ${selectedDate}` : "Выберите дату"}
        </h3>
        {selectedDate && selectedEvents.length === 0 && (
          <div className="flex flex-col items-center py-8">
            <Calendar size={24} style={{ color: A.textMuted }} className="mb-2" />
            <p style={{ color: A.textMuted }} className="text-sm">Нет событий</p>
          </div>
        )}
        <div className="space-y-3">
          {selectedEvents.map(e => {
            const chip = e.status === "published" ? statusChip('ok') : statusChip('info');
            return (
              <div key={e.eventId} className="p-3 rounded-xl" style={{ background: A.surfaceBg, border: `1px solid ${A.border}` }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs" style={{ color: A.cyan }}>{e.eventId}</span>
                  <span style={{ background: chip.bg, color: chip.color, borderRadius: 999 }} className="text-xs px-2 py-0.5 font-medium">
                    {e.status === "published" ? "Опубл." : "Одобр."}
                  </span>
                </div>
                <div style={{ color: A.textPrimary }} className="text-sm font-medium">{e.title}</div>
                <div style={{ color: A.textMuted }} className="text-xs mt-1">{e.venue} · {e.capacity} мест</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
