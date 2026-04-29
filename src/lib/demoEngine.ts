import type {
  AppState,
  EventComplianceApplicationRecord,
  OrganizerAccount,
  OrganizerApplicationData,
  OrganizerApplicationRecord,
  PriceTier,
} from "@/lib/store";
import {
  approveApplication,
  createApplication,
  createDemoPurchaseTicket,
  loadState,
  defaultState,
  issueMarks,
  publishEvent,
  resetState,
  saveState,
} from "@/lib/store";

const DEMO_ORGANIZERS: OrganizerAccount[] = [
  {
    organizerId: "demo_org_1",
    login: "organizer.a",
    password: "demo123",
    name: "ООО «Северный Свет Ивент»",
    fullName: "Общество с ограниченной ответственностью «Северный Свет Ивент»",
    unp: "190001111",
    registryStatus: "зарегистрирован в реестре",
    registryRegisteredAt: "2025-02-12",
    director: "Иванов Илья Петрович",
    email: "northlight@demo.by",
    phone: "+375 (29) 100-10-10",
    accountStatus: "активен",
    feesStatus: "оплачены",
  },
  {
    organizerId: "demo_org_2",
    login: "organizer.b",
    password: "demo123",
    name: "ЧУП «Городская Афиша»",
    fullName: "Частное унитарное предприятие «Городская Афиша»",
    unp: "190002222",
    registryStatus: "зарегистрирован в реестре",
    registryRegisteredAt: "2025-03-20",
    director: "Петрова Марина Сергеевна",
    email: "cityafisha@demo.by",
    phone: "+375 (33) 200-20-20",
    accountStatus: "активен",
    feesStatus: "оплачены",
  },
];

type DemoAppSeed = {
  organizerId: string;
  title: string;
  venue: string;
  city: string;
  category: string;
  description: string;
  daysOffset: number;
  time: string;
  poster: string;
  tiers: PriceTier[];
};

const DEMO_APPS: DemoAppSeed[] = [
  {
    organizerId: "demo_org_1",
    title: "Концерт «Огни Невы»",
    venue: "Космос Арена",
    city: "Минск",
    category: "Концерты",
    description: "Большой вечер симфо-попа с живым оркестром и визуальным шоу.",
    daysOffset: 7,
    time: "19:00",
    poster: "/demo/poster-1.svg",
    tiers: [{ name: "Партер", price: 95, quantity: 45 }, { name: "Балкон", price: 70, quantity: 35 }, { name: "Галерея", price: 45, quantity: 20 }],
  },
  {
    organizerId: "demo_org_1",
    title: "Шоу «Эхо города»",
    venue: "Космос Арена",
    city: "Минск",
    category: "Шоу",
    description: "Иммерсивное мультимедийное представление о ритме большого города.",
    daysOffset: 14,
    time: "20:00",
    poster: "/demo/poster-2.svg",
    tiers: [{ name: "Стандарт", price: 80, quantity: 50 }, { name: "Комфорт", price: 110, quantity: 30 }, { name: "VIP", price: 150, quantity: 20 }],
  },
  {
    organizerId: "demo_org_1",
    title: "Фестиваль «Летний импульс»",
    venue: "Парк Победы",
    city: "Минск",
    category: "Фестивали",
    description: "Дневной open-air фестиваль с несколькими сценами и маркетом.",
    daysOffset: 21,
    time: "16:00",
    poster: "/demo/poster-3.svg",
    tiers: [{ name: "Стандарт", price: 50, quantity: 60 }, { name: "Фан-зона", price: 75, quantity: 25 }, { name: "Премиум", price: 110, quantity: 15 }],
  },
  {
    organizerId: "demo_org_2",
    title: "Спектакль «Ночной проспект»",
    venue: "Театр драмы",
    city: "Гродно",
    category: "Театр",
    description: "Современная городская драма в двух актах.",
    daysOffset: 10,
    time: "18:30",
    poster: "/demo/poster-4.svg",
    tiers: [{ name: "Партер", price: 65, quantity: 40 }, { name: "Амфитеатр", price: 50, quantity: 35 }, { name: "Балкон", price: 35, quantity: 25 }],
  },
  {
    organizerId: "demo_org_2",
    title: "Семейное шоу «Планета игр»",
    venue: "Парк Победы",
    city: "Витебск",
    category: "Детям",
    description: "Интерактивное семейное шоу с аниматорами и музыкальными паузами.",
    daysOffset: 17,
    time: "12:00",
    poster: "/demo/poster-5.svg",
    tiers: [{ name: "Семейный", price: 40, quantity: 55 }, { name: "Комфорт", price: 60, quantity: 30 }, { name: "Премиум", price: 85, quantity: 15 }],
  },
  {
    organizerId: "demo_org_2",
    title: "Концерт «Город и джаз»",
    venue: "Театр драмы",
    city: "Гродно",
    category: "Концерты",
    description: "Камерный джазовый вечер с авторскими аранжировками.",
    daysOffset: 28,
    time: "19:30",
    poster: "/demo/poster-6.svg",
    tiers: [{ name: "Стандарт", price: 55, quantity: 50 }, { name: "Партер", price: 78, quantity: 35 }, { name: "VIP", price: 120, quantity: 15 }],
  },
];

