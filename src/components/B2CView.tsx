import React, { useMemo, useState } from "react";
import type { AppState, EventRecord } from "@/lib/store";
import { createDemoPurchaseTicket } from "@/lib/store";
import { toast } from "sonner";

interface Props {
  state: AppState;
  onUpdate: (s: AppState) => void;
}

const CITY_WHITELIST = ["Минск", "Брест", "Витебск", "Гомель", "Гродно", "Могилёв"] as const;
const CATEGORY_WHITELIST = ["Концерты", "Театр", "Шоу", "Детям", "Фестивали"] as const;
const POSTER_PLACEHOLDER = "/placeholder.svg";

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
      .map((event) => ({
        ...event,
        city: CITY_WHITELIST.includes(event.city as (typeof CITY_WHITELIST)[number]) ? event.city : "Минск",
        category: CATEGORY_WHITELIST.includes(event.category as (typeof CATEGORY_WHITELIST)[number]) ? event.category : "Концерты",
        description: event.description || "Описание события появится позже.",
        poster: event.poster || "",
      }));
  }, [state.events]);

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

  return (
    <div className="space-y-8 pb-10">
      <header className="sticky top-0 z-40 rounded-2xl border border-white/10 bg-[#0B1220]/90 backdrop-blur px-4 py-3">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="text-white font-bold text-xl">TicketHub</div>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск событий, площадок, городов"
            className="h-10 flex-1 rounded-xl border border-white/15 bg-[#111C31] px-3 text-sm text-white outline-none"
          />
          <select
            value={city}
            onChange={(e) => setCity(e.target.value as "" | (typeof CITY_WHITELIST)[number])}
            className="h-10 rounded-xl border border-white/15 bg-[#111C31] px-3 text-sm text-white"
          >
            <option value="">Все города</option>
            {CITY_WHITELIST.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as "" | (typeof CATEGORY_WHITELIST)[number])}
            className="h-10 rounded-xl border border-white/15 bg-[#111C31] px-3 text-sm text-white"
          >
            <option value="">Все категории</option>
            {CATEGORY_WHITELIST.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
          <button onClick={() => setTicketsOpen(true)} className="h-10 rounded-xl bg-white px-4 text-sm font-semibold text-black">Мои билеты</button>
        </div>
      </header>

      <section className="rounded-3xl border border-indigo-300/20 bg-gradient-to-r from-[#111A31] via-[#18264A] to-[#231B44] p-6 md:p-8">
        <p className="text-indigo-200 text-sm">Живая афиша TicketHub</p>
        <h1 className="mt-2 text-3xl font-bold text-white">Найдите событие на ближайшие выходные</h1>
        <p className="mt-2 text-sm text-indigo-100/90">Концерты, театр, шоу, детские мероприятия и фестивали в городах Беларуси.</p>
      </section>

      <section className="flex flex-wrap gap-2">
        {CATEGORY_WHITELIST.map((item) => (
          <button
            key={item}
            onClick={() => setCategory((prev) => prev === item ? "" : item)}
            className={`rounded-full px-4 py-1.5 text-sm border ${category === item ? "bg-white text-black border-white" : "bg-[#111C31] text-white border-white/15"}`}
          >
            {item}
          </button>
        ))}
      </section>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">В тренде</h2>
          <span className="text-sm text-white/70">События недели</span>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {featuredEvents.map((event) => {
            const dt = formatDateTime(event.dateTime);
            const priceFrom = getPriceFrom(event);
            const availability = getAvailability(state, event);
            return (
              <article key={event.eventId} className="overflow-hidden rounded-2xl border border-white/10 bg-[#101726]">
                <img src={event.poster || POSTER_PLACEHOLDER} alt={event.title} className="h-44 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold text-white line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-white/70">{dt.date} · {event.city}</p>
                  <p className="text-sm text-white/70">{event.venue}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-indigo-200">{priceFrom !== null ? `от ${priceFrom}` : "Цена уточняется"}</span>
                    <span className="text-xs text-white/70">{availability}</span>
                  </div>
                  <button onClick={() => openDetails(event)} className="h-9 w-full rounded-lg bg-white text-sm font-semibold text-black">Купить</button>
                </div>
              </article>
            );
          })}
          {featuredEvents.length === 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-[#101726] p-8 text-center text-white/70">Нет опубликованных событий</div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200/20 bg-[#221C10] p-5">
        <h3 className="text-lg font-semibold text-amber-100">Подборка выходных</h3>
        <p className="mt-1 text-sm text-amber-50/85">Откройте карточку события и оформите покупку за минуту.</p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Все события</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {mainGridEvents.map((event) => {
            const dt = formatDateTime(event.dateTime);
            const priceFrom = getPriceFrom(event);
            const availability = getAvailability(state, event);
            return (
              <article key={event.eventId} className="overflow-hidden rounded-2xl border border-white/10 bg-[#101726]">
                <img src={event.poster || POSTER_PLACEHOLDER} alt={event.title} className="h-40 w-full object-cover" />
                <div className="space-y-2 p-4">
                  <h3 className="font-semibold text-white line-clamp-2">{event.title}</h3>
                  <p className="text-sm text-white/70">{dt.date} · {event.city}</p>
                  <p className="text-sm text-white/70">{event.venue}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-indigo-200">{priceFrom !== null ? `от ${priceFrom}` : "Цена уточняется"}</span>
                    <span className="text-xs text-white/70">{availability}</span>
                  </div>
                  <button onClick={() => openDetails(event)} className="h-9 w-full rounded-lg bg-white text-sm font-semibold text-black">Купить</button>
                </div>
              </article>
            );
          })}
          {mainGridEvents.length === 0 && featuredEvents.length > 0 && (
            <div className="col-span-full rounded-2xl border border-white/10 bg-[#101726] p-6 text-center text-white/60">Остальные события появятся после публикации новых мероприятий.</div>
          )}
        </div>
      </section>

      <section className="rounded-2xl border border-cyan-200/20 bg-[#10242A] p-5">
        <h3 className="text-lg font-semibold text-cyan-100">Spotlight</h3>
        <p className="mt-1 text-sm text-cyan-50/85">Следите за новыми релизами афиши TicketHub.</p>
      </section>

      {detailsEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setDetailsEventId(null)}>
          <div className="absolute inset-0 bg-black/70" />
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/15 bg-[#0F172A] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="grid gap-4 md:grid-cols-2">
              <img src={detailsEvent.poster || POSTER_PLACEHOLDER} alt={detailsEvent.title} className="h-64 w-full rounded-xl object-cover" />
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-white">{detailsEvent.title}</h3>
                <p className="text-sm text-white/70">{formatDateTime(detailsEvent.dateTime).date} · {formatDateTime(detailsEvent.dateTime).time}</p>
                <p className="text-sm text-white/70">{detailsEvent.city} · {detailsEvent.venue}</p>
                <p className="text-sm text-indigo-200">{getPriceFrom(detailsEvent) !== null ? `от ${getPriceFrom(detailsEvent)}` : "Цена уточняется"}</p>
                <p className="text-sm text-white/80">{detailsEvent.description}</p>
                <div>
                  <label className="mb-1 block text-xs text-white/70">Билет</label>
                  <select value={selectedTier} onChange={(e) => setSelectedTier(e.target.value)} className="h-10 w-full rounded-lg border border-white/15 bg-[#111C31] px-3 text-sm text-white">
                    {detailsEvent.tiers.map((tier) => <option key={tier.name} value={tier.name}>{tier.name} — {tier.price}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs text-white/70">Количество</label>
                  <input type="number" min={1} max={6} value={quantity} onChange={(e) => setQuantity(Math.max(1, Math.min(6, Number(e.target.value) || 1)))} className="h-10 w-full rounded-lg border border-white/15 bg-[#111C31] px-3 text-sm text-white" />
                </div>
                <p className="text-sm font-semibold text-white">Итого: {totalPrice || 0}</p>
                <button onClick={openCheckout} className="h-10 w-full rounded-lg bg-white text-sm font-semibold text-black">Купить билет</button>
              </div>
            </div>

            {checkoutOpen && (
              <div className="mt-5 rounded-xl border border-white/15 bg-[#121F38] p-4">
                <h4 className="font-semibold text-white">Подтверждение покупки</h4>
                <p className="mt-1 text-sm text-white/70">{selectedTier} × {quantity} · Итого {totalPrice}</p>
                <input
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  placeholder="Имя покупателя"
                  className="mt-3 h-10 w-full rounded-lg border border-white/15 bg-[#111C31] px-3 text-sm text-white"
                />
                <div className="mt-3 flex justify-end gap-2">
                  <button onClick={() => setCheckoutOpen(false)} className="h-9 rounded-lg border border-white/20 px-3 text-sm text-white">Отмена</button>
                  <button onClick={confirmPurchase} className="h-9 rounded-lg bg-white px-3 text-sm font-semibold text-black">Подтвердить покупку</button>
                </div>
              </div>
            )}

            {successTicketId && (
              <div className="mt-5 rounded-xl border border-emerald-300/30 bg-emerald-500/10 p-4">
                <h4 className="font-semibold text-emerald-200">Покупка успешно завершена</h4>
                <p className="mt-1 text-sm text-emerald-100">TicketID: {successTicketId}</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={() => setTicketsOpen(true)} className="h-9 rounded-lg bg-white px-3 text-sm font-semibold text-black">Мои билеты</button>
                  <button onClick={() => setDetailsEventId(null)} className="h-9 rounded-lg border border-white/20 px-3 text-sm text-white">Вернуться в афишу</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {ticketsOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setTicketsOpen(false)}>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative h-full w-full max-w-lg overflow-y-auto border-l border-white/15 bg-[#0F172A] p-5" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Мои билеты</h3>
              <button onClick={() => setTicketsOpen(false)} className="text-sm text-white/70">Закрыть</button>
            </div>
            <div className="space-y-3">
              {myTickets.length === 0 && <p className="text-sm text-white/70">У вас пока нет купленных билетов.</p>}
              {myTickets.map((ticket) => (
                <article key={ticket.ticketId} className="rounded-xl border border-white/15 bg-[#111C31] p-4 text-sm text-white/85">
                  <p><span className="text-white/60">TicketID:</span> {ticket.ticketId}</p>
                  <p><span className="text-white/60">Событие:</span> {ticket.eventTitle}</p>
                  <p><span className="text-white/60">Дата/время:</span> {ticket.date} {ticket.time}</p>
                  <p><span className="text-white/60">Город/площадка:</span> {ticket.city}, {ticket.venue}</p>
                  <p><span className="text-white/60">Категория:</span> {ticket.selectedPriceCategory} × {ticket.quantity}</p>
                  <p><span className="text-white/60">Покупатель:</span> {ticket.buyerName}</p>
                  <p><span className="text-white/60">Дата покупки:</span> {ticket.purchasedAt.replace("T", " ").slice(0, 16)}</p>
                  <p><span className="text-white/60">Статус:</span> confirmed</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
