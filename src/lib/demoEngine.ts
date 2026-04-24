import type { AppState, OrganizerAccount, PriceTier } from "@/lib/store";
import {
  approveApplication,
  createApplication,
  createDemoPurchaseTicket,
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
  return defaultState();
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
  resetState();
  const state = buildBaselineState();
  return seedDemoCatalog(state);
}

export function runDemoScenario(): AppState {
  const state = generateDemoData();
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
