// TicketHub MVP State Management — localStorage based

export type Role = "organizer" | "regulator" | "tickethub" | "channel" | "b2c";
export type Channel = "ByCard" | "TicketPro" | "SellerPOS";
export type AppStatus = "draft" | "submitted" | "approved" | "rejected";
export type ReviewStatus = "draft" | "submitted" | "in_review" | "approved" | "rejected" | "needs_rework";
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
  organizerId: string;
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
  organizerId: string;
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

export interface OrganizerAccount {
  organizerId: string;
  login: string;
  password: string;
  name: string;
  fullName: string;
  unp: string;
  registryStatus: "зарегистрирован в реестре" | "ожидает включения";
  registryRegisteredAt: string | null;
  director: string;
  email: string;
  phone: string;
  accountStatus: "активен" | "pending";
  feesStatus: "оплачены";
}

export interface MockAttachment {
  attachmentId: string;
  name: string;
  kind: string;
  uploadedAt: string;
  isSample?: boolean;
}

export interface IdentityRecord {
  fullName: string;
  docType: string;
  docNumber: string;
  issueDate: string;
  issueAuthority: string;
}

export interface OrganizerApplicationData {
  legalName: string;
  registrationNumber: string;
  postalCode: string;
  region: string;
  locality: string;
  street: string;
  houseNumber: string;
  roomTypeAndNumber: string;
  addressExtra: string;
  contactPhone: string;
  website: string;
  email: string;
  ownershipType: "private" | "state" | "mixed";
  director: IdentityRecord;
  workers: IdentityRecord[];
  founders: IdentityRecord[];
  activities: string[];
  activityOther: string;
  pastEventsDescription: string;
  pastMaterials: MockAttachment[];
  documents: MockAttachment[];
  confirmations: { isAccurate: boolean; adminReviewConsent: boolean };
  accountCredentials: { login: string; password: string };
}

