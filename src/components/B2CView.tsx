import React, { useMemo, useState } from "react";
import type { AppState, EventRecord } from "@/lib/store";
import { createDemoPurchaseTicket } from "@/lib/store";
import { toast } from "sonner";
import { Search, MapPin, Tag, Ticket, X, ChevronRight, Sparkles, TrendingUp, Star, Clock, User, Calendar, CheckCircle2 } from "lucide-react";

interface Props {
  state: AppState;
  onUpdate: (s: AppState) => void;
}

const CITY_WHITELIST = ["Минск", "Брест", "Витебск", "Гомель", "Гродно", "Могилёв"] as const;
const CATEGORY_WHITELIST = ["Концерты", "Театр", "Шоу", "Детям", "Фестивали"] as const;
const POSTER_PLACEHOLDER = "/placeholder.svg";

const CATEGORY_EMOJI: Record<string, string> = {
  "Концерты": "🎵",
  "Театр": "🎭",
  "Шоу": "✨",
  "Детям": "🎈",
  "Фестивали": "🎪",
};

type DemoEvent = EventRecord & { city: string; category: string; description: string; poster: string };

function getPriceFrom(event: DemoEvent): number | null {
  const prices = event.tiers.map((tier) => tier.price).filter((price) => Number.isFinite(price) && price > 0);
  if (prices.length === 0) return null;
  return Math.min(...prices);
}

function getAvailability(state: AppState, event: DemoEvent): "Available" | "Sold out" {
  if (!event.tiers.length) return "Available";
  const soldOut = event.tiers.every((tier) => {
    const issuedForTier = state.tickets.filter(
      (ticket) => ticket.eventId === event.eventId && ticket.tier === tier.name && ticket.status === "issued"
    ).length;
    return issuedForTier === 0;
  });
  return soldOut ? "Sold out" : "Available";
}

function formatDateTime(dateTime: string): { date: string; time: string } {
  const [date = "", timeRaw = ""] = (dateTime || "").split("T");
  return { date: date || "Дата уточняется", time: timeRaw ? timeRaw.slice(0, 5) : "Время уточняется" };
}

function formatDateShort(dateTime: string): string {
  const [date = ""] = (dateTime || "").split("T");
  if (!date) return "";
  const d = new Date(date);
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short" });
}

// --- Design tokens ---
const D = {
  pageBg: "#06080E",
  cardBg: "#0D1117",
  cardBgHover: "#131A24",
  surfaceBg: "#111827",
  surfaceLight: "#1A2332",
  border: "rgba(255,255,255,0.06)",
  borderLight: "rgba(255,255,255,0.10)",
  borderAccent: "rgba(99,102,241,0.25)",
  text: "#F1F5F9",
  textSec: "rgba(241,245,249,0.72)",
  textMuted: "rgba(241,245,249,0.45)",
  accent: "#818CF8",
  accentBright: "#A5B4FC",
  accentBg: "rgba(99,102,241,0.12)",
  cyan: "#22D3EE",
  cyanBg: "rgba(34,211,238,0.10)",
  gold: "#FBBF24",
  goldBg: "rgba(251,191,36,0.12)",
  green: "#34D399",
  greenBg: "rgba(52,211,153,0.12)",
  rose: "#FB7185",
  roseBg: "rgba(251,113,133,0.12)",
  cardRadius: "16px",
  cardShadow: "0 8px 32px rgba(0,0,0,0.3)",
  heroGradient: "linear-gradient(135deg, rgba(99,102,241,0.15) 0%, rgba(139,92,246,0.10) 40%, rgba(14,165,233,0.08) 100%)",
};

