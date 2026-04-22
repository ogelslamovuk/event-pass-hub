import React from "react";
import {
  ArrowRight,
  BarChart3,
  Building2,
  CalendarDays,
  CheckCircle2,
  ClipboardCheck,
  FileText,
  Link2,
  LucideIcon,
  Play,
  RefreshCcw,
  ShieldCheck,
  Store,
  Ticket,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useStorageSync } from "@/hooks/useStorageSync";
import { generateDemoData, resetDemoData, runDemoScenario } from "@/lib/demoEngine";
import platformLogo from "../../logo.jpg";

type Accent = {
  border: string;
  glow: string;
  iconBg: string;
  iconColor: string;
  shadow: string;
};

type QuickAccessCard = {
  title: string;
  description: string;
  route: string;
  icon: LucideIcon;
  accent: Accent;
};

type ToolCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  action: () => void;
  accent: Accent;
};

type TileCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
};

type FeatureCard = {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: Accent;
};

type PreviewRow = {
  title: string;
  subtitle: string;
  schedule: string;
  status: string;
  statusBg: string;
  statusColor: string;
  sold: string;
  revenue: string;
  image: string;
};

type ScenarioCard = {
  tag: string;
  title: string;
  description: string;
  image: string;
};

const navItems = ["Программный сценарий", "Роли", "Отчётность", "Ресурсы", "Цены"];

const accents = {
  violet: {
    border: "rgba(192, 132, 252, 0.38)",
    glow: "rgba(168, 85, 247, 0.28)",
    iconBg: "linear-gradient(180deg, rgba(168,85,247,0.22) 0%, rgba(91,33,182,0.16) 100%)",
    iconColor: "#E9D5FF",
    shadow: "0 12px 34px rgba(124, 58, 237, 0.22)",
  },
  blue: {
    border: "rgba(96, 165, 250, 0.38)",
    glow: "rgba(59, 130, 246, 0.26)",
    iconBg: "linear-gradient(180deg, rgba(59,130,246,0.22) 0%, rgba(29,78,216,0.14) 100%)",
    iconColor: "#DBEAFE",
    shadow: "0 12px 34px rgba(37, 99, 235, 0.2)",
  },
  emerald: {
    border: "rgba(52, 211, 153, 0.34)",
    glow: "rgba(16, 185, 129, 0.24)",
    iconBg: "linear-gradient(180deg, rgba(16,185,129,0.2) 0%, rgba(6,95,70,0.14) 100%)",
    iconColor: "#D1FAE5",
    shadow: "0 12px 34px rgba(5, 150, 105, 0.18)",
  },
  amber: {
    border: "rgba(251, 191, 36, 0.34)",
    glow: "rgba(245, 158, 11, 0.22)",
    iconBg: "linear-gradient(180deg, rgba(245,158,11,0.2) 0%, rgba(146,64,14,0.14) 100%)",
    iconColor: "#FEF3C7",
    shadow: "0 12px 34px rgba(180, 83, 9, 0.18)",
  },
  indigo: {
    border: "rgba(165, 180, 252, 0.34)",
    glow: "rgba(99, 102, 241, 0.22)",
    iconBg: "linear-gradient(180deg, rgba(99,102,241,0.22) 0%, rgba(49,46,129,0.16) 100%)",
    iconColor: "#E0E7FF",
    shadow: "0 12px 34px rgba(79, 70, 229, 0.18)",
  },
  orange: {
    border: "rgba(251, 146, 60, 0.34)",
    glow: "rgba(249, 115, 22, 0.22)",
    iconBg: "linear-gradient(180deg, rgba(249,115,22,0.22) 0%, rgba(154,52,18,0.14) 100%)",
    iconColor: "#FFEDD5",
    shadow: "0 12px 34px rgba(194, 65, 12, 0.18)",
  },
} as const;