export interface OrganizerApplicationRecord {
  organizerApplicationId: string;
  organizerId: string;
  status: ReviewStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  adminComment: string;
  data: OrganizerApplicationData;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerRegistryRecord {
  organizerRegistryId: string;
  organizerId: string;
  internalNumber: string;
  includedAt: string;
}

export interface EventPerformer {
  name: string;
  performerType: "solo" | "group";
  country: string;
  representative: string;
  comment: string;
}

export interface EventComplianceData {
  title: string;
  eventType: string;
  shortDescription: string;
  program: string;
  dateSlots: string[];
  venueName: string;
  venueAddress: string;
  performers: EventPerformer[];
  onlyBelarusianPerformers: boolean;
  hasForeignPerformers: boolean;
  venueType: string;
  projectedCapacity: number | null;
  plannedTicketsForSale: number | null;
  ageCategory: "0+" | "6+" | "12+" | "16+" | "18+";
  ageComment: string;
  approvalMode: "certificate_required" | "notice_only" | "certificate_not_required";
  approvalBasis: string;
  eventDocuments: MockAttachment[];
  salesStartDate: string;
  feeExempt: boolean;
  feeExemptReason: string;
  feePaid: boolean;
  paymentAttachments: MockAttachment[];
  paymentComment: string;
  adRestrictionConfirmed: boolean;
  cancelled: boolean;
  changesDeclared: boolean;
  executiveCommitteeNotified: boolean;
  citizensNotified: boolean;
  notificationsAttachment: MockAttachment[];
  cancellationComment: string;
}

export interface EventComplianceApplicationRecord {
  eventComplianceApplicationId: string;
  organizerId: string;
  status: ReviewStatus;
  submittedAt: string | null;
  reviewedAt: string | null;
  adminComment: string;
  feePaymentConfirmedByAdmin: boolean;
  certificateNumber: string;
  certificateDate: string;
  linkedLegacyAppId: string | null;
  linkedEventId: string | null;
  data: EventComplianceData;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizerDocument {
  documentId: string;
  organizerId: string;
  title: string;
  type: string;
  updatedAt: string;
  status: "доступен";
}

export interface AppState {
  meta: { version: string; updatedAt: string };
  counters: { app: number; lic: number; evt: number; tck: number; op: number };
  applications: Application[];
  organizerApplications: OrganizerApplicationRecord[];
  eventComplianceApplications: EventComplianceApplicationRecord[];
  organizerRegistry: OrganizerRegistryRecord[];
  events: EventRecord[];
  tickets: Ticket[];
  demoPurchases: DemoPurchaseTicket[];
  ops: OpRecord[];
  users: DemoUser[];
  organizers: OrganizerAccount[];
  organizerDocuments: OrganizerDocument[];
  currentOrganizerId: string | null;
  ui: { selectedRole: Role; selectedChannel: Channel };
}

const STORAGE_KEY = "ticket_hub_state_v1";
const LEGACY_DEFAULT_ORGANIZER_ID = "org_demo_1";
let suppressPersistence = false;

function organizerSeedList(): OrganizerAccount[] {
  return [
    {
      organizerId: "org_demo_1",
      login: "organizer.a",
      password: "demo123",
      name: "ООО «Альфа Сцена»",
      fullName: "Общество с ограниченной ответственностью «Альфа Сцена»",
      unp: "192837465",
      registryStatus: "зарегистрирован в реестре",
      registryRegisteredAt: "2024-02-12",
      director: "Иванов Иван Петрович",
      email: "alpha@demo.by",
      phone: "+375 (29) 111-11-11",
      accountStatus: "активен",
      feesStatus: "оплачены",
    },
    {
      organizerId: "org_demo_2",
      login: "organizer.b",
      password: "demo123",
      name: "ЧУП «Бета Ивент»",
      fullName: "Частное унитарное предприятие «Бета Ивент»",
      unp: "102938475",
      registryStatus: "зарегистрирован в реестре",
      registryRegisteredAt: "2024-06-03",
      director: "Петрова Мария Сергеевна",
      email: "beta@demo.by",
      phone: "+375 (33) 222-22-22",
      accountStatus: "активен",
      feesStatus: "оплачены",
    },
  ];
}

const ORGANIZER_DOCUMENT_TEMPLATES: Omit<OrganizerDocument, "organizerId" | "updatedAt">[] = [
  { documentId: "DOC-001", title: "Выписка из реестра организаторов", type: "реестр", status: "доступен" },
  { documentId: "DOC-002", title: "Устав организации", type: "устав", status: "доступен" },
  { documentId: "DOC-003", title: "Договор с платформой TicketHub", type: "договор", status: "доступен" },
  { documentId: "DOC-004", title: "Регистрационные данные", type: "регистрация", status: "доступен" },
  { documentId: "DOC-005", title: "Реквизиты", type: "реквизиты", status: "доступен" },
];

function pad(n: number, len: number): string {
  return String(n).padStart(len, "0");
}

export function genId(prefix: string, counter: number): string {
  const len = prefix === "OP" || prefix === "TCK" ? 6 : 4;
  return `${prefix}-${pad(counter, len)}`;
}

export function defaultState(): AppState {
  const state: AppState = {
    meta: { version: "v3", updatedAt: new Date().toISOString() },
    counters: { app: 1, lic: 1, evt: 1, tck: 1, op: 1 },
    applications: [],
    organizerApplications: [],
    eventComplianceApplications: [],
    organizerRegistry: [],
    events: [],
    tickets: [],
    demoPurchases: [],
    ops: [],
    users: [{ userId: "demo_user_1", name: "Демо пользователь" }],
    organizers: organizerSeedList(),
    organizerDocuments: [],
    currentOrganizerId: null,
    ui: { selectedRole: "organizer", selectedChannel: "ByCard" },
  };
  ensureOrganizerDocuments(state);
  seedOrganizerDemoData(state);
  return state;
}

function ensureOrganizerDocuments(state: AppState): void {
  if (!Array.isArray(state.organizerDocuments)) state.organizerDocuments = [];
  const now = new Date().toISOString();
  for (const organizer of state.organizers) {
    for (const tpl of ORGANIZER_DOCUMENT_TEMPLATES) {
      const docId = `${organizer.organizerId}-${tpl.documentId}`;
      if (!state.organizerDocuments.some((d) => d.documentId === docId)) {
        state.organizerDocuments.push({
          ...tpl,
          documentId: docId,
          organizerId: organizer.organizerId,
          updatedAt: now,
        });
      }
    }
  }
}

function seedOrganizerDemoData(state: AppState): void {
  const hasOrg1Data = state.applications.some((a) => a.organizerId === "org_demo_1");
  const hasOrg2Data = state.applications.some((a) => a.organizerId === "org_demo_2");
  if (hasOrg1Data && hasOrg2Data) return;

  if (!hasOrg1Data) {
    createApplication(state, {
      title: "Концерт «Классика под звёздами»",
      venue: "Большой зал филармонии",
      dateTime: "2026-05-15T19:00",
      capacity: 1200,
      tiers: [{ name: "Партер", price: 120 }, { name: "Балкон", price: 80 }],
      city: "Минск",
      category: "Концерты",
      description: "Вечер классической музыки в атмосферном зале.",
      poster: "",
    }, true, "org_demo_1");

    createApplication(state, {
      title: "Фестиваль «Городской ритм»",
      venue: "Парк Победы",
      dateTime: "2026-07-02T18:00",
      capacity: 5000,
      tiers: [{ name: "Стандарт", price: 45 }, { name: "Фан-зона", price: 90 }],
      city: "Минск",
      category: "Фестивали",
      description: "Открытый музыкальный фестиваль на набережной.",
      poster: "",
    }, false, "org_demo_1");

    const submittedForReject = createApplication(state, {
      title: "Шоу «Свет и звук»",
      venue: "Культурный центр «Сфера»",
      dateTime: "2026-06-11T20:00",
      capacity: 700,
      tiers: [{ name: "Стандарт", price: 60 }, { name: "VIP", price: 110 }],
      city: "Брест",
      category: "Шоу",
      description: "Иммерсивное мультимедийное шоу.",
      poster: "",
    }, true, "org_demo_1");
    rejectApplication(state, submittedForReject.appId);

    const submittedForApprove = state.applications.find((a) => a.organizerId === "org_demo_1" && a.status === "submitted");
    if (submittedForApprove) {
      approveApplication(state, submittedForApprove.appId);
      const event = state.events.find((e) => e.appId === submittedForApprove.appId);
      if (event) {
        publishEvent(state, event.eventId);
        createDemoPurchaseTicket(state, {
          eventId: event.eventId,
          selectedPriceCategory: event.tiers[0]?.name || "Партер",
          quantity: 2,
          buyerName: "Покупатель A",
        });
      }
    }
  }

  if (!hasOrg2Data) {
    const approvedCandidate = createApplication(state, {
      title: "Спектакль «Вечер в театре»",
      venue: "Театр драмы",
      dateTime: "2026-06-21T18:30",
      capacity: 450,
      tiers: [{ name: "Партер", price: 55 }, { name: "Амфитеатр", price: 35 }],
      city: "Гродно",
      category: "Театр",
      description: "Классическая постановка в двух актах.",
      poster: "",
    }, true, "org_demo_2");
    approveApplication(state, approvedCandidate.appId);

    createApplication(state, {
      title: "Детское шоу «Планета игр»",
      venue: "Дом культуры",
      dateTime: "2026-08-10T12:00",
      capacity: 600,
      tiers: [{ name: "Семейный", price: 30 }, { name: "Премиум", price: 50 }],
      city: "Витебск",
      category: "Детям",
      description: "Интерактивное шоу для всей семьи.",
      poster: "",
    }, false, "org_demo_2");
  }
}

function migrateState(parsed: Partial<AppState>): AppState {
  suppressPersistence = true;
  try {
    const state: AppState = {
      ...defaultState(),
      ...parsed,
      applications: Array.isArray(parsed.applications) ? parsed.applications : [],
      organizerApplications: Array.isArray(parsed.organizerApplications) ? parsed.organizerApplications : [],
      eventComplianceApplications: Array.isArray(parsed.eventComplianceApplications) ? parsed.eventComplianceApplications : [],
      organizerRegistry: Array.isArray(parsed.organizerRegistry) ? parsed.organizerRegistry : [],
      events: Array.isArray(parsed.events) ? parsed.events : [],
      tickets: Array.isArray(parsed.tickets) ? parsed.tickets : [],
      demoPurchases: Array.isArray(parsed.demoPurchases) ? parsed.demoPurchases : [],
      ops: Array.isArray(parsed.ops) ? parsed.ops : [],
      users: Array.isArray(parsed.users) ? parsed.users : [{ userId: "demo_user_1", name: "Демо пользователь" }],
      organizers: Array.isArray(parsed.organizers) && parsed.organizers.length > 0 ? parsed.organizers : organizerSeedList(),
      organizerDocuments: Array.isArray(parsed.organizerDocuments) ? parsed.organizerDocuments : [],
      currentOrganizerId: typeof parsed.currentOrganizerId === "string" ? parsed.currentOrganizerId : null,
    };

    const knownOrganizerIds = new Set(state.organizers.map((o) => o.organizerId));
    for (const organizer of state.organizers) {
      if (!organizer.accountStatus) organizer.accountStatus = "активен";
      if (!organizer.registryStatus) organizer.registryStatus = "зарегистрирован в реестре";
      if (organizer.registryRegisteredAt === undefined) organizer.registryRegisteredAt = null;
    }
    for (const app of state.applications) {
      if (!app.organizerId || !knownOrganizerIds.has(app.organizerId)) {
        app.organizerId = LEGACY_DEFAULT_ORGANIZER_ID;
      }
    }
    for (const event of state.events) {
      if (!event.organizerId || !knownOrganizerIds.has(event.organizerId)) {
        const fromApp = state.applications.find((a) => a.appId === event.appId)?.organizerId;
        event.organizerId = fromApp && knownOrganizerIds.has(fromApp) ? fromApp : LEGACY_DEFAULT_ORGANIZER_ID;
      }
    }
    if (state.currentOrganizerId && !knownOrganizerIds.has(state.currentOrganizerId)) {
      state.currentOrganizerId = null;
    }
    ensureOrganizerDocuments(state);
    seedOrganizerDemoData(state);
    state.meta.version = "v3";
    return state;
  } finally {
    suppressPersistence = false;
  }
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AppState>;
      return migrateState(parsed);
    }
  } catch {}
  return migrateState(defaultState());
}

