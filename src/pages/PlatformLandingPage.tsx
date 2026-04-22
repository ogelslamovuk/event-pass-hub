import React from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Database,
  Gauge,
  Layers3,
  Link2,
  Play,
  RefreshCw,
  Shield,
  Ticket,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useStorageSync } from "@/hooks/useStorageSync";
import { generateDemoData, resetDemoData, runDemoScenario } from "@/lib/demoEngine";
import platformLogo from "../../logo.jpg";

const navItems = ["Программный сценарий", "Роли", "Отчётность", "Ресурсы", "Цены"];

const quickAccessCards = [
  {
    title: "Кабинет организатора",
    description: "Управление мероприятиями, билетами и продажами",
    route: "/organizer",
    glow: "from-fuchsia-500/20 via-purple-500/10 to-indigo-500/5",
    iconWrap: "border-fuchsia-400/40 bg-fuchsia-500/15 text-fuchsia-200",
  },
  {
    title: "Центр управления",
    description: "Контроль мероприятий, лицензий, билетов, данных и процессов",
    route: "/admin",
    glow: "from-blue-500/20 via-cyan-500/10 to-sky-500/5",
    iconWrap: "border-blue-400/40 bg-blue-500/15 text-blue-200",
  },
  {
    title: "Кабинет реселлера",
    description: "Работа с мероприятиями, билетами и каналами распространения",
    route: "/channel",
    glow: "from-emerald-500/20 via-teal-500/10 to-cyan-500/5",
    iconWrap: "border-emerald-400/40 bg-emerald-500/15 text-emerald-200",
  },
  {
    title: "B2C Афиша",
    description: "Публичная витрина мероприятий, поиск событий и покупка билетов",
    route: "/demo",
    glow: "from-purple-500/20 via-pink-500/10 to-violet-500/5",
    iconWrap: "border-purple-400/40 bg-purple-500/15 text-purple-200",
  },
];

const platformTiles = [
  {
    title: "Лицензирование мероприятий",
    desc: "Согласование мероприятия, организатора и площадки",
    icon: Shield,
    cardTint: "from-fuchsia-500/18 to-transparent",
    iconTint: "text-fuchsia-200 border-fuchsia-400/35 bg-fuchsia-500/12",
  },
  {
    title: "Реестр мероприятий",
    desc: "Карточки, статусы, параметры и история",
    icon: CalendarCheck2,
    cardTint: "from-blue-500/18 to-transparent",
    iconTint: "text-blue-200 border-blue-400/35 bg-blue-500/12",
  },
  {
    title: "Билеты и продажи",
    desc: "Выпуск, реализация, возвраты и учёт",
    icon: Ticket,
    cardTint: "from-amber-500/18 to-transparent",
    iconTint: "text-amber-200 border-amber-400/35 bg-amber-500/12",
  },
  {
    title: "Отчётность",
    desc: "Показатели, выгрузки и контрольные формы",
    icon: ClipboardList,
    cardTint: "from-indigo-500/18 to-transparent",
    iconTint: "text-indigo-200 border-indigo-400/35 bg-indigo-500/12",
  },
  {
    title: "Аналитика",
    desc: "Мониторинг продаж и операционных показателей",
    icon: BarChart3,
    cardTint: "from-orange-500/18 to-transparent",
    iconTint: "text-orange-200 border-orange-400/35 bg-orange-500/12",
  },
  {
    title: "Интеграции",
    desc: "Кассы, сайты, внешние системы и API",
    icon: Link2,
    cardTint: "from-emerald-500/18 to-transparent",
    iconTint: "text-emerald-200 border-emerald-400/35 bg-emerald-500/12",
  },
];

const metrics = ["30K+ событий", "25M+ билетов учтено", "12M+ посетителей", "2.1K+ участников рынка", "99.9% доступность платформы"];

const scenarios = ["Музыкальный фестиваль", "Деловой форум", "Спортивное событие", "Выставочный проект"];

const previewRows = [
  {
    title: "Большой летний фестиваль",
    subtitle: "Фестиваль · Москва",
    status: "Лицензия выдана",
    statusClass: "text-emerald-300 bg-emerald-500/20 border-emerald-400/40",
    sold: "45 320",
    revenue: "124 560 000 ₽",
  },
  {
    title: "Международный форум",
    subtitle: "Форум · Санкт-Петербург",
    status: "На рассмотрении",
    statusClass: "text-amber-200 bg-amber-500/20 border-amber-300/30",
    sold: "8 750",
    revenue: "18 900 000 ₽",
  },
  {
    title: "Чемпионат России",
    subtitle: "Спорт · Казань",
    status: "Черновик",
    statusClass: "text-slate-200 bg-slate-500/20 border-slate-300/30",
    sold: "0",
    revenue: "0 ₽",
  },
];