function toDateTime(daysOffset: number, time: string): string {
  const base = new Date();
  base.setHours(0, 0, 0, 0);
  base.setDate(base.getDate() + daysOffset);
  const [h, m] = time.split(":").map(Number);
  base.setHours(h || 0, m || 0, 0, 0);
  const year = base.getFullYear();
  const month = String(base.getMonth() + 1).padStart(2, "0");
  const day = String(base.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}T${time}`;
}

function buildBaselineState(): AppState {
  return loadState();
}

function todayYmd(): string {
  return new Date().toISOString().slice(0, 10);
}

function seedDemoCatalog(state: AppState): AppState {
  state.organizers = DEMO_ORGANIZERS.map((organizer) => ({ ...organizer }));
  state.organizerRegistry = DEMO_ORGANIZERS.map((organizer, index) => ({
    organizerRegistryId: `DEMO-ORGREG-${index + 1}`,
    organizerId: organizer.organizerId,
    internalNumber: index === 0 ? "DEMO-REG-001" : "DEMO-REG-002",
    includedAt: organizer.registryRegisteredAt || todayYmd(),
  }));
  state.organizerDocuments = [];
  state.currentOrganizerId = null;

  for (const seed of DEMO_APPS) {
    const app = createApplication(
      state,
      {
        title: seed.title,
        venue: seed.venue,
        dateTime: toDateTime(seed.daysOffset, seed.time),
        capacity: seed.tiers.reduce((acc, tier) => acc + tier.quantity, 0),
        tiers: seed.tiers,
        city: seed.city,
        category: seed.category,
        description: seed.description,
        poster: seed.poster,
      },
      true,
      seed.organizerId,
    );
    const approved = approveApplication(state, app.appId);
    if (!approved) continue;
    publishEvent(state, approved.eventId);
    issueMarks(state, approved.eventId);
  }

  state.demoPurchases = [];
  state.ops = [];
  saveState(state);
  return state;
}

export function resetDemoData(): AppState {
  resetState();
  const baseline = buildBaselineState();
  saveState(baseline);
  return baseline;
}

export function generateDemoData(): AppState {
  const state = buildBaselineState();
  enrichDemoData(state);
  saveState(state);
  return state;
}

function enrichDemoData(state: AppState): void {
  ensureDemoOrganizers(state);
  ensureOrganizerRegistry(state);
  ensureSeedPublishedEvents(state);
  ensureOrganizerApplications(state);
  ensureEventComplianceApplications(state);
  ensureCertificatesForPublishedEvents(state);
  ensureTicketsForPublishedEvents(state);
}

function ensureDemoOrganizers(state: AppState): void {
  for (const demo of DEMO_ORGANIZERS) {
    const existing = state.organizers.find((o) => o.organizerId === demo.organizerId || o.login === demo.login);
    if (!existing) {
      state.organizers.push({ ...demo });
      continue;
    }
    existing.name ||= demo.name;
    existing.fullName ||= demo.fullName;
    existing.unp ||= demo.unp;
    existing.registryStatus ||= demo.registryStatus;
    existing.registryRegisteredAt ||= demo.registryRegisteredAt;
    existing.director ||= demo.director;
    existing.email ||= demo.email;
    existing.phone ||= demo.phone;
    existing.accountStatus ||= demo.accountStatus;
    existing.feesStatus ||= demo.feesStatus;
  }
}

function ensureOrganizerRegistry(state: AppState): void {
  for (const [index, organizer] of DEMO_ORGANIZERS.entries()) {
    const existing = state.organizerRegistry.find((r) => r.organizerId === organizer.organizerId);
    if (existing) {
      existing.internalNumber ||= index === 0 ? "DEMO-REG-001" : "DEMO-REG-002";
      existing.includedAt ||= organizer.registryRegisteredAt || todayYmd();
      continue;
    }
    state.organizerRegistry.push({
      organizerRegistryId: `DEMO-ORGREG-${index + 1}`,
      organizerId: organizer.organizerId,
      internalNumber: index === 0 ? "DEMO-REG-001" : "DEMO-REG-002",
      includedAt: organizer.registryRegisteredAt || todayYmd(),
    });
  }
}

function ensureSeedPublishedEvents(state: AppState): void {
  for (const seed of DEMO_APPS) {
    const existingEvent = state.events.find((event) => event.organizerId === seed.organizerId && event.title === seed.title);
    if (existingEvent) continue;
    const app = createApplication(
      state,
      {
        title: seed.title,
        venue: seed.venue,
        dateTime: toDateTime(seed.daysOffset, seed.time),
        capacity: seed.tiers.reduce((acc, tier) => acc + tier.quantity, 0),
        tiers: seed.tiers,
        city: seed.city,
        category: seed.category,
        description: seed.description,
        poster: seed.poster,
      },
      true,
      seed.organizerId,
    );
    const approved = approveApplication(state, app.appId);
    if (!approved) continue;
    publishEvent(state, approved.eventId);
    issueMarks(state, approved.eventId);
  }
}

function ensureOrganizerApplications(state: AppState): void {
  const seeds: Array<{ id: string; organizerId: string; submittedAt: string; data: OrganizerApplicationData }> = [
    {
      id: "organizerApplication001",
      organizerId: "pending_org_application_001",
      submittedAt: "2026-04-21T09:00:00",
      data: {
        legalName: "ООО «Городская сцена»",
        registrationNumber: "193847261",
        postalCode: "220030",
        region: "г. Минск",
        locality: "Минск",
        street: "ул. Интернациональная",
        houseNumber: "14",
        roomTypeAndNumber: "",
        addressExtra: "",
        contactPhone: "+375 29 111-22-33",
        website: "",
        email: "info@gorod-stage.by",
        ownershipType: "private",
        director: { fullName: "Анна Ковальчук", docType: "", docNumber: "", issueDate: "", issueAuthority: "" },
        workers: [],
        founders: [],
        activities: ["Концерты"],
        activityOther: "",
        pastEventsDescription: "",
        pastMaterials: [],
        documents: [],
        confirmations: { isAccurate: true, adminReviewConsent: true },
        accountCredentials: { login: "", password: "" },
      },
    },
    {
      id: "organizerApplication002",
      organizerId: "pending_org_application_002",
      submittedAt: "2026-04-22T09:00:00",
      data: {
        legalName: "ООО «Северный звук»",
        registrationNumber: "193847262",
        postalCode: "210015",
        region: "г. Витебск",
        locality: "Витебск",
        street: "пр-т Фрунзе",
        houseNumber: "22",
        roomTypeAndNumber: "",
        addressExtra: "",
        contactPhone: "+375 29 444-55-66",
        website: "",
        email: "office@nord-sound.by",
        ownershipType: "private",
        director: { fullName: "Павел Лисовский", docType: "", docNumber: "", issueDate: "", issueAuthority: "" },
        workers: [],
        founders: [],
        activities: ["Концерты"],
        activityOther: "",
        pastEventsDescription: "",
        pastMaterials: [],
        documents: [],
        confirmations: { isAccurate: true, adminReviewConsent: true },
        accountCredentials: { login: "", password: "" },
      },
    },
  ];

  for (const seed of seeds) {
    const existing = findOrganizerApplication(state, seed.id, seed.data.registrationNumber);
    if (!existing) {
      const now = new Date().toISOString();
      state.organizerApplications.push({
        organizerApplicationId: seed.id,
        organizerId: seed.organizerId,
        status: "submitted",
        submittedAt: seed.submittedAt,
        reviewedAt: null,
        adminComment: "",
        data: seed.data,
        createdAt: seed.submittedAt,
        updatedAt: now,
      });
      continue;
    }
    mergeOrganizerApplication(existing, seed);
  }
}

function findOrganizerApplication(state: AppState, appId: string, registrationNumber: string): OrganizerApplicationRecord | undefined {
  return state.organizerApplications.find((row) => row.organizerApplicationId === appId || row.data.registrationNumber === registrationNumber);
}

function mergeOrganizerApplication(target: OrganizerApplicationRecord, seed: { organizerId: string; submittedAt: string; data: OrganizerApplicationData }): void {
  target.organizerId ||= seed.organizerId;
  target.submittedAt ||= seed.submittedAt;
  target.status = target.status === "draft" ? "submitted" : target.status;
  target.data.legalName ||= seed.data.legalName;
  target.data.registrationNumber ||= seed.data.registrationNumber;
  target.data.contactPhone ||= seed.data.contactPhone;
  target.data.email ||= seed.data.email;
  target.data.postalCode ||= seed.data.postalCode;
  target.data.region ||= seed.data.region;
  target.data.locality ||= seed.data.locality;
  target.data.street ||= seed.data.street;
  target.data.houseNumber ||= seed.data.houseNumber;
  target.data.director.fullName ||= seed.data.director.fullName;
}

function ensureEventComplianceApplications(state: AppState): void {
  const seeds: Array<{ id: string; organizerId: string; submittedAt: string; title: string; dateTime: string; venue: string; category: string; city: string; age: "6+" | "12+"; price: number; limit: number; description: string }> = [
    {
      id: "eventApplication001",
      organizerId: "demo_org_1",
      submittedAt: "2026-04-24T09:00:00",
      title: "Весенний концерт City Lights",
      dateTime: "2026-05-20T19:00",
      venue: "Prime Hall",
      category: "Концерты",
      city: "Минск",
      age: "12+",
      price: 65,
      limit: 1200,
      description: "Концертная программа с участием белорусских исполнителей.",
    },
    {
      id: "eventApplication002",
      organizerId: "demo_org_2",
      submittedAt: "2026-04-25T09:00:00",
      title: "Семейное шоу «Планета чудес»",
      dateTime: "2026-05-24T16:00",
      venue: "Гомельский городской центр культуры",
      category: "Шоу",
      city: "Гомель",
      age: "6+",
      price: 40,
      limit: 700,
      description: "Семейное культурно-зрелищное шоу для детей и родителей.",
    },
  ];

  for (const seed of seeds) {
    let row = state.eventComplianceApplications.find((r) => r.eventComplianceApplicationId === seed.id);
    if (!row) {
      row = state.eventComplianceApplications.find((r) => r.organizerId === seed.organizerId && r.data.title === seed.title && r.status === "submitted");
    }
    if (!row) {
      const now = new Date().toISOString();
      const rec: EventComplianceApplicationRecord = {
        eventComplianceApplicationId: seed.id,
        organizerId: seed.organizerId,
        status: "submitted",
        submittedAt: seed.submittedAt,
        reviewedAt: null,
        adminComment: "",
        feePaymentConfirmedByAdmin: false,
        certificateNumber: "",
        certificateDate: "",
        linkedLegacyAppId: null,
        linkedEventId: null,
        data: {
          title: seed.title,
          eventType: seed.category,
          shortDescription: seed.description,
          program: "",
          dateSlots: [seed.dateTime],
          venueName: seed.venue,
          venueAddress: seed.city,
          performers: [],
          onlyBelarusianPerformers: true,
          hasForeignPerformers: false,
          venueType: "",
          projectedCapacity: seed.limit,
          plannedTicketsForSale: seed.limit,
          ticketTiers: [{ name: "Стандарт", price: seed.price, quantity: seed.limit }],
          ageCategory: seed.age,
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
        },
        createdAt: seed.submittedAt,
        updatedAt: now,
      };
      state.eventComplianceApplications.push(rec);
      continue;
    }
    row.organizerId ||= seed.organizerId;
    row.submittedAt ||= seed.submittedAt;
    row.status = row.status === "draft" ? "submitted" : row.status;
    row.data.title ||= seed.title;
    row.data.eventType ||= seed.category;
    row.data.shortDescription ||= seed.description;
    if (!row.data.dateSlots?.length) row.data.dateSlots = [seed.dateTime];
    row.data.venueName ||= seed.venue;
    row.data.venueAddress ||= seed.city;
    row.data.projectedCapacity = row.data.projectedCapacity || seed.limit;
    row.data.plannedTicketsForSale = row.data.plannedTicketsForSale || seed.limit;
    if (!row.data.ticketTiers?.length || row.data.ticketTiers.every((tier) => (tier.quantity || 0) === 0)) {
      row.data.ticketTiers = [{ name: "Стандарт", price: seed.price, quantity: seed.limit }];
    }
    row.data.ageCategory ||= seed.age;
  }
}

function ensureCertificatesForPublishedEvents(state: AppState): void {
  const publishedOrApproved = state.events.filter((event) => event.status === "published" || event.status === "approved");
  const seeds = [
    { number: "certificate001", date: "2026-04-18" },
    { number: "certificate002", date: "2026-04-19" },
  ];
  for (let i = 0; i < Math.min(2, publishedOrApproved.length); i++) {
    const event = publishedOrApproved[i];
    let compliance = state.eventComplianceApplications.find((app) => app.linkedEventId === event.eventId);
    if (!compliance) {
      compliance = {
        eventComplianceApplicationId: `mock-cert-${event.eventId}`,
        organizerId: event.organizerId,
        status: "approved",
        submittedAt: event.createdAt,
        reviewedAt: event.updatedAt,
        adminComment: "",
        feePaymentConfirmedByAdmin: true,
        certificateNumber: "",
        certificateDate: "",
        linkedLegacyAppId: event.appId,
        linkedEventId: event.eventId,
        data: {
          title: event.title,
          eventType: event.category || "Иное",
          shortDescription: event.description || "",
          program: "",
          dateSlots: [event.dateTime],
          venueName: event.venue,
          venueAddress: event.city || "",
          performers: [],
          onlyBelarusianPerformers: true,
          hasForeignPerformers: false,
          venueType: "",
          projectedCapacity: event.capacity,
          plannedTicketsForSale: event.capacity,
          ticketTiers: event.tiers,
          ageCategory: "12+",
          ageComment: "",
          approvalMode: "certificate_required",
          approvalBasis: "",
          eventDocuments: [],
          salesStartDate: "",
          feeExempt: false,
          feeExemptReason: "",
          feePaid: true,
          paymentAttachments: [],
          paymentComment: "",
          adRestrictionConfirmed: false,
          cancelled: false,
          changesDeclared: false,
          executiveCommitteeNotified: false,
          citizensNotified: false,
          notificationsAttachment: [],
          cancellationComment: "",
        },
        createdAt: event.createdAt,
        updatedAt: event.updatedAt,
      };
      state.eventComplianceApplications.push(compliance);
    }
    compliance.certificateNumber ||= seeds[i].number;
    compliance.certificateDate ||= seeds[i].date;
  }
}

function ensureTicketsForPublishedEvents(state: AppState): void {
  for (const event of state.events) {
    if (event.status !== "published") continue;
    const hasTickets = state.tickets.some((ticket) => ticket.eventId === event.eventId);
    if (!hasTickets) issueMarks(state, event.eventId);
  }
}

export function runDemoScenario(): AppState {
  const state = seedDemoCatalog(resetDemoData());
  const published = state.events
    .filter((event) => event.status === "published")
    .slice(0, 3);

  const buyers = ["Покупатель А", "Покупатель Б", "Покупатель В"];
  published.forEach((event, index) => {
    createDemoPurchaseTicket(state, {
      eventId: event.eventId,
      selectedPriceCategory: event.tiers[0]?.name || "Стандарт",
      quantity: 1,
      buyerName: buyers[index] || `Покупатель ${index + 1}`,
    });
  });

  saveState(state);
  return state;
}