export function saveState(state: AppState): void {
  if (suppressPersistence) return;
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

function nowIso(): string {
  return new Date().toISOString();
}

function quickId(prefix: string): string {
  return `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
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

export function defaultIdentityRecord(): IdentityRecord {
  return { fullName: "", docType: "", docNumber: "", issueDate: "", issueAuthority: "" };
}

export function defaultOrganizerApplicationData(): OrganizerApplicationData {
  return {
    legalName: "",
    registrationNumber: "",
    postalCode: "",
    region: "",
    locality: "",
    street: "",
    houseNumber: "",
    roomTypeAndNumber: "",
    addressExtra: "",
    contactPhone: "",
    website: "",
    email: "",
    ownershipType: "private",
    director: defaultIdentityRecord(),
    workers: [],
    founders: [],
    activities: [],
    activityOther: "",
    pastEventsDescription: "",
    pastMaterials: [],
    documents: [],
    confirmations: { isAccurate: false, adminReviewConsent: false },
    accountCredentials: { login: "", password: "" },
  };
}

export function defaultEventComplianceData(): EventComplianceData {
  return {
    title: "",
    eventType: "",
    shortDescription: "",
    program: "",
    dateSlots: [""],
    venueName: "",
    venueAddress: "",
    performers: [],
    onlyBelarusianPerformers: false,
    hasForeignPerformers: false,
    venueType: "",
    projectedCapacity: null,
    plannedTicketsForSale: null,
    ageCategory: "0+",
    ageComment: "",
    approvalMode: "certificate_required",
    approvalBasis: "",
    eventDocuments: [],
    salesStartDate: "",
    feeExempt: false,
    feeExemptReason: "",
    feePaid: false,
    paymentAttachments: [],
    paymentComment: "",
    adRestrictionConfirmed: false,
    cancelled: false,
    changesDeclared: false,
    executiveCommitteeNotified: false,
    citizensNotified: false,
    notificationsAttachment: [],
    cancellationComment: "",
  };
}

export function calculateComplianceFee(capacity: number | null, plannedTicketsForSale: number | null): number {
  const basis = capacity && capacity > 0 ? capacity : (plannedTicketsForSale && plannedTicketsForSale > 0 ? plannedTicketsForSale : 0);
  if (basis <= 0) return 3;
  if (basis <= 150) return 3;
  if (basis <= 300) return 10;
  if (basis <= 500) return 30;
  if (basis <= 1000) return 50;
  if (basis <= 1500) return 80;
  if (basis <= 2000) return 100;
  if (basis <= 3000) return 150;
  return 200;
}

export function upsertOrganizerApplication(
  state: AppState,
  organizerId: string,
  data: OrganizerApplicationData,
  submit: boolean
): OrganizerApplicationRecord {
  const existing = state.organizerApplications.find((x) => x.organizerId === organizerId);
  const status: ReviewStatus = submit ? "submitted" : "draft";
  if (existing) {
    existing.data = data;
    existing.status = status;
    existing.submittedAt = submit ? nowIso() : existing.submittedAt;
    existing.updatedAt = nowIso();
    existing.adminComment = "";
    saveState(state);
    return existing;
  }
  const rec: OrganizerApplicationRecord = {
    organizerApplicationId: quickId("ORGAPP"),
    organizerId,
    status,
    submittedAt: submit ? nowIso() : null,
    reviewedAt: null,
    adminComment: "",
    data,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.organizerApplications.push(rec);
  saveState(state);
  return rec;
}

export function getOrganizerApplicationByOrganizerId(state: AppState, organizerId: string): OrganizerApplicationRecord | null {
  return state.organizerApplications.find((x) => x.organizerId === organizerId) || null;
}

export function createPendingOrganizerAccount(
  state: AppState,
  profile: { legalName: string; registrationNumber: string; directorName: string; email: string; phone: string; login: string; password: string }
): OrganizerAccount {
  const existing = state.organizers.find((x) => x.login.toLowerCase() === profile.login.toLowerCase());
  if (existing) return existing;
  const organizer: OrganizerAccount = {
    organizerId: quickId("ORG"),
    login: profile.login.trim(),
    password: profile.password,
    name: profile.legalName,
    fullName: profile.legalName,
    unp: profile.registrationNumber,
    registryStatus: "ожидает включения",
    registryRegisteredAt: null,
    director: profile.directorName,
    email: profile.email,
    phone: profile.phone,
    accountStatus: "pending",
    feesStatus: "оплачены",
  };
  state.organizers.push(organizer);
  saveState(state);
  return organizer;
}

export function setOrganizerApplicationReview(
  state: AppState,
  organizerApplicationId: string,
  decision: "approved" | "rejected" | "needs_rework",
  comment = ""
): boolean {
  const app = state.organizerApplications.find((x) => x.organizerApplicationId === organizerApplicationId);
  if (!app) return false;
  if (decision === "rejected" && !comment.trim()) return false;
  app.status = decision;
  app.adminComment = comment.trim();
  app.reviewedAt = nowIso();
  app.updatedAt = nowIso();
  const organizer = state.organizers.find((o) => o.organizerId === app.organizerId);
  if (organizer && decision === "approved") {
    organizer.accountStatus = "активен";
    organizer.registryStatus = "зарегистрирован в реестре";
    organizer.registryRegisteredAt = nowIso().slice(0, 10);
    const hasRegistry = state.organizerRegistry.some((r) => r.organizerId === organizer.organizerId);
    if (!hasRegistry) {
      state.organizerRegistry.push({
        organizerRegistryId: quickId("ORGREG"),
        organizerId: organizer.organizerId,
        internalNumber: `REG-${state.organizerRegistry.length + 1}`,
        includedAt: nowIso().slice(0, 10),
      });
    }
  }
  saveState(state);
  return true;
}

export function createEventComplianceApplication(
  state: AppState,
  organizerId: string,
  data: EventComplianceData,
  submit: boolean
): EventComplianceApplicationRecord {
  const rec: EventComplianceApplicationRecord = {
    eventComplianceApplicationId: quickId("EVAPP"),
    organizerId,
    status: submit ? "submitted" : "draft",
    submittedAt: submit ? nowIso() : null,
    reviewedAt: null,
    adminComment: "",
    feePaymentConfirmedByAdmin: false,
    certificateNumber: "",
    certificateDate: "",
    linkedLegacyAppId: null,
    linkedEventId: null,
    data,
    createdAt: nowIso(),
    updatedAt: nowIso(),
  };
  state.eventComplianceApplications.push(rec);
  saveState(state);
  return rec;
}

export function updateEventComplianceApplication(
  state: AppState,
  eventComplianceApplicationId: string,
  data: EventComplianceData,
  submit: boolean
): boolean {
  const app = state.eventComplianceApplications.find((x) => x.eventComplianceApplicationId === eventComplianceApplicationId);
  if (!app) return false;
  app.data = data;
  app.status = submit ? "submitted" : "draft";
  app.submittedAt = submit ? nowIso() : app.submittedAt;
  app.updatedAt = nowIso();
  if (submit) app.adminComment = "";
  saveState(state);
  return true;
}

export function setEventComplianceReview(
  state: AppState,
  eventComplianceApplicationId: string,
  payload: {
    decision: "approved" | "rejected" | "needs_rework";
    comment?: string;
    confirmFeePayment?: boolean;
    certificateNumber?: string;
    certificateDate?: string;
  }
): boolean {
  const app = state.eventComplianceApplications.find((x) => x.eventComplianceApplicationId === eventComplianceApplicationId);
  if (!app) return false;
  const comment = payload.comment?.trim() || "";
  if (payload.decision === "rejected" && !comment) return false;

  app.status = payload.decision;
  app.adminComment = comment;
  app.reviewedAt = nowIso();
  app.updatedAt = nowIso();
  app.feePaymentConfirmedByAdmin = Boolean(payload.confirmFeePayment);
  app.certificateNumber = payload.certificateNumber?.trim() || "";
  app.certificateDate = payload.certificateDate?.trim() || "";

  if (payload.decision === "approved") {
    const baseDate = app.data.dateSlots.find(Boolean) || "";
    const legacy = createApplication(
      state,
      {
        title: app.data.title,
        venue: app.data.venueName || "Площадка не указана",
        dateTime: baseDate,
        capacity: app.data.projectedCapacity || app.data.plannedTicketsForSale || 1,
        tiers: [{ name: "Стандарт", price: 50 }],
        city: "",
        category: app.data.eventType || "Иное",
        description: app.data.shortDescription,
        poster: "",
      },
      true,
      app.organizerId
    );
    const approved = approveApplication(state, legacy.appId);
    app.linkedLegacyAppId = legacy.appId;
    app.linkedEventId = approved?.eventId || null;
  }
  saveState(state);
  return true;
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
  submit: boolean,
  organizerId?: string
): Application {
  const effectiveOrganizerId = organizerId || state.currentOrganizerId || LEGACY_DEFAULT_ORGANIZER_ID;
  const app: Application = {
    appId: nextId(state, "app", "APP"),
    organizerId: effectiveOrganizerId,
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
    organizerId: app.organizerId,
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

// ===== Organizer auth + selectors =====

export function loginOrganizer(state: AppState, login: string, password: string): OrganizerAccount | null {
  const normalized = login.trim().toLowerCase();
  const organizer = state.organizers.find(
    (o) => o.login.toLowerCase() === normalized && o.password === password
  );
  if (!organizer) return null;
  state.currentOrganizerId = organizer.organizerId;
  saveState(state);
  return organizer;
}

export function logoutOrganizer(state: AppState): void {
  state.currentOrganizerId = null;
  saveState(state);
}

export function getCurrentOrganizer(state: AppState): OrganizerAccount | null {
  if (!state.currentOrganizerId) return null;
  return state.organizers.find((o) => o.organizerId === state.currentOrganizerId) || null;
}

export function getOrganizerRegistryRecord(state: AppState, organizerId: string): OrganizerRegistryRecord | null {
  return state.organizerRegistry.find((r) => r.organizerId === organizerId) || null;
}

export function isOrganizerApproved(state: AppState, organizerId: string): boolean {
  return Boolean(getOrganizerRegistryRecord(state, organizerId));
}

export function getMyApplications(state: AppState): Application[] {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return [];
  return state.applications.filter((a) => a.organizerId === organizer.organizerId);
}

export function getMyEvents(state: AppState): EventRecord[] {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return [];
  return state.events.filter((e) => e.organizerId === organizer.organizerId);
}

export interface OrganizerSaleRecord {
  saleId: string;
  eventId: string;
  organizerId: string;
  eventTitle: string;
  soldAt: string;
  quantity: number;
  unitPrice: number;
  amount: number;
  channel: "B2C";
  status: "подтверждена";
  priceCategory: string;
}

export function getMySales(state: AppState): OrganizerSaleRecord[] {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return [];
  return state.demoPurchases
    .map((purchase) => {
      const event = state.events.find((e) => e.eventId === purchase.eventId);
      if (!event || event.organizerId !== organizer.organizerId) return null;
      const tierPrice = event.tiers.find((tier) => tier.name === purchase.selectedPriceCategory)?.price ?? 0;
      return {
        saleId: purchase.ticketId,
        eventId: event.eventId,
        organizerId: organizer.organizerId,
        eventTitle: purchase.eventTitle || event.title,
        soldAt: purchase.purchasedAt,
        quantity: purchase.quantity,
        unitPrice: tierPrice,
        amount: tierPrice * purchase.quantity,
        channel: "B2C",
        status: "подтверждена" as const,
        priceCategory: purchase.selectedPriceCategory,
      };
    })
    .filter((row): row is OrganizerSaleRecord => row !== null)
    .sort((a, b) => b.soldAt.localeCompare(a.soldAt));
}

export function getMyOrganizerDocuments(state: AppState): OrganizerDocument[] {
  const organizer = getCurrentOrganizer(state);
  if (!organizer) return [];
  return state.organizerDocuments.filter((d) => d.organizerId === organizer.organizerId);
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