export default function PlatformLandingPage() {
  const { setState } = useStorageSync();

  const runReset = () => {
    setState({ ...resetDemoData() });
    toast.success("Демо сброшено");
  };

  const runGenerate = () => {
    setState({ ...generateDemoData() });
    toast.success("Mock-данные загружены");
  };

  const runScenario = () => {
    setState({ ...runDemoScenario() });
    toast.success("Demo-сценарий запущен");
  };

  return (
    <div className="min-h-screen bg-[#020817] text-white">
      <Sonner
        toastOptions={{
          style: { background: "#071125", border: "1px solid rgba(124,148,194,0.3)", color: "#fff" },
        }}
      />

      <div
        className="pointer-events-none fixed inset-0 opacity-95"
        style={{
          background:
            "radial-gradient(circle at 19% 12%, rgba(78,95,255,0.28), transparent 38%), radial-gradient(circle at 72% 25%, rgba(145,78,255,0.2), transparent 46%), radial-gradient(circle at 82% 90%, rgba(48,162,255,0.2), transparent 36%), linear-gradient(180deg, #010511 0%, #030a1d 55%, #010612 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1420px] px-5 pb-8 pt-5 md:px-7">
        <header className="rounded-2xl border border-[#203458] bg-[#030d22]/90 px-5 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex min-w-0 items-center gap-3">
              <img src={platformLogo} alt="CinemaLab logo" className="h-9 w-9 rounded-md object-cover" />
              <p className="text-[34px] font-semibold leading-none">CinemaLab</p>
              <p className="ml-2 text-sm text-[#98a6c9]">Билетная платформа</p>
            </div>
            <nav className="flex items-center gap-8 text-[14px] text-[#d6def5]">
              {navItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-white">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.02fr_1.38fr]">
          <div className="relative overflow-hidden rounded-3xl border border-[#24375d] bg-[#020b1f]/95 p-8 shadow-[0_30px_80px_rgba(13,23,53,0.45)]">
            <div className="absolute -left-24 top-20 h-60 w-60 rounded-full bg-violet-600/20 blur-3xl" />
            <div className="absolute right-6 top-6 h-32 w-32 rounded-full bg-indigo-500/20 blur-2xl" />
            <span className="inline-flex rounded-xl border border-[#49506f] bg-[#121c37] px-4 py-1 text-sm text-[#a9b4d9]">Билетная платформа</span>
            <h1 className="mt-4 text-[66px] font-semibold leading-[0.99] tracking-tight xl:text-[72px]">
              Единая платформа
              <br />
              управления
              <br />
              <span className="bg-gradient-to-r from-[#b17fff] via-[#9f69ff] to-[#6f8dff] bg-clip-text text-transparent">мероприятиями</span>
              <br />и билетами
            </h1>
            <p className="mt-5 max-w-[680px] text-[18px] leading-[1.5] text-[#c7d1ee]">
              Демо-портал показывает, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе: управляют мероприятиями, ведут билеты, контролируют продажи, получают отчётность и видят общую картину рынка.
            </p>
            <div className="mt-7 grid grid-cols-3 gap-3">
              {[
                "Единый реестр мероприятий",
                "Единый реестр билетов",
                "Отчётность и контроль",
              ].map((item) => (
                <div key={item} className="rounded-2xl border border-[#2b4068] bg-[#07122b]/90 p-4 shadow-[inset_0_1px_0_rgba(168,191,255,0.12)]">
                  <div className="inline-flex rounded-lg border border-[#3f588f] bg-[#0b1a3a] p-2">
                    <Layers3 className="h-4 w-4 text-[#9cb0e7]" />
                  </div>
                  <p className="mt-2 text-[31px] leading-[1.12] text-[#edf2ff]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#2a4181] bg-[#020c20]/95 p-6 shadow-[0_0_100px_rgba(106,77,255,0.33)]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-[40px] font-semibold leading-tight">Лицензирование</h2>
                <p className="mt-1 text-[18px] leading-snug text-[#adbbde]">Лицензирование мероприятий, организаторов, площадок</p>
              </div>
              <button className="rounded-lg border border-[#7f6eff]/40 bg-gradient-to-r from-[#6f4eff] to-[#b257ff] px-4 py-2 text-xs font-medium">Добавить мероприятие</button>
            </div>
            <div className="mt-5 flex flex-wrap gap-2 text-xs">
              {[
                "Все",
                "Концерты",
                "Фестивали",
                "Форумы",
                "Спорт",
                "Выставки",
              ].map((f, i) => (
                <span
                  key={f}
                  className={`rounded-full border px-3 py-1 ${
                    i === 0 ? "border-[#6f6cff] bg-[#3834ad]" : "border-[#2a3d66] bg-[#071229]"
                  }`}
                >
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-2.5">
              {previewRows.map((r) => (
                <div key={r.title} className="rounded-2xl border border-[#1d2f52] bg-[#071327] p-3.5 shadow-[inset_0_1px_0_rgba(140,167,220,0.1)]">
                  <div className="grid items-center gap-3 md:grid-cols-[1.8fr_auto_1fr]">
                    <div className="min-w-0">
                      <p className="truncate text-[18px] font-medium leading-snug">{r.title}</p>
                      <p className="truncate text-[13px] text-[#95a4ca]">{r.subtitle}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-1 text-[11px] ${r.statusClass}`}>{r.status}</span>
                    <div className="grid grid-cols-2 gap-4 text-right">
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[#7f90b7]">Продано</p>
                        <p className="text-[16px] font-medium leading-tight">{r.sold}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-wide text-[#7f90b7]">Выручка</p>
                        <p className="text-[16px] font-medium leading-tight">{r.revenue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-[1.24fr_1fr]">
          <div className="rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
            <h3 className="text-[44px] font-semibold leading-tight">Быстрый вход в страницы проекта</h3>
            <p className="text-[18px] text-[#93a3cb]">Откройте ключевые страницы платформы одним кликом</p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              {quickAccessCards.map((card) => (
                <Link
                  key={card.title}
                  to={card.route}
                  className={`group rounded-2xl border border-[#2a3f68] bg-gradient-to-b ${card.glow} p-4 shadow-[inset_0_1px_0_rgba(164,186,243,0.14)] transition hover:border-[#4a69a6]`}
                >
                  <div className={`inline-flex rounded-lg border p-2 ${card.iconWrap}`}>
                    <Users className="h-4 w-4" />
                  </div>
                  <p className="mt-2 text-[17px] font-medium leading-snug">{card.title}</p>
                  <p className="mt-1 text-[13px] leading-[1.4] text-[#b3c0df]">{card.description}</p>
                  <ArrowRight className="mt-3 h-4 w-4 text-[#95a9da] transition group-hover:translate-x-1" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
            <h3 className="text-[44px] font-semibold leading-tight">Демо-инструменты</h3>
            <p className="text-[18px] text-[#93a3cb]">Инструменты для управления демо-средой и загрузки типовых данных</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <button
                onClick={runReset}
                className="rounded-2xl border border-[#31456f] bg-gradient-to-b from-[#311450]/35 to-[#08142e] p-4 text-left shadow-[inset_0_1px_0_rgba(174,125,245,0.2)]"
              >
                <div className="inline-flex rounded-lg border border-[#9445d9]/40 bg-[#812eb6]/20 p-2">
                  <RefreshCw className="h-4 w-4 text-[#c997ff]" />
                </div>
                <p className="mt-2 text-[28px] leading-tight">Сбросить демо</p>
                <p className="text-[14px] leading-snug text-[#b7c5e1]">Очистить текущее демо и вернуть систему к базовому состоянию</p>
              </button>
              <button
                onClick={runGenerate}
                className="rounded-2xl border border-[#31456f] bg-gradient-to-b from-[#0f345f]/40 to-[#08142e] p-4 text-left shadow-[inset_0_1px_0_rgba(109,194,255,0.2)]"
              >
                <div className="inline-flex rounded-lg border border-[#3c82d6]/40 bg-[#245aa3]/20 p-2">
                  <Database className="h-4 w-4 text-[#6dc2ff]" />
                </div>
                <p className="mt-2 text-[28px] leading-tight">Загрузить mock-данные</p>
                <p className="text-[14px] leading-snug text-[#b7c5e1]">Загрузить типовые данные по мероприятиям, билетам и пользователям</p>
              </button>
              <button
                onClick={runScenario}
                className="rounded-2xl border border-[#31456f] bg-gradient-to-b from-[#134b44]/35 to-[#08142e] p-4 text-left shadow-[inset_0_1px_0_rgba(103,223,183,0.2)]"
              >
                <div className="inline-flex rounded-lg border border-[#3cae87]/40 bg-[#228565]/20 p-2">
                  <Play className="h-4 w-4 text-[#67dfb7]" />
                </div>
                <p className="mt-2 text-[28px] leading-tight">Запустить demo-сценарий</p>
                <p className="text-[14px] leading-snug text-[#b7c5e1]">Запустить готовый сценарий работы системы с типовыми данными</p>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
          <h3 className="text-[46px] font-semibold leading-tight">Откройте каждую сторону платформы</h3>
          <p className="text-[18px] text-[#93a3cb]">Перед вами ключевые модули и сценарии, через которые платформа работает для всех участников рынка</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {platformTiles.map((t) => {
              const Icon = t.icon;
              return (
                <div
                  key={t.title}
                  className={`rounded-2xl border border-[#2b3f65] bg-gradient-to-br ${t.cardTint} p-4 shadow-[inset_0_1px_0_rgba(138,162,216,0.12)]`}
                >
                  <div className={`inline-flex rounded-lg border p-2 ${t.iconTint}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="mt-3 text-[19px] leading-snug">{t.title}</p>
                  <p className="mt-2 text-[14px] leading-snug text-[#afbddf]">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
            <h3 className="text-[42px] font-semibold leading-tight">Единая система для рынка мероприятий</h3>
            <ul className="mt-4 space-y-3 text-[16px] leading-snug text-[#d5dff6]">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8ca6ff]" />
                <span>Регистрировать — единый учёт мероприятий, организаторов и площадок</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8ca6ff]" />
                <span>Координировать — работу регулятора, организаторов и каналов продаж</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8ca6ff]" />
                <span>Контролировать — продажи, возвраты, статусы и операции в одном окне</span>
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#8ca6ff]" />
                <span>Анализировать — прозрачную отчётность по рынку и мероприятиям</span>
              </li>
            </ul>
            <div className="mt-5 rounded-2xl border border-[#2d3f66] bg-[radial-gradient(circle_at_center,rgba(126,90,255,0.35),rgba(6,16,34,0.3)_45%,rgba(6,16,34,1)_80%)] p-10 text-center">
              <Shield className="mx-auto h-10 w-10 text-[#d5c2ff]" />
            </div>
          </div>
          <div className="rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
            <h3 className="text-[42px] font-semibold leading-tight">Всё необходимое в одной платформе</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-[16px] leading-snug">
              {[
                "Реестр мероприятий",
                "Роли и доступы",
                "Билеты и продажи",
                "Интеграции",
                "Отчётность",
                "История действий",
              ].map((item) => (
                <div key={item} className="rounded-xl border border-[#31456f] bg-[#06142e] p-3">
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-4 grid grid-cols-1 gap-3 rounded-2xl border border-[#1d3053] bg-[#040e23] p-4 md:grid-cols-5">
          {metrics.map((m) => (
            <div key={m} className="rounded-xl border border-[#2b3f65] bg-[#07142b] px-4 py-3 text-center">
              <Gauge className="mx-auto h-5 w-5 text-[#94abdf]" />
              <p className="mt-1 text-[38px] font-semibold leading-tight">{m.split(" ")[0]}</p>
              <p className="text-[14px] text-[#b7c5e4]">{m.replace(`${m.split(" ")[0]} `, "")}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[44px] font-semibold leading-tight">Типовые сценарии в демо</h3>
              <p className="text-[18px] text-[#93a3cb]">Примеры событий и форматов, которые проходят через платформу</p>
            </div>
            <button className="rounded-xl border border-[#5a6eb2] bg-[#3a4dbd] px-5 py-2.5 text-[14px]">Смотреть все сценарии</button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            {scenarios.map((s) => (
              <div key={s} className="overflow-hidden rounded-2xl border border-[#2d4068] bg-[#071428]">
                <div className="h-24 bg-[linear-gradient(130deg,#5f2bff,#1e81ff,#39a2c5)]" />
                <div className="p-4">
                  <span className="rounded-full border border-[#6f7fcf] bg-[#273d87] px-2 py-1 text-xs">Сценарий</span>
                  <p className="mt-2 text-[19px] leading-tight">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#435fb9] bg-[radial-gradient(circle_at_85%_20%,rgba(141,91,255,0.45),rgba(33,64,153,0.35)_35%,rgba(7,18,45,0.9)_75%)] px-8 py-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h3 className="text-[40px] font-semibold leading-tight">Готовы посмотреть платформу в действии?</h3>
              <p className="text-[18px] text-[#c8d2ef]">Откройте демо и посмотрите, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе</p>
            </div>
            <button className="rounded-xl bg-[#4f74ff] px-8 py-3 text-[20px] font-semibold">Запросить демо</button>
          </div>
        </section>

        <footer className="mt-4 rounded-2xl border border-[#1f3255] bg-[#040d22] px-6 py-4">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded" />
              <p className="text-[30px] font-semibold">CinemaLab</p>
              <p className="text-[16px] text-[#94a5cd]">Билетная платформа</p>
            </div>
            <div className="flex items-center gap-6 text-[14px] text-[#99aad0]">
              {navItems.map((item) => (
                <a href="#" key={item}>
                  {item}
                </a>
              ))}
            </div>
            <p className="text-[14px] text-[#7184b4]">© 2025 CinemaLab.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