export default function B2CView({ state, onUpdate }: Props) {
  const [search, setSearch] = useState("");
  const [city, setCity] = useState<"" | (typeof CITY_WHITELIST)[number]>("");
  const [category, setCategory] = useState<"" | (typeof CATEGORY_WHITELIST)[number]>("");
  const [detailsEventId, setDetailsEventId] = useState<string | null>(null);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [ticketsOpen, setTicketsOpen] = useState(false);
  const [successTicketId, setSuccessTicketId] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [buyerName, setBuyerName] = useState("");

  const publishedEvents = useMemo<DemoEvent[]>(() => {
    return state.events
      .filter((event) => event.status === "published")
      .filter((event) => state.tickets.some((ticket) => ticket.eventId === event.eventId))
      .map((event) => ({
        ...event,
        city: CITY_WHITELIST.includes(event.city as (typeof CITY_WHITELIST)[number]) ? event.city : "Минск",
        category: CATEGORY_WHITELIST.includes(event.category as (typeof CATEGORY_WHITELIST)[number]) ? event.category : "Концерты",
        description: event.description || "Описание события появится позже.",
        poster: event.poster || "",
      }));
  }, [state.events, state.tickets]);

  const filteredEvents = useMemo(() => {
    const q = search.trim().toLowerCase();
    return publishedEvents.filter((event) => {
      if (city && event.city !== city) return false;
      if (category && event.category !== category) return false;
      if (!q) return true;
      return [event.title, event.venue, event.city, event.category, event.description].join(" ").toLowerCase().includes(q);
    });
  }, [publishedEvents, city, category, search]);

  const featuredEvents = filteredEvents.slice(0, 3);
  const mainGridEvents = filteredEvents.slice(3);

  const detailsEvent = detailsEventId ? filteredEvents.find((event) => event.eventId === detailsEventId) || null : null;
  const selectedTierPrice = detailsEvent?.tiers.find((tier) => tier.name === selectedTier)?.price || 0;
  const totalPrice = selectedTierPrice * quantity;

  const myTickets = useMemo(() => {
    return [...state.demoPurchases].reverse();
  }, [state.demoPurchases]);

  const openDetails = (event: DemoEvent) => {
    setDetailsEventId(event.eventId);
    setSelectedTier(event.tiers[0]?.name || "");
    setQuantity(1);
    setBuyerName("");
    setCheckoutOpen(false);
    setSuccessTicketId(null);
  };

  const openCheckout = () => {
    if (!detailsEvent || !selectedTier) {
      toast.error("Выберите ценовую категорию");
      return;
    }
    setCheckoutOpen(true);
  };

  const confirmPurchase = () => {
    if (!detailsEvent || !selectedTier) return;
    if (!buyerName.trim()) {
      toast.error("Введите имя покупателя");
      return;
    }
    const rec = createDemoPurchaseTicket(state, {
      eventId: detailsEvent.eventId,
      selectedPriceCategory: selectedTier,
      quantity,
      buyerName,
    });
    if (!rec) {
      toast.error("Не удалось завершить покупку");
      return;
    }
    onUpdate({ ...state });
    setCheckoutOpen(false);
    setSuccessTicketId(rec.ticketId);
    toast.success(`Покупка подтверждена: ${rec.ticketId}`);
  };

  // --- Event Card Component ---
  const EventCard = ({ event, featured = false }: { event: DemoEvent; featured?: boolean }) => {
    const dt = formatDateTime(event.dateTime);
    const priceFrom = getPriceFrom(event);
    const availability = getAvailability(state, event);
    const isSoldOut = availability === "Sold out";
    const dateShort = formatDateShort(event.dateTime);

    return (
      <article
        className="group relative overflow-hidden cursor-pointer transition-all duration-300"
        style={{
          borderRadius: D.cardRadius,
          background: D.cardBg,
          border: `1px solid ${D.border}`,
          boxShadow: D.cardShadow,
        }}
        onClick={() => openDetails(event)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = D.borderAccent;
          e.currentTarget.style.transform = "translateY(-3px)";
          e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.4), 0 0 0 1px rgba(99,102,241,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = D.border;
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = D.cardShadow;
        }}
      >
        {/* Poster area */}
        <div className="relative overflow-hidden" style={{ height: featured ? "200px" : "180px" }}>
          <img
            src={event.poster || POSTER_PLACEHOLDER}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(6,8,14,0.95) 0%, rgba(6,8,14,0.4) 40%, transparent 70%)" }} />
          
          {/* Date chip */}
          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg text-xs font-semibold backdrop-blur-md"
            style={{ background: "rgba(0,0,0,0.55)", color: D.text, border: `1px solid rgba(255,255,255,0.08)` }}>
            <Calendar size={11} className="inline mr-1 -mt-0.5" />
            {dateShort || dt.date}
          </div>

          {/* Category chip */}
          <div className="absolute top-3 right-3 px-2 py-1 rounded-lg text-[11px] font-medium backdrop-blur-md"
            style={{ background: D.accentBg, color: D.accentBright, border: `1px solid ${D.borderAccent}` }}>
            {CATEGORY_EMOJI[event.category] || "🎫"} {event.category}
          </div>

          {/* Sold out overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 flex items-center justify-center" style={{ background: "rgba(6,8,14,0.7)" }}>
              <span className="px-4 py-2 rounded-full text-sm font-bold" style={{ background: D.roseBg, color: D.rose, border: `1px solid rgba(251,113,133,0.25)` }}>
                Sold out
              </span>
            </div>
          )}

          {/* Bottom info overlay on poster */}
          <div className="absolute bottom-0 left-0 right-0 px-4 pb-3">
            <h3 className="text-base font-bold leading-tight line-clamp-2" style={{ color: D.text, letterSpacing: "-0.2px" }}>
              {event.title}
            </h3>
          </div>
        </div>

        {/* Info area */}
        <div className="px-4 py-3.5 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs" style={{ color: D.textSec }}>
            <MapPin size={12} style={{ color: D.textMuted }} />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {priceFrom !== null ? (
                <div className="flex items-baseline gap-1">
                  <span className="text-lg font-bold" style={{ color: D.text }}>{priceFrom}</span>
                  <span className="text-xs" style={{ color: D.textMuted }}>BYN</span>
                </div>
              ) : (
                <span className="text-sm" style={{ color: D.textMuted }}>Цена уточняется</span>
              )}
            </div>
            <button
              className="h-8 px-4 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all"
              style={{
                background: isSoldOut ? "rgba(255,255,255,0.04)" : "linear-gradient(135deg, #6366F1, #8B5CF6)",
                color: isSoldOut ? D.textMuted : "#fff",
                cursor: isSoldOut ? "not-allowed" : "pointer",
              }}
              onClick={(e) => { e.stopPropagation(); if (!isSoldOut) openDetails(event); }}
            >
              {isSoldOut ? "Распродано" : "Купить"}
              {!isSoldOut && <ChevronRight size={13} />}
            </button>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="space-y-0 pb-16">
      {/* ===== STICKY NAV BAR ===== */}
      <nav className="sticky top-0 z-40 -mx-5 md:-mx-8 px-5 md:px-8 py-3"
        style={{ background: "rgba(6,8,14,0.85)", backdropFilter: "blur(20px) saturate(180%)", borderBottom: `1px solid ${D.border}` }}>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
              <Ticket size={16} className="text-white" />
            </div>
            <span className="text-base font-bold tracking-tight" style={{ color: D.text, letterSpacing: "-0.3px" }}>TicketHub</span>
          </div>

          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: D.textMuted }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск событий, площадок, городов..."
              className="w-full h-10 pl-9 pr-4 rounded-xl text-sm outline-none transition-all"
              style={{ background: D.surfaceBg, border: `1px solid ${D.border}`, color: D.text }}
              onFocus={(e) => { e.currentTarget.style.borderColor = D.borderAccent; e.currentTarget.style.boxShadow = `0 0 0 3px ${D.accentBg}`; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = D.border; e.currentTarget.style.boxShadow = "none"; }}
            />
          </div>

          <div className="hidden md:flex items-center gap-2">
            <div className="relative">
              <MapPin size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2" style={{ color: D.textMuted }} />
              <select
                value={city}
                onChange={(e) => setCity(e.target.value as "" | (typeof CITY_WHITELIST)[number])}
                className="h-10 pl-8 pr-3 rounded-xl text-sm appearance-none cursor-pointer"
                style={{ background: D.surfaceBg, border: `1px solid ${D.border}`, color: D.textSec }}
              >
                <option value="">Все города</option>
                {CITY_WHITELIST.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </div>
          </div>

          <button
            onClick={() => setTicketsOpen(true)}
            className="relative h-10 px-4 rounded-xl text-sm font-semibold flex items-center gap-2 shrink-0 transition-all"
            style={{
              background: myTickets.length > 0 ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : D.surfaceBg,
              color: myTickets.length > 0 ? "#fff" : D.textSec,
              border: myTickets.length > 0 ? "none" : `1px solid ${D.border}`,
            }}
          >
            <Ticket size={15} />
            <span className="hidden sm:inline">Мои билеты</span>
            {myTickets.length > 0 && (
              <span className="w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center"
                style={{ background: "rgba(255,255,255,0.25)" }}>
                {myTickets.length}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section className="relative overflow-hidden mt-6" style={{ borderRadius: "20px" }}>
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 20% 30%, rgba(99,102,241,0.25), transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(139,92,246,0.18), transparent 55%), radial-gradient(ellipse 50% 40% at 50% 0%, rgba(34,211,238,0.10), transparent 50%)",
        }} />
        <div className="absolute inset-0" style={{ background: D.heroGradient, border: `1px solid rgba(255,255,255,0.06)`, borderRadius: "20px" }} />
        
        <div className="relative px-8 md:px-12 py-12 md:py-16">
          <div className="flex items-center gap-2 mb-4">
            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1.5"
              style={{ background: D.accentBg, color: D.accentBright, border: `1px solid ${D.borderAccent}` }}>
              <Sparkles size={11} /> Живая афиша
            </span>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-medium"
              style={{ background: D.cyanBg, color: D.cyan }}>
              {publishedEvents.length} событий
            </span>
          </div>

          <h1 className="text-3xl md:text-[42px] font-extrabold leading-[1.1] max-w-2xl"
            style={{ color: D.text, letterSpacing: "-0.5px" }}>
            Откройте лучшие
            <br />
            <span style={{ background: "linear-gradient(135deg, #818CF8, #C084FC, #22D3EE)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              события и шоу
            </span>
          </h1>

          <p className="mt-4 text-base md:text-lg max-w-lg leading-relaxed" style={{ color: D.textSec }}>
            Концерты, театры, фестивали и детские мероприятия в городах Беларуси. Покупайте билеты онлайн.
          </p>

          {/* Quick stats row */}
          <div className="mt-8 flex flex-wrap gap-6">
            {[
              { icon: Star, label: "Города", value: "6" },
              { icon: Calendar, label: "Категорий", value: "5" },
              { icon: TrendingUp, label: "В тренде", value: String(Math.min(featuredEvents.length, 3)) },
            ].map((s) => (
              <div key={s.label} className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <s.icon size={16} style={{ color: D.accentBright }} />
                </div>
                <div>
                  <div className="text-lg font-bold" style={{ color: D.text }}>{s.value}</div>
                  <div className="text-[11px]" style={{ color: D.textMuted }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CATEGORY CHIPS ===== */}
      <section className="mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORY_WHITELIST.map((item) => {
          const active = category === item;
          return (
            <button
              key={item}
              onClick={() => setCategory((prev) => prev === item ? "" : item)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                background: active ? "linear-gradient(135deg, #6366F1, #8B5CF6)" : D.surfaceBg,
                color: active ? "#fff" : D.textSec,
                border: `1px solid ${active ? "transparent" : D.border}`,
              }}
            >
              <span>{CATEGORY_EMOJI[item]}</span>
              {item}
            </button>
          );
        })}
      </section>

      {/* ===== TRENDING / FEATURED ===== */}
      <section className="mt-10 space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: D.goldBg }}>
              <TrendingUp size={15} style={{ color: D.gold }} />
            </div>
            <div>
              <h2 className="text-xl font-bold" style={{ color: D.text, letterSpacing: "-0.3px" }}>В тренде</h2>
              <p className="text-xs" style={{ color: D.textMuted }}>Популярные события недели</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {featuredEvents.map((event) => (
            <EventCard key={event.eventId} event={event} featured />
          ))}
          {featuredEvents.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 rounded-2xl"
              style={{ background: D.surfaceBg, border: `1px solid ${D.border}` }}>
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4" style={{ background: D.accentBg }}>
                <Calendar size={24} style={{ color: D.accent }} />
              </div>
              <p className="text-sm font-medium" style={{ color: D.textSec }}>Нет опубликованных событий</p>
              <p className="text-xs mt-1" style={{ color: D.textMuted }}>Запустите демо-сценарий в Admin Console</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== EDITORIAL PROMO 1 ===== */}
      <section className="mt-10 relative overflow-hidden" style={{ borderRadius: "16px", border: `1px solid rgba(251,191,36,0.15)` }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(251,191,36,0.08) 0%, rgba(245,158,11,0.04) 50%, rgba(99,102,241,0.06) 100%)" }} />
        <div className="relative flex items-center gap-6 px-8 py-7">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: D.goldBg, border: `1px solid rgba(251,191,36,0.20)` }}>
            <Star size={22} style={{ color: D.gold }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold" style={{ color: D.text }}>Подборка выходных</h3>
            <p className="text-sm mt-0.5" style={{ color: D.textSec }}>Откройте карточку события и оформите покупку за минуту. Доставка электронного билета мгновенно.</p>
          </div>
          <ChevronRight size={20} style={{ color: D.textMuted }} className="shrink-0 hidden md:block" />
        </div>
      </section>

      {/* ===== ALL EVENTS GRID ===== */}
      <section className="mt-10 space-y-5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: D.accentBg }}>
            <Tag size={15} style={{ color: D.accent }} />
          </div>
          <h2 className="text-xl font-bold" style={{ color: D.text, letterSpacing: "-0.3px" }}>Все события</h2>
          {mainGridEvents.length > 0 && (
            <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: D.surfaceBg, color: D.textMuted }}>
              {mainGridEvents.length}
            </span>
          )}
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {mainGridEvents.map((event) => (
            <EventCard key={event.eventId} event={event} />
          ))}
          {mainGridEvents.length === 0 && featuredEvents.length > 0 && (
            <div className="col-span-full flex items-center justify-center py-12 rounded-2xl"
              style={{ background: D.surfaceBg, border: `1px solid ${D.border}` }}>
              <p className="text-sm" style={{ color: D.textMuted }}>Остальные события появятся после публикации новых мероприятий.</p>
            </div>
          )}
        </div>
      </section>

      {/* ===== EDITORIAL PROMO 2 — SPOTLIGHT ===== */}
      <section className="mt-10 relative overflow-hidden" style={{ borderRadius: "16px", border: `1px solid rgba(34,211,238,0.12)` }}>
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(34,211,238,0.06) 0%, rgba(99,102,241,0.06) 50%, rgba(139,92,246,0.04) 100%)" }} />
        <div className="relative flex items-center gap-6 px-8 py-7">
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0"
            style={{ background: D.cyanBg, border: `1px solid rgba(34,211,238,0.15)` }}>
            <Sparkles size={22} style={{ color: D.cyan }} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold" style={{ color: D.text }}>Spotlight</h3>
            <p className="text-sm mt-0.5" style={{ color: D.textSec }}>Следите за новыми релизами афиши TicketHub. Лучшие площадки и организаторы.</p>
          </div>
          <ChevronRight size={20} style={{ color: D.textMuted }} className="shrink-0 hidden md:block" />
        </div>
      </section>

      {/* ===== DETAILS MODAL ===== */}
      {detailsEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetailsEventId(null)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }} />
          <div
            className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto"
            style={{ borderRadius: "20px", border: `1px solid ${D.borderLight}`, background: D.cardBg, boxShadow: "0 32px 80px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button onClick={() => setDetailsEventId(null)}
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ background: "rgba(0,0,0,0.5)", backdropFilter: "blur(8px)", color: D.textSec }}>
              <X size={16} />
            </button>

            <div className="grid gap-0 md:grid-cols-2">
              {/* Poster side */}
              <div className="relative">
                <img src={detailsEvent.poster || POSTER_PLACEHOLDER} alt={detailsEvent.title}
                  className="w-full h-64 md:h-full object-cover" style={{ borderRadius: "20px 0 0 0" }} />
                <div className="absolute inset-0 md:hidden" style={{ background: "linear-gradient(to top, rgba(13,17,23,1) 0%, transparent 50%)" }} />
              </div>

              {/* Info side */}
              <div className="p-6 space-y-4">
                <div>
                  <span className="px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ background: D.accentBg, color: D.accentBright }}>
                    {detailsEvent.category}
                  </span>
                  <h3 className="mt-3 text-xl font-bold leading-tight" style={{ color: D.text, letterSpacing: "-0.3px" }}>
                    {detailsEvent.title}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm" style={{ color: D.textSec }}>
                    <Calendar size={14} style={{ color: D.textMuted }} />
                    {formatDateTime(detailsEvent.dateTime).date} · {formatDateTime(detailsEvent.dateTime).time}
                  </div>
                  <div className="flex items-center gap-2 text-sm" style={{ color: D.textSec }}>
                    <MapPin size={14} style={{ color: D.textMuted }} />
                    {detailsEvent.city} · {detailsEvent.venue}
                  </div>
                </div>

                <p className="text-sm leading-relaxed" style={{ color: D.textSec }}>{detailsEvent.description}</p>

                <div className="space-y-3 pt-2" style={{ borderTop: `1px solid ${D.border}` }}>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: D.textMuted }}>Категория билета</label>
                    <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)}
                      className="h-10 w-full rounded-xl px-3 text-sm outline-none"
                      style={{ background: D.surfaceBg, border: `1px solid ${D.border}`, color: D.text }}>
                      {detailsEvent.tiers.map((tier) => <option key={tier.name} value={tier.name}>{tier.name} — {tier.price} BYN</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1.5" style={{ color: D.textMuted }}>Количество</label>
                    <input type="number" min={1} max={6} value={quantity}
                      onChange={(e) => setQuantity(Math.max(1, Math.min(6, Number(e.target.value) || 1)))}
                      className="h-10 w-full rounded-xl px-3 text-sm outline-none"
                      style={{ background: D.surfaceBg, border: `1px solid ${D.border}`, color: D.text }} />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <div className="text-xs" style={{ color: D.textMuted }}>Итого</div>
                    <div className="text-2xl font-bold" style={{ color: D.text }}>{totalPrice || 0} <span className="text-sm font-normal" style={{ color: D.textMuted }}>BYN</span></div>
                  </div>
                  <button onClick={openCheckout}
                    className="h-11 px-6 rounded-xl text-sm font-bold transition-all"
                    style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff" }}>
                    Купить билет
                  </button>
                </div>

                {/* Checkout inline */}
                {checkoutOpen && (
                  <div className="mt-2 p-4 rounded-xl space-y-3" style={{ background: D.surfaceLight, border: `1px solid ${D.borderLight}` }}>
                    <h4 className="text-sm font-bold" style={{ color: D.text }}>Подтверждение покупки</h4>
                    <p className="text-xs" style={{ color: D.textSec }}>{selectedTier} × {quantity} · Итого {totalPrice} BYN</p>
                    <div>
                      <label className="block text-xs font-medium mb-1" style={{ color: D.textMuted }}>Имя покупателя</label>
                      <input
                        value={buyerName}
                        onChange={(e) => setBuyerName(e.target.value)}
                        placeholder="Введите имя"
                        className="h-10 w-full rounded-xl px-3 text-sm outline-none"
                        style={{ background: D.surfaceBg, border: `1px solid ${D.border}`, color: D.text }}
                      />
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button onClick={() => setCheckoutOpen(false)}
                        className="h-9 px-4 rounded-lg text-sm font-medium transition-colors"
                        style={{ border: `1px solid ${D.borderLight}`, color: D.textSec }}>
                        Отмена
                      </button>
                      <button onClick={confirmPurchase}
                        className="h-9 px-5 rounded-lg text-sm font-bold"
                        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff" }}>
                        Подтвердить
                      </button>
                    </div>
                  </div>
                )}

                {/* Success */}
                {successTicketId && (
                  <div className="mt-2 p-4 rounded-xl space-y-3" style={{ background: D.greenBg, border: `1px solid rgba(52,211,153,0.2)` }}>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={18} style={{ color: D.green }} />
                      <h4 className="text-sm font-bold" style={{ color: D.green }}>Покупка успешна</h4>
                    </div>
                    <p className="text-xs font-mono" style={{ color: D.textSec }}>TicketID: {successTicketId}</p>
                    <div className="flex gap-2">
                      <button onClick={() => setTicketsOpen(true)}
                        className="h-9 px-4 rounded-lg text-sm font-semibold"
                        style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)", color: "#fff" }}>
                        Мои билеты
                      </button>
                      <button onClick={() => setDetailsEventId(null)}
                        className="h-9 px-4 rounded-lg text-sm font-medium"
                        style={{ border: `1px solid ${D.borderLight}`, color: D.textSec }}>
                        В афишу
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== MY TICKETS DRAWER ===== */}
      {ticketsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setTicketsOpen(false)}>
          <div className="absolute inset-0" style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }} />
          <div
            className="relative h-full w-full max-w-md overflow-y-auto"
            style={{ background: D.cardBg, borderLeft: `1px solid ${D.borderLight}`, boxShadow: "-16px 0 64px rgba(0,0,0,0.5)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5"
              style={{ background: "rgba(13,17,23,0.92)", backdropFilter: "blur(16px)", borderBottom: `1px solid ${D.border}` }}>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #6366F1, #8B5CF6)" }}>
                  <Ticket size={16} className="text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold" style={{ color: D.text }}>Мои билеты</h3>
                  <p className="text-xs" style={{ color: D.textMuted }}>{myTickets.length} билетов</p>
                </div>
              </div>
              <button onClick={() => setTicketsOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
                style={{ background: "rgba(255,255,255,0.06)", color: D.textSec }}>
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-3">
              {myTickets.length === 0 && (
                <div className="flex flex-col items-center justify-center py-16">
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: D.accentBg }}>
                    <Ticket size={28} style={{ color: D.accent }} />
                  </div>
                  <p className="text-sm font-medium" style={{ color: D.textSec }}>У вас пока нет билетов</p>
                  <p className="text-xs mt-1 text-center" style={{ color: D.textMuted }}>Выберите событие из афиши и оформите покупку</p>
                </div>
              )}

              {myTickets.map((ticket) => (
                <article key={ticket.ticketId}
                  className="rounded-xl p-4 space-y-2.5 transition-colors"
                  style={{ background: D.surfaceBg, border: `1px solid ${D.border}` }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-sm font-semibold" style={{ color: D.text }}>{ticket.eventTitle}</h4>
                      <p className="text-xs mt-0.5" style={{ color: D.textMuted }}>{ticket.date} · {ticket.time}</p>
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold"
                      style={{ background: D.greenBg, color: D.green }}>
                      confirmed
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div style={{ color: D.textMuted }}>Город</div>
                      <div className="font-medium" style={{ color: D.textSec }}>{ticket.city}</div>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div style={{ color: D.textMuted }}>Площадка</div>
                      <div className="font-medium" style={{ color: D.textSec }}>{ticket.venue}</div>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div style={{ color: D.textMuted }}>Категория</div>
                      <div className="font-medium" style={{ color: D.textSec }}>{ticket.selectedPriceCategory} × {ticket.quantity}</div>
                    </div>
                    <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.03)" }}>
                      <div style={{ color: D.textMuted }}>Покупатель</div>
                      <div className="font-medium" style={{ color: D.textSec }}>{ticket.buyerName}</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1" style={{ borderTop: `1px solid ${D.border}` }}>
                    <span className="text-[11px] font-mono" style={{ color: D.textMuted }}>{ticket.ticketId}</span>
                    <span className="text-[11px]" style={{ color: D.textMuted }}>{ticket.purchasedAt.replace("T", " ").slice(0, 16)}</span>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