const quickAccessCards: QuickAccessCard[] = [
  {
    title: "Кабинет организатора",
    description: "Управление мероприятиями, билетами и продажами",
    route: "/organizer",
    icon: Building2,
    accent: accents.violet,
  },
  {
    title: "Центр управления",
    description: "Контроль мероприятий, лицензий, билетов, данных и процессов",
    route: "/admin",
    icon: ShieldCheck,
    accent: accents.blue,
  },
  {
    title: "Кабинет реселлера",
    description: "Работа с мероприятиями, билетами и каналами распространения",
    route: "/channel",
    icon: Store,
    accent: accents.emerald,
  },
  {
    title: "B2C Афиша",
    description: "Публичная витрина мероприятий, поиск событий и покупка билетов",
    route: "/demo",
    icon: Ticket,
    accent: accents.violet,
  },
];

const tileCards: TileCard[] = [
  {
    title: "Лицензирование мероприятий",
    description: "Согласование мероприятия, организатора и площадки в единой системе",
    icon: ShieldCheck,
    accent: accents.violet,
  },
  {
    title: "Реестр мероприятий",
    description: "Единые карточки мероприятий, статусы, параметры и история изменений",
    icon: CalendarDays,
    accent: accents.blue,
  },
  {
    title: "Билеты и продажи",
    description: "Выпуск, реализация, возвраты и учёт билетного движения",
    icon: Ticket,
    accent: accents.amber,
  },
  {
    title: "Отчётность",
    description: "Сводные показатели, выгрузки и контрольные формы",
    icon: FileText,
    accent: accents.indigo,
  },
  {
    title: "Аналитика",
    description: "Мониторинг продаж, динамики и операционных показателей",
    icon: BarChart3,
    accent: accents.orange,
  },
  {
    title: "Интеграции",
    description: "Подключение внешних систем, касс, сайтов и API",
    icon: Link2,
    accent: accents.emerald,
  },
];

const rightFeatures: FeatureCard[] = [
  {
    title: "Реестр мероприятий",
    description: "Единые карточки, статусы и параметры мероприятий",
    icon: CalendarDays,
    accent: accents.blue,
  },
  {
    title: "Роли и доступы",
    description: "Разграничение полномочий для всех участников системы",
    icon: Users,
    accent: accents.violet,
  },
  {
    title: "Билеты и продажи",
    description: "Выпуск, реализация, возвраты и контроль движения билетов",
    icon: Ticket,
    accent: accents.violet,
  },
  {
    title: "Интеграции",
    description: "Подключение внешних сервисов, касс и каналов продаж",
    icon: Link2,
    accent: accents.orange,
  },
  {
    title: "Отчётность",
    description: "Оперативные показатели и регламентные выгрузки",
    icon: FileText,
    accent: accents.emerald,
  },
  {
    title: "История действий",
    description: "Аудит изменений и прозрачность операций по каждому объекту",
    icon: ClipboardCheck,
    accent: accents.indigo,
  },
];

const metrics = [
  { value: "30K+", label: "событий", icon: CalendarDays, accent: accents.blue },
  { value: "25M+", label: "билетов учтено", icon: Ticket, accent: accents.violet },
  { value: "12M+", label: "посетителей", icon: Users, accent: accents.emerald },
  { value: "2.1K+", label: "участников рынка", icon: Building2, accent: accents.indigo },
  { value: "99.9%", label: "доступность платформы", icon: ShieldCheck, accent: accents.amber },
] as const;

