// TicketHub MVP State Management — localStorage based

export type Role = "organizer" | "regulator" | "tickethub" | "channel" | "b2c";
export type Channel = "ByCard" | "TicketPro" | "SellerPOS";
export type AppStatus = "draft" | "submitted" | "approved" | "rejected";
export type EventStatus = "approved" | "published";
export type TicketStatus = "issued" | "sold" | "refunded" | "redeemed";
export type OpType = "sell" | "refund" | "redeem" | "verify";
export type OpResult = "ok" | "error";

export interface PriceTier {
  name: string;
  price: number;
}

export interface Application {
  appId: string;
  title: string;
  venue: string;
  dateTime: string;
  capacity: number;
  tiers: PriceTier[];
  city: string;
  category: string;
  description: string;
  poster: string;
  status: AppStatus;
  licenseId?: string;
  eventId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventRecord {
  eventId: string;
  licenseId: string;
  appId: string;
  title: string;
  venue: string;
  dateTime: string;
  capacity: number;
  tiers: PriceTier[];
  city: string;
  category: string;
  description: string;
  poster: string;
  status: EventStatus;
  remaining: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ticket {
  ticketId: string;
  eventId: string;
  tier: string;
  status: TicketStatus;
  soldByChannel?: string;
  soldToUserId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OpRecord {
  opId: string;
  type: OpType;
  ticketId?: string;
  eventId: string;
  channel: string;
  result: OpResult;
  reason?: string;
  ts: string;
}

export interface DemoUser {
  userId: string;
  name: string;
}

export interface DemoPurchaseTicket {
  ticketId: string;
  eventId: string;
  eventTitle: string;
  date: string;
  time: string;
  city: string;
  venue: string;
  buyerName: string;
  selectedPriceCategory: string;
  quantity: number;
  purchasedAt: string;
  status: "confirmed";
}

export interface AppState {
  meta: { version: string; updatedAt: string };
  counters: { app: number; lic: number; evt: number; tck: number; op: number };
  applications: Application[];
  events: EventRecord[];
  tickets: Ticket[];
  demoPurchases: DemoPurchaseTicket[];
  ops: OpRecord[];
  users: DemoUser[];
  ui: { selectedRole: Role; selectedChannel: Channel };
}

const STORAGE_KEY = "ticket_hub_state_v1";

function pad(n: number, len: number): string {
  return String(n).padStart(len, "0");
}

export function genId(prefix: string, counter: number): string {
  const len = prefix === "OP" || prefix === "TCK" ? 6 : 4;
  return `${prefix}-${pad(counter, len)}`;
}

export function defaultState(): AppState {
  return {
    meta: { version: "v1", updatedAt: new Date().toISOString() },
    counters: { app: 1, lic: 1, evt: 1, tck: 1, op: 1 },
    applications: [],
    events: [],
    tickets: [],
    demoPurchases: [],
    ops: [],
    users: [{ userId: "demo_user_1", name: "Демо пользователь" }],
    ui: { selectedRole: "organizer", selectedChannel: "ByCard" },
  };
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return {
        ...defaultState(),
        ...parsed,
        applications: Array.isArray(parsed.applications) ? parsed.applications : [],
        events: Array.isArray(parsed.events) ? parsed.events : [],
        tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
        demoPurchases: Array.isArray(parsed.demoPurchases) ? parsed.demoPurchases : [],
        ops: Array.isArray(parsed.ops) ? parsed.ops : [],
        users: Array.isArray(parsed.users) ? parsed.users : [{ userId: "demo_user_1", name: "Демо пользователь" }],
      };
    }
  } catch {}
  return defaultState();
}

export function saveState(state: AppState): void {
  state.meta.updatedAt = new Date().toISOString();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

export function resetState(): void {
  localStorage.removeItem(STORAGE_KEY);
}

// ===== Business Logic =====

function nextId(state: AppState, key: "app" | "lic" | "evt" | "tck" | "op", prefix: string): string {
  const id = genId(prefix, state.counters[key]);
  state.counters[key]++;
  return id;
}

function addOp(state: AppState, op: Omit<OpRecord, "opId" | "ts">): OpRecord {
  const rec: OpRecord = { ...op, opId: nextId(state, "op", "OP"), ts: new Date().toISOString() };
  state.ops.push(rec);
  return rec;
}

function recalcRemaining(state: AppState, eventId: string) {
  const evt = state.events.find((e) => e.eventId === eventId);
  if (!evt) return;
  evt.remaining = state.tickets.filter((t) => t.eventId === eventId && t.status === "issued").length;
}

export function createApplication(
  state: AppState,
  data: {
    title: string;
    venue: string;
    dateTime: string;
    capacity: number;
    tiers: PriceTier[];
    city?: string;
    category?: string;
    description?: string;
    poster?: string;
  },
  submit: boolean
): Application {
  const app: Application = {
    appId: nextId(state, "app", "APP"),
    ...data,
    city: data.city || "",
    category: data.category || "",
    description: data.description || "",
    poster: data.poster || "",
    status: submit ? "submitted" : "draft",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.applications.push(app);
  saveState(state);
  return app;
}

export function submitApplication(state: AppState, appId: string): boolean {
  const app = state.applications.find((a) => a.appId === appId);
  if (!app || app.status !== "draft") return false;
  app.status = "submitted";
  app.updatedAt = new Date().toISOString();
  saveState(state);
  return true;
}

export function approveApplication(state: AppState, appId: string): { licenseId: string; eventId: string } | null {
  const app = state.applications.find((a) => a.appId === appId);
  if (!app || app.status !== "submitted") return null;
  const licenseId = nextId(state, "lic", "LIC");
  const eventId = nextId(state, "evt", "EVT");
  app.status = "approved";
  app.licenseId = licenseId;
  app.eventId = eventId;
  app.updatedAt = new Date().toISOString();
  const evt: EventRecord = {
    eventId,
    licenseId,
    appId,
    title: app.title,
    venue: app.venue,
    dateTime: app.dateTime,
    capacity: app.capacity,
    tiers: [...app.tiers],
    city: app.city,
    category: app.category,
    description: app.description,
    poster: app.poster,
    status: "approved",
    remaining: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  state.events.push(evt);
  saveState(state);
  return { licenseId, eventId };
}

export function rejectApplication(state: AppState, appId: string): boolean {
  const app = state.applications.find((a) => a.appId === appId);
  if (!app || app.status !== "submitted") return false;
  app.status = "rejected";
  app.updatedAt = new Date().toISOString();
  saveState(state);
  return true;
}

export function publishEvent(state: AppState, eventId: string): boolean {
  const evt = state.events.find((e) => e.eventId === eventId);
  if (!evt || evt.status !== "approved") return false;
  evt.status = "published";
  evt.updatedAt = new Date().toISOString();
  saveState(state);
  return true;
}

export function issueMarks(state: AppState, eventId: string): number {
  const evt = state.events.find((e) => e.eventId === eventId);
  if (!evt) return 0;
  const existing = state.tickets.filter((t) => t.eventId === eventId);
  if (existing.length > 0) return 0;
  const { capacity, tiers } = evt;
  let distribution: number[];
  if (tiers.length === 2) {
    distribution = [Math.ceil(capacity * 0.5), Math.floor(capacity * 0.5)];
  } else if (tiers.length === 3) {
    const a = Math.ceil(capacity * 0.4);
    const b = Math.ceil(capacity * 0.3);
    distribution = [a, b, capacity - a - b];
  } else {
    distribution = [capacity];
  }
  const now = new Date().toISOString();
  for (let i = 0; i < tiers.length; i++) {
    for (let j = 0; j < distribution[i]; j++) {
      state.tickets.push({
        ticketId: nextId(state, "tck", "TCK"),
        eventId,
        tier: tiers[i].name,
        status: "issued",
        createdAt: now,
        updatedAt: now,
      });
    }
  }
  recalcRemaining(state, eventId);
  evt.updatedAt = now;
  saveState(state);
  return capacity;
}

export interface OpOutcome {
  ok: boolean;
  reason?: string;
  ticketId?: string;
  status?: TicketStatus;
  op: OpRecord;
}

export function sell(state: AppState, eventId: string, tierName: string, channel: string, userId?: string): OpOutcome {
  const ticket = state.tickets.find((t) => t.eventId === eventId && t.tier === tierName && t.status === "issued");
  if (!ticket) {
    const op = addOp(state, { type: "sell", eventId, channel, result: "error", reason: "Нет доступных билетов" });
    saveState(state);
    return { ok: false, reason: "Нет доступных билетов", op };
  }
  ticket.status = "sold";
  ticket.soldByChannel = channel;
  ticket.soldToUserId = userId || undefined;
  ticket.updatedAt = new Date().toISOString();
  const op = addOp(state, { type: "sell", ticketId: ticket.ticketId, eventId, channel, result: "ok" });
  recalcRemaining(state, eventId);
  saveState(state);
  return { ok: true, ticketId: ticket.ticketId, status: ticket.status, op };
}

function ticketErrorReason(status: TicketStatus): string {
  switch (status) {
    case "issued": return "Билет не продан";
    case "redeemed": return "Билет уже погашен";
    case "refunded": return "Билет уже возвращён";
    default: return "Недопустимый статус";
  }
}

export function refund(state: AppState, ticketId: string, channel: string): OpOutcome {
  const ticket = state.tickets.find((t) => t.ticketId === ticketId);
  if (!ticket) {
    const op = addOp(state, { type: "refund", eventId: "", channel, result: "error", reason: "Билет не найден", ticketId });
    saveState(state);
    return { ok: false, reason: "Билет не найден", op };
  }
  if (ticket.status !== "sold") {
    const reason = ticketErrorReason(ticket.status);
    const op = addOp(state, { type: "refund", ticketId, eventId: ticket.eventId, channel, result: "error", reason });
    saveState(state);
    return { ok: false, reason, status: ticket.status, op };
  }
  ticket.status = "refunded";
  ticket.updatedAt = new Date().toISOString();
  const op = addOp(state, { type: "refund", ticketId, eventId: ticket.eventId, channel, result: "ok" });
  recalcRemaining(state, ticket.eventId);
  saveState(state);
  return { ok: true, ticketId, status: ticket.status, op };
}

export function redeem(state: AppState, ticketId: string, channel: string): OpOutcome {
  const ticket = state.tickets.find((t) => t.ticketId === ticketId);
  if (!ticket) {
    const op = addOp(state, { type: "redeem", eventId: "", channel, result: "error", reason: "Билет не найден", ticketId });
    saveState(state);
    return { ok: false, reason: "Билет не найден", op };
  }
  if (ticket.status !== "sold") {
    const reason = ticketErrorReason(ticket.status);
    const op = addOp(state, { type: "redeem", ticketId, eventId: ticket.eventId, channel, result: "error", reason });
    saveState(state);
    return { ok: false, reason, status: ticket.status, op };
  }
  ticket.status = "redeemed";
  ticket.updatedAt = new Date().toISOString();
  const op = addOp(state, { type: "redeem", ticketId, eventId: ticket.eventId, channel, result: "ok" });
  saveState(state);
  return { ok: true, ticketId, status: ticket.status, op };
}

export function verify(state: AppState, ticketId: string, channel: string): OpOutcome {
  const ticket = state.tickets.find((t) => t.ticketId === ticketId);
  if (!ticket) {
    const op = addOp(state, { type: "verify", eventId: "", channel, result: "error", reason: "Билет не найден", ticketId });
    saveState(state);
    return { ok: false, reason: "Билет не найден", op };
  }
  const op = addOp(state, { type: "verify", ticketId, eventId: ticket.eventId, channel, result: "ok" });
  saveState(state);
  return { ok: true, ticketId, status: ticket.status, op };
}

export function createDemoPurchaseTicket(
  state: AppState,
  data: { eventId: string; selectedPriceCategory: string; quantity: number; buyerName: string }
): DemoPurchaseTicket | null {
  const event = state.events.find((e) => e.eventId === data.eventId && e.status === "published");
  if (!event) return null;
  const safeQty = Math.max(1, Math.min(6, Math.floor(data.quantity)));
  const [date = "", timeRaw = ""] = event.dateTime.split("T");
  const time = timeRaw ? timeRaw.slice(0, 5) : "";
  const now = new Date().toISOString();
  const rec: DemoPurchaseTicket = {
    ticketId: nextId(state, "tck", "TCK"),
    eventId: event.eventId,
    eventTitle: event.title,
    date,
    time,
    city: event.city || "",
    venue: event.venue,
    buyerName: data.buyerName.trim(),
    selectedPriceCategory: data.selectedPriceCategory,
    quantity: safeQty,
    purchasedAt: now,
    status: "confirmed",
  };
  state.demoPurchases.push(rec);
  saveState(state);
  return rec;
}

// ===== Demo helpers =====

export function generateDemoData(state: AppState): void {
  // 1 submitted app
  const app = createApplication(state, {
    title: "Концерт «Классика под звёздами»",
    venue: "Большой зал филармонии",
    dateTime: "2026-05-15T19:00",
    capacity: 30,
    tiers: [
      { name: "Партер", price: 3000 },
      { name: "Балкон", price: 1500 },
      { name: "Галёрка", price: 800 },
    ],
    city: "Минск",
    category: "Концерты",
    description: "Вечер классической музыки в атмосферном зале.",
    poster: "",
  }, true);
  // approve
  approveApplication(state, app.appId);
  const evt = state.events[state.events.length - 1];
  // publish
  publishEvent(state, evt.eventId);
  // issue
  issueMarks(state, evt.eventId);
  // sell 2
  sell(state, evt.eventId, "Партер", "ByCard", "demo_user_1");
  sell(state, evt.eventId, "Балкон", "ByCard");
}

export function runDemoScenario(): AppState {
  resetState();
  const state = defaultState();
  // create submitted
  const app = createApplication(state, {
    title: "Концерт «Классика под звёздами»",
    venue: "Большой зал филармонии",
    dateTime: "2026-05-15T19:00",
    capacity: 30,
    tiers: [
      { name: "Партер", price: 3000 },
      { name: "Балкон", price: 1500 },
      { name: "Галёрка", price: 800 },
    ],
    city: "Минск",
    category: "Концерты",
    description: "Вечер классической музыки в атмосферном зале.",
    poster: "",
  }, true);
  // approve
  approveApplication(state, app.appId);
  const evt = state.events[state.events.length - 1];
  // publish
  publishEvent(state, evt.eventId);
  // issue
  issueMarks(state, evt.eventId);
  // b2c buy
  const sellResult = sell(state, evt.eventId, "Партер", "ByCard", "demo_user_1");
  // redeem 1
  if (sellResult.ok && sellResult.ticketId) {
    redeem(state, sellResult.ticketId, "ByCard");
  }
  saveState(state);
  return state;
}