const previewRows: PreviewRow[] = [
  {
    title: "Большой летний фестиваль",
    subtitle: "Фестиваль",
    schedule: "14–16 июня 2025\nМосква, Лужники",
    status: "Лицензия выдана",
    statusBg: "rgba(16, 185, 129, 0.18)",
    statusColor: "#A7F3D0",
    sold: "45 320",
    revenue: "124 560 000 ₽",
    image: "linear-gradient(135deg, #2b0a38 0%, #8b1cff 44%, #1f6fff 100%)",
  },
  {
    title: "Международный форум креативных индустрий",
    subtitle: "Форум",
    schedule: "20–21 августа 2025\nСанкт-Петербург",
    status: "На рассмотрении",
    statusBg: "rgba(245, 158, 11, 0.18)",
    statusColor: "#FDE68A",
    sold: "8 750",
    revenue: "18 900 000 ₽",
    image: "linear-gradient(135deg, #08152f 0%, #1d4ed8 46%, #0ea5e9 100%)",
  },
  {
    title: "Чемпионат России по баскетболу",
    subtitle: "Спорт",
    schedule: "11 октября 2025\nКазань, Баскет-Холл",
    status: "Черновик",
    statusBg: "rgba(148, 163, 184, 0.16)",
    statusColor: "#CBD5E1",
    sold: "0",
    revenue: "0 ₽",
    image: "linear-gradient(135deg, #131316 0%, #7c2d12 48%, #f97316 100%)",
  },
];

const scenarioCards: ScenarioCard[] = [
  {
    tag: "Фестиваль",
    title: "Музыкальный фестиваль",
    description: "многодневное событие · несколько категорий билетов · контроль квот",
    image: "linear-gradient(135deg, #2b0a38 0%, #9b1cff 40%, #2563eb 100%)",
  },
  {
    tag: "Форум",
    title: "Деловой форум",
    description: "регистрация участников · билеты · отчётность по мероприятию",
    image: "linear-gradient(135deg, #061428 0%, #1d4ed8 42%, #0ea5e9 100%)",
  },
  {
    tag: "Спорт",
    title: "Спортивное событие",
    description: "массовое мероприятие · поток участников · контроль проходов",
    image: "linear-gradient(135deg, #07140f 0%, #166534 42%, #22c55e 100%)",
  },
  {
    tag: "Выставка",
    title: "Выставочный проект",
    description: "длительный период продаж · разные типы билетов · аналитика посещаемости",
    image: "linear-gradient(135deg, #16120a 0%, #92400e 44%, #f59e0b 100%)",
  },
];

const shellBackground =
  "radial-gradient(circle at 18% 10%, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at 42% 12%, rgba(168,85,247,0.18), transparent 20%), radial-gradient(circle at 84% 86%, rgba(59,130,246,0.14), transparent 20%), linear-gradient(180deg, #020611 0%, #040b18 48%, #020611 100%)";

const panelBase: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(8,15,28,0.96) 0%, rgba(5,11,22,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.36)",
};

function AccentIcon({ icon: Icon, accent, size = 20 }: { icon: LucideIcon; accent: Accent; size?: number }) {
  return (
    <div
      className="flex items-center justify-center rounded-[16px] border"
      style={{
        width: 46,
        height: 46,
        borderColor: accent.border,
        background: accent.iconBg,
        color: accent.iconColor,
        boxShadow: accent.shadow,
      }}
    >
      <Icon size={size} />
    </div>
  );
}

function QuickAccessCardView({ card }: { card: QuickAccessCard }) {
  return (
    <Link
      to={card.route}
      className="group rounded-[22px] border p-5 transition-all duration-200 hover:-translate-y-[1px]"
      style={{
        background: `linear-gradient(180deg, rgba(9,17,31,0.96) 0%, rgba(6,12,25,0.94) 100%), radial-gradient(circle at 50% 0%, ${card.accent.glow}, transparent 50%)`,
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: `0 18px 44px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <AccentIcon icon={card.icon} accent={card.accent} size={18} />
      <div className="mt-5 flex min-h-[76px] flex-col justify-start">
        <h3 className="max-w-[180px] text-[28px] font-semibold leading-[1.05] tracking-[-0.03em] text-white sm:text-[22px] xl:text-[24px]">
          {card.title}
        </h3>
        <p className="mt-3 text-[14px] leading-6 text-[rgba(203,213,225,0.78)]">{card.description}</p>
      </div>
      <div
        className="mt-5 inline-flex h-9 w-9 items-center justify-center rounded-full border transition-transform duration-200 group-hover:translate-x-0.5"
        style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}
      >
        <ArrowRight size={16} className="text-[rgba(233,238,255,0.9)]" />
      </div>
    </Link>
  );
}

function DemoToolCard({ card }: { card: ToolCard }) {
  return (
    <button
      type="button"
      onClick={card.action}
      className="rounded-[22px] border p-5 text-left transition-all duration-200 hover:-translate-y-[1px]"
      style={{
        background: `linear-gradient(180deg, rgba(9,17,31,0.96) 0%, rgba(6,12,25,0.94) 100%)`,
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: `0 18px 44px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.04), inset 0 0 0 1px ${card.accent.glow}`,
      }}
    >
      <AccentIcon icon={card.icon} accent={card.accent} size={18} />
      <div className="mt-5 min-h-[78px]">
        <h3 className="text-[28px] font-semibold leading-[1.06] tracking-[-0.03em] text-white sm:text-[22px] xl:text-[24px]">
          {card.title}
        </h3>
        <p className="mt-3 text-[14px] leading-6 text-[rgba(203,213,225,0.78)]">{card.description}</p>
      </div>
    </button>
  );
}

function TileCardView({ card }: { card: TileCard }) {
  return (
    <div
      className="rounded-[22px] border p-5"
      style={{
        background: "linear-gradient(180deg, rgba(9,17,31,0.94) 0%, rgba(5,11,22,0.92) 100%)",
        borderColor: "rgba(255,255,255,0.08)",
        boxShadow: `0 16px 40px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.04)`,
      }}
    >
      <AccentIcon icon={card.icon} accent={card.accent} size={20} />
      <h3 className="mt-5 text-[18px] font-semibold leading-7 tracking-[-0.03em] text-white">{card.title}</h3>
      <p className="mt-3 text-[14px] leading-6 text-[rgba(203,213,225,0.8)]">{card.description}</p>
    </div>
  );
}

function FeatureCardView({ card }: { card: FeatureCard }) {
  return (
    <div
      className="rounded-[18px] border px-4 py-4"
      style={{
        background: "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
        borderColor: "rgba(255,255,255,0.07)",
      }}
    >
      <div className="flex items-start gap-3">
        <AccentIcon icon={card.icon} accent={card.accent} size={17} />
        <div>
          <h4 className="text-[16px] font-semibold leading-6 tracking-[-0.02em] text-white">{card.title}</h4>
          <p className="mt-1 text-[14px] leading-6 text-[rgba(203,213,225,0.76)]">{card.description}</p>
        </div>
      </div>
    </div>
  );
}

export default function PlatformLandingPage() {
  const { setState } = useStorageSync();

  const toolCards: ToolCard[] = [
    {
      title: "Сбросить\nдемо",
      description: "Очистить текущие данные и вернуть систему к базовому состоянию",
      icon: RefreshCcw,
      action: () => {
        setState({ ...resetDemoData() });
        toast.success("Демо сброшено");
      },
      accent: accents.violet,
    },
    {
      title: "Загрузить\nmock-данные",
      description: "Загрузить типовые данные по мероприятиям, билетам и пользователям",
      icon: ClipboardCheck,
      action: () => {
        setState({ ...generateDemoData() });
        toast.success("Mock-данные загружены");
      },
      accent: accents.blue,
    },
    {
      title: "Запустить\ndemo-сценарий",
      description: "Запустить готовый сценарий работы системы с типовыми данными",
      icon: Play,
      action: () => {
        setState({ ...runDemoScenario() });
        toast.success("Demo-сценарий запущен");
      },
      accent: accents.emerald,
    },
  ];

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <Sonner
        toastOptions={{
          style: {
            background: "rgba(7, 13, 24, 0.96)",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#ffffff",
          },
        }}
      />

      <div className="pointer-events-none fixed inset-0" style={{ background: shellBackground }} />

      <div className="relative mx-auto max-w-[1440px] px-4 pb-8 pt-4 md:px-6 xl:px-8">
        <header
          className="rounded-[26px] px-5 py-4 md:px-7"
          style={{
            background: "linear-gradient(180deg, rgba(7,13,24,0.92) 0%, rgba(5,10,20,0.9) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 16px 44px rgba(0,0,0,0.26)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded-lg object-cover" />
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-[17px] font-semibold tracking-[-0.03em] text-white">CinemaLab</span>
                <span className="text-[14px] text-[rgba(203,213,225,0.72)]">Билетная платформа</span>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-5 text-[14px] text-[rgba(233,238,255,0.84)] md:gap-8">
              {navItems.map((item) => (
                <a key={item} href="#" className="transition-colors hover:text-white">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[0.92fr_1.15fr]">
          <div
            className="relative overflow-hidden rounded-[34px] px-7 py-8 md:px-8 md:py-9 xl:px-9 xl:py-10"
            style={{
              ...panelBase,
              boxShadow: "0 28px 80px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="pointer-events-none absolute -right-28 top-10 h-[300px] w-[300px] rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.42) 0%, rgba(59,130,246,0.16) 44%, transparent 72%)" }}
            />
            <div
              className="pointer-events-none absolute -left-24 top-36 h-[260px] w-[260px] rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(59,130,246,0.18) 0%, transparent 68%)" }}
            />
            <span
              className="inline-flex rounded-[12px] px-4 py-2 text-[13px] font-medium tracking-[0.01em]"
              style={{
                border: "1px solid rgba(196,181,253,0.22)",
                background: "linear-gradient(180deg, rgba(91,33,182,0.22) 0%, rgba(29,78,216,0.1) 100%)",
                color: "#D8B4FE",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.05)",
              }}
            >
              Билетная платформа
            </span>

            <h1 className="mt-6 text-[46px] font-semibold leading-[0.98] tracking-[-0.06em] text-white md:text-[64px] xl:text-[72px]">
              Единая платформа
              <br />
              управления
              <br />
              <span
                style={{
                  background: "linear-gradient(90deg, #C084FC 0%, #A855F7 52%, #4F7BFF 100%)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                мероприятиями
              </span>
              <br />и билетами
            </h1>

            <p className="mt-6 max-w-[520px] text-[16px] leading-8 text-[rgba(213,223,246,0.82)] md:text-[18px]">
              Демо-портал показывает, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе:
              управляют мероприятиями, ведут билеты, контролируют продажи, получают отчётность и видят общую картину рынка.
            </p>

            <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-3">
              {[
                { label: "Единый реестр\nмероприятий", icon: CalendarDays, accent: accents.blue },
                { label: "Единый реестр\nбилетов", icon: Ticket, accent: accents.violet },
                { label: "Отчётность\nи контроль", icon: ShieldCheck, accent: accents.violet },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-[20px] border px-4 py-4"
                  style={{
                    background: "linear-gradient(180deg, rgba(10,17,31,0.92) 0%, rgba(6,11,21,0.9) 100%)",
                    borderColor: "rgba(255,255,255,0.08)",
                    boxShadow: "0 16px 38px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.04)",
                  }}
                >
                  <AccentIcon icon={item.icon} accent={item.accent} size={18} />
                  <p className="mt-4 whitespace-pre-line text-[16px] font-semibold leading-6 tracking-[-0.02em] text-white">{item.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div
            className="relative overflow-hidden rounded-[34px] px-5 py-5 md:px-6 md:py-6"
            style={{
              ...panelBase,
              border: "1px solid rgba(79,123,255,0.28)",
              boxShadow: "0 32px 88px rgba(0,0,0,0.42), 0 0 0 1px rgba(125, 106, 255, 0.14), inset 0 1px 0 rgba(255,255,255,0.04)",
            }}
          >
            <div
              className="pointer-events-none absolute -left-10 top-10 h-52 w-52 rounded-full blur-3xl"
              style={{ background: "radial-gradient(circle, rgba(168,85,247,0.18) 0%, transparent 68%)" }}
            />
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Лицензирование</h2>
                <p className="mt-2 max-w-[280px] text-[15px] leading-6 text-[rgba(203,213,225,0.78)] md:text-[17px]">
                  Лицензирование мероприятий,
                  <br />
                  организаторов, площадок
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-[12px] px-4 py-2 text-[12px] font-semibold tracking-[0.01em] text-white"
                  style={{
                    background: "linear-gradient(90deg, #4F7BFF 0%, #B059FF 100%)",
                    boxShadow: "0 14px 32px rgba(99,102,241,0.32)",
                  }}
                >
                  Добавить мероприятие
                </button>
                {Array.from({ length: 3 }).map((_, idx) => (
                  <div
                    key={idx}
                    className="flex h-9 w-9 items-center justify-center rounded-[12px] border"
                    style={{
                      borderColor: "rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.03)",
                    }}
                  >
                    <div className="h-[10px] w-[10px] rounded-sm bg-[rgba(233,238,255,0.72)]" />
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 flex gap-2 overflow-x-auto pb-1">
              {["Все", "Концерты", "Фестивали", "Форумы", "Спорт", "Выставки"].map((item, index) => (
                <span
                  key={item}
                  className="shrink-0 rounded-full px-3 py-1.5 text-[12px] font-medium"
                  style={{
                    border: "1px solid rgba(255,255,255,0.08)",
                    background: index === 0 ? "linear-gradient(180deg, rgba(79,123,255,0.36) 0%, rgba(79,123,255,0.16) 100%)" : "rgba(255,255,255,0.03)",
                    color: index === 0 ? "#FFFFFF" : "rgba(233,238,255,0.74)",
                    boxShadow: index === 0 ? "0 12px 28px rgba(79,123,255,0.22)" : "none",
                  }}
                >
                  {item}
                </span>
              ))}
            </div>

            <div className="mt-5 space-y-3">
              {previewRows.map((row) => (
                <div
                  key={row.title}
                  className="grid grid-cols-1 gap-4 rounded-[22px] border p-3 md:grid-cols-[110px_minmax(0,1fr)_auto_auto] md:items-center md:gap-5"
                  style={{
                    background: "linear-gradient(180deg, rgba(7,13,24,0.92) 0%, rgba(5,10,20,0.9) 100%)",
                    borderColor: "rgba(255,255,255,0.08)",
                    boxShadow: "0 18px 42px rgba(0,0,0,0.22), inset 0 1px 0 rgba(255,255,255,0.03)",
                  }}
                >
                  <div
                    className="h-[82px] rounded-[16px] border"
                    style={{ background: row.image, borderColor: "rgba(255,255,255,0.08)" }}
                  />
                  <div className="min-w-0">
                    <h3 className="truncate text-[16px] font-semibold leading-6 tracking-[-0.02em] text-white md:text-[18px]">{row.title}</h3>
                    <p className="mt-1 text-[13px] leading-5 text-[rgba(203,213,225,0.74)]">{row.subtitle}</p>
                    <p className="mt-2 whitespace-pre-line text-[13px] leading-5 text-[rgba(148,163,184,0.78)]">{row.schedule}</p>
                  </div>
                  <div>
                    <span
                      className="inline-flex rounded-full px-3 py-1.5 text-[11px] font-semibold"
                      style={{ background: row.statusBg, color: row.statusColor, border: `1px solid ${row.statusColor}33` }}
                    >
                      {row.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-5 md:min-w-[210px]">
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[rgba(148,163,184,0.66)]">Продано билетов</p>
                      <p className="mt-1 text-[16px] font-semibold leading-6 text-white">{row.sold}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-[rgba(148,163,184,0.66)]">Выручка</p>
                      <p className="mt-1 text-[16px] font-semibold leading-6 text-white">{row.revenue}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.28fr_0.95fr]">
          <div className="rounded-[28px] px-5 py-5 md:px-6 md:py-6" style={panelBase}>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Быстрый вход в страницы проекта</h2>
            <p className="mt-2 text-[15px] leading-6 text-[rgba(203,213,225,0.74)] md:text-[16px]">
              Откройте ключевые страницы платформы одним кликом
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-4">
              {quickAccessCards.map((card) => (
                <QuickAccessCardView key={card.title} card={card} />
              ))}
            </div>
          </div>

          <div className="rounded-[28px] px-5 py-5 md:px-6 md:py-6" style={panelBase}>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Демо-инструменты</h2>
            <p className="mt-2 text-[15px] leading-6 text-[rgba(203,213,225,0.74)] md:text-[16px]">
              Инструменты для управления демо-средой и загрузки типовых данных
            </p>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3 xl:grid-cols-1 2xl:grid-cols-3">
              {toolCards.map((card) => (
                <DemoToolCard key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-5 md:px-6 md:py-6" style={panelBase}>
          <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Откройте каждую сторону платформы</h2>
          <p className="mt-2 text-[15px] leading-6 text-[rgba(203,213,225,0.74)] md:text-[16px]">
            Перед вами ключевые модули и сценарии, через которые платформа работает для всех участников рынка
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-6">
            {tileCards.map((card) => (
              <TileCardView key={card.title} card={card} />
            ))}
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[1.03fr_1.05fr]">
          <div className="rounded-[28px] px-5 py-5 md:px-6 md:py-6" style={panelBase}>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Единая система для рынка мероприятий</h2>
            <div className="mt-5 space-y-4">
              {[
                "Регистрировать — вести единый учёт мероприятий, организаторов и площадок",
                "Координировать — синхронизировать работу регулятора, организаторов и каналов продаж",
                "Контролировать — видеть продажи, возвраты, статусы и операции в одном окне",
                "Анализировать — получать прозрачную отчётность по рынку и отдельным мероприятиям",
              ].map((item, index) => (
                <div key={item} className="flex items-start gap-3">
                  <div
                    className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border"
                    style={{
                      borderColor: [accents.violet, accents.blue, accents.amber, accents.emerald][index].border,
                      background: [accents.violet, accents.blue, accents.amber, accents.emerald][index].iconBg,
                    }}
                  >
                    <CheckCircle2 size={16} color={[accents.violet, accents.blue, accents.amber, accents.emerald][index].iconColor} />
                  </div>
                  <p className="text-[14px] leading-7 text-[rgba(203,213,225,0.82)] md:text-[15px]">{item}</p>
                </div>
              ))}
            </div>

            <div
              className="relative mt-7 h-[220px] overflow-hidden rounded-[22px] border"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background:
                  "radial-gradient(circle at 55% 45%, rgba(167,139,250,0.44) 0%, rgba(99,102,241,0.18) 24%, rgba(7,13,24,0.86) 54%, rgba(5,10,20,0.98) 82%)",
              }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative flex h-28 w-28 items-center justify-center rounded-full border border-[rgba(196,181,253,0.34)] bg-[rgba(255,255,255,0.02)] shadow-[0_0_60px_rgba(168,85,247,0.26)]">
                  <div className="absolute h-40 w-40 rounded-full border border-[rgba(79,123,255,0.16)]" />
                  <div className="absolute h-56 w-56 rounded-full border border-[rgba(168,85,247,0.12)]" />
                  <ShieldCheck size={34} className="text-[rgba(233,238,255,0.96)]" />
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[28px] px-5 py-5 md:px-6 md:py-6" style={panelBase}>
            <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Всё необходимое в одной платформе</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
              {rightFeatures.map((card) => (
                <FeatureCardView key={card.title} card={card} />
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 grid grid-cols-1 gap-3 rounded-[24px] px-4 py-4 md:grid-cols-5" style={panelBase}>
          {metrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="rounded-[20px] border px-4 py-4"
                style={{
                  background: "linear-gradient(180deg, rgba(9,17,31,0.96) 0%, rgba(6,12,25,0.92) 100%)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="flex items-center gap-3">
                  <AccentIcon icon={Icon} accent={metric.accent} size={18} />
                  <div>
                    <div className="text-[18px] font-semibold tracking-[-0.03em] text-white md:text-[20px]">{metric.value}</div>
                    <div className="mt-1 text-[13px] leading-5 text-[rgba(203,213,225,0.74)]">{metric.label}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-5 md:px-6 md:py-6" style={panelBase}>
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Типовые сценарии в демо</h2>
              <p className="mt-2 text-[15px] leading-6 text-[rgba(203,213,225,0.74)] md:text-[16px]">
                Примеры событий и форматов, которые проходят через платформу
              </p>
            </div>
            <button
              type="button"
              className="inline-flex items-center rounded-[14px] border px-4 py-2 text-[13px] font-medium text-white"
              style={{
                borderColor: "rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.03)",
              }}
            >
              Смотреть все сценарии
              <ArrowRight size={14} className="ml-2" />
            </button>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-4">
            {scenarioCards.map((card) => (
              <div
                key={card.title}
                className="overflow-hidden rounded-[22px] border"
                style={{
                  background: "linear-gradient(180deg, rgba(9,17,31,0.96) 0%, rgba(6,12,25,0.94) 100%)",
                  borderColor: "rgba(255,255,255,0.08)",
                }}
              >
                <div className="h-[110px]" style={{ background: card.image }} />
                <div className="px-4 py-4">
                  <span
                    className="inline-flex rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.08em]"
                    style={{ border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "rgba(233,238,255,0.82)" }}
                  >
                    {card.tag}
                  </span>
                  <h3 className="mt-3 text-[20px] font-semibold leading-7 tracking-[-0.03em] text-white">{card.title}</h3>
                  <p className="mt-2 text-[14px] leading-6 text-[rgba(203,213,225,0.74)]">{card.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section
          className="relative mt-5 overflow-hidden rounded-[28px] px-6 py-6 md:px-8 md:py-7"
          style={{
            border: "1px solid rgba(255,255,255,0.08)",
            background:
              "radial-gradient(circle at 87% 50%, rgba(168,85,247,0.28) 0%, rgba(59,130,246,0.2) 18%, transparent 34%), linear-gradient(180deg, rgba(12,18,33,0.98) 0%, rgba(7,13,24,0.94) 100%)",
            boxShadow: "0 24px 64px rgba(0,0,0,0.28)",
          }}
        >
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <h2 className="text-[28px] font-semibold tracking-[-0.04em] text-white md:text-[34px]">Готовы посмотреть платформу в действии?</h2>
              <p className="mt-2 max-w-[640px] text-[15px] leading-7 text-[rgba(203,213,225,0.78)] md:text-[16px]">
                Откройте демо и посмотрите, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе
              </p>
            </div>
            <button
              type="button"
              className="inline-flex h-12 items-center justify-center rounded-[16px] px-6 text-[15px] font-semibold text-white md:h-14 md:px-7 md:text-[16px]"
              style={{ background: "linear-gradient(90deg, #3B82F6 0%, #A855F7 100%)", boxShadow: "0 18px 38px rgba(79,123,255,0.28)" }}
            >
              Запросить демо
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        </section>

        <footer
          className="mt-5 rounded-[24px] px-5 py-4 md:px-6"
          style={{
            border: "1px solid rgba(255,255,255,0.07)",
            background: "linear-gradient(180deg, rgba(7,13,24,0.92) 0%, rgba(5,10,20,0.9) 100%)",
          }}
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded-lg object-cover" />
              <span className="text-[17px] font-semibold tracking-[-0.03em] text-white">CinemaLab</span>
              <span className="text-[14px] text-[rgba(203,213,225,0.72)]">Билетная платформа</span>
            </div>
            <div className="flex flex-wrap items-center gap-5 text-[13px] text-[rgba(203,213,225,0.7)] md:gap-7">
              {navItems.map((item) => (
                <a key={item} href="#">
                  {item}
                </a>
              ))}
            </div>
            <span className="text-[13px] text-[rgba(148,163,184,0.78)]">© 2025 CinemaLab. Все права защищены.</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
