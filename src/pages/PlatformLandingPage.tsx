import React from "react";
import {
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
    glow: "from-fuchsia-500/16 via-purple-500/8 to-transparent",
    iconWrap: "border-fuchsia-400/45 bg-fuchsia-500/18 text-fuchsia-200",
  },
  {
    title: "Центр управления",
    description: "Контроль мероприятий, лицензий, билетов, данных и процессов",
    route: "/admin",
    glow: "from-blue-500/16 via-cyan-500/8 to-transparent",
    iconWrap: "border-blue-400/45 bg-blue-500/18 text-blue-200",
  },
  {
    title: "Кабинет реселлера",
    description: "Работа с мероприятиями, билетами и каналами распространения",
    route: "/channel",
    glow: "from-emerald-500/16 via-teal-500/8 to-transparent",
    iconWrap: "border-emerald-400/45 bg-emerald-500/18 text-emerald-200",
  },
  {
    title: "B2C Афиша",
    description: "Публичная витрина мероприятий, поиск событий и покупка билетов",
    route: "/demo",
    glow: "from-purple-500/16 via-pink-500/8 to-transparent",
    iconWrap: "border-purple-400/45 bg-purple-500/18 text-purple-200",
  },
];

const platformTiles = [
  {
    title: "Лицензирование мероприятий",
    desc: "Согласование мероприятия, организатора и площадки",
    icon: Shield,
    cardTint: "from-fuchsia-500/16 to-transparent",
    iconTint: "text-fuchsia-200 border-fuchsia-400/35 bg-fuchsia-500/12",
  },
  {
    title: "Реестр мероприятий",
    desc: "Карточки, статусы, параметры и история",
    icon: CalendarCheck2,
    cardTint: "from-blue-500/16 to-transparent",
    iconTint: "text-blue-200 border-blue-400/35 bg-blue-500/12",
  },
  {
    title: "Билеты и продажи",
    desc: "Выпуск, реализация, возвраты и учёт",
    icon: Ticket,
    cardTint: "from-amber-500/16 to-transparent",
    iconTint: "text-amber-200 border-amber-400/35 bg-amber-500/12",
  },
  {
    title: "Отчётность",
    desc: "Показатели, выгрузки и контрольные формы",
    icon: ClipboardList,
    cardTint: "from-indigo-500/16 to-transparent",
    iconTint: "text-indigo-200 border-indigo-400/35 bg-indigo-500/12",
  },
  {
    title: "Аналитика",
    desc: "Мониторинг продаж и операционных показателей",
    icon: BarChart3,
    cardTint: "from-orange-500/16 to-transparent",
    iconTint: "text-orange-200 border-orange-400/35 bg-orange-500/12",
  },
  {
    title: "Интеграции",
    desc: "Кассы, сайты, внешние системы и API",
    icon: Link2,
    cardTint: "from-emerald-500/16 to-transparent",
    iconTint: "text-emerald-200 border-emerald-400/35 bg-emerald-500/12",
  },
];

const metrics = ["30K+ событий", "25M+ билетов учтено", "12M+ посетителей", "2.1K+ участников рынка", "99.9% доступность платформы"];

const scenarios = [
  { title: "Музыкальный фестиваль", tag: "Фестиваль", gradient: "from-fuchsia-600 via-violet-500 to-indigo-500" },
  { title: "Деловой форум", tag: "Форум", gradient: "from-blue-700 via-cyan-600 to-sky-500" },
  { title: "Спортивное событие", tag: "Спорт", gradient: "from-emerald-700 via-teal-600 to-cyan-600" },
  { title: "Выставочный проект", tag: "Выставка", gradient: "from-amber-700 via-orange-500 to-yellow-500" },
];

const previewRows = [
  {
    title: "Большой летний фестиваль",
    subtitle: "Фестиваль · Москва",
    status: "Лицензия выдана",
    statusClass: "text-emerald-200 bg-emerald-500/20 border-emerald-400/45",
    sold: "45 320",
    revenue: "124 560 000 ₽",
  },
  {
    title: "Международный форум",
    subtitle: "Форум · Санкт-Петербург",
    status: "На рассмотрении",
    statusClass: "text-amber-100 bg-amber-500/20 border-amber-300/35",
    sold: "8 750",
    revenue: "18 900 000 ₽",
  },
  {
    title: "Чемпионат России",
    subtitle: "Спорт · Казань",
    status: "Черновик",
    statusClass: "text-slate-200 bg-slate-500/20 border-slate-300/35",
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
    <div className="min-h-screen bg-[#020713] text-white">
      <Sonner
        toastOptions={{
          style: { background: "#071125", border: "1px solid rgba(124,148,194,0.3)", color: "#fff" },
        }}
      />

      <div
        className="pointer-events-none fixed inset-0"
        style={{
          background:
            "radial-gradient(circle at 14% 6%, rgba(129,82,255,0.34), transparent 34%), radial-gradient(circle at 78% 12%, rgba(35,109,255,0.22), transparent 40%), radial-gradient(circle at 52% 46%, rgba(163,67,255,0.12), transparent 43%), radial-gradient(circle at 70% 78%, rgba(44,164,255,0.09), transparent 35%), linear-gradient(180deg, #02040f 0%, #040b1d 52%, #020611 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1450px] px-4 pb-8 pt-3 lg:px-6">
        <header className="rounded-2xl border border-[#253862]/90 bg-[#050f25]/86 px-5 py-3 backdrop-blur-2xl shadow-[inset_0_1px_0_rgba(170,194,255,0.1),0_10px_30px_rgba(2,7,18,0.5)] lg:px-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex min-w-0 items-center gap-2.5">
              <img src={platformLogo} alt="CinemaLab logo" className="h-6 w-6 rounded object-cover" />
              <p className="text-[13px] font-semibold leading-none tracking-wide text-[#f6f8ff]">CinemaLab</p>
              <p className="text-[10px] font-medium text-[#8e9ec6]">Билетная платформа</p>
            </div>
            <nav className="flex items-center gap-5 text-[10px] font-medium text-[#b7c4e8] lg:text-[11px]">
              {navItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-white">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className="mt-3 grid gap-3 lg:grid-cols-[1.06fr_1.34fr]">
          <div className="relative overflow-hidden rounded-[22px] border border-[#33497d]/90 bg-[linear-gradient(162deg,rgba(8,21,50,0.95)_0%,rgba(4,12,34,0.98)_66%)] p-6 shadow-[0_42px_100px_rgba(6,16,42,0.62),inset_0_1px_0_rgba(173,196,255,0.15)] lg:p-7">
            <div className="absolute -left-20 top-12 h-52 w-52 rounded-full bg-violet-600/36 blur-3xl" />
            <div className="absolute right-0 top-8 h-44 w-44 rounded-full bg-indigo-500/28 blur-3xl" />
            <div className="absolute -bottom-8 left-1/3 h-36 w-36 rounded-full bg-cyan-500/14 blur-3xl" />
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-violet-500/20 via-transparent to-blue-500/16" />
            <span className="inline-flex rounded-lg border border-[#57699b] bg-[#132345]/90 px-3 py-1 text-[10px] font-semibold tracking-wide text-[#c0cdf0] shadow-[inset_0_1px_0_rgba(210,222,255,0.24),0_10px_20px_rgba(6,14,34,0.32)]">Билетная платформа</span>
            <h1 className="mt-4 text-[50px] font-semibold leading-[0.95] tracking-[-0.02em] lg:text-[60px]">
              Единая платформа
              <br />
              управления
              <br />
              <span className="bg-gradient-to-r from-[#bb83ff] via-[#9a70ff] to-[#6f91ff] bg-clip-text text-transparent">мероприятиями</span>
              <br />и билетами
            </h1>
            <p className="mt-5 max-w-[560px] text-[11px] leading-[1.6] text-[#c6d2ee] lg:text-[12px]">
              Демо-портал показывает, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе: управляют мероприятиями, ведут билеты, контролируют продажи, получают отчётность и видят общую картину рынка.
            </p>
            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {["Единый реестр мероприятий", "Единый реестр билетов", "Отчётность и контроль"].map((item) => (
                <div key={item} className="rounded-xl border border-[#3a5284]/90 bg-[linear-gradient(180deg,rgba(15,33,67,0.9),rgba(8,20,46,0.97))] px-2.5 py-2.5 shadow-[inset_0_1px_0_rgba(177,200,255,0.2),0_14px_26px_rgba(6,14,34,0.46)]">
                  <div className="inline-flex rounded-md border border-[#4e6aa9] bg-[#122953] p-1.5 shadow-[inset_0_1px_0_rgba(199,217,255,0.32)]">
                    <Layers3 className="h-3.5 w-3.5 text-[#9cb0e7]" />
                  </div>
                  <p className="mt-2 text-[10px] leading-[1.34] text-[#ecf1ff] lg:text-[11px]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative overflow-hidden rounded-[22px] border border-[#365296]/90 bg-[linear-gradient(155deg,rgba(7,19,45,0.98),rgba(5,14,34,0.99))] p-4 shadow-[0_0_120px_rgba(97,98,255,0.26),inset_0_1px_0_rgba(162,186,255,0.16)] lg:p-5">
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-violet-500/22 via-indigo-500/8 to-cyan-500/18" />
            <div className="absolute -right-8 top-16 h-28 w-28 rounded-full bg-fuchsia-500/18 blur-3xl" />
            <div className="relative flex items-start justify-between gap-3">
              <div>
                <h2 className="text-[22px] font-semibold leading-tight tracking-[-0.01em] lg:text-[24px]">Лицензирование</h2>
                <p className="mt-1 text-[10px] leading-snug text-[#afbddf] lg:text-[11px]">Лицензирование мероприятий, организаторов, площадок</p>
              </div>
              <button className="rounded-md border border-[#8e7dff]/50 bg-gradient-to-r from-[#5e42ff] via-[#7a4eff] to-[#b55eff] px-2.5 py-1 text-[9px] font-semibold shadow-[0_10px_24px_rgba(132,94,255,0.5)]">
                Добавить мероприятие
              </button>
            </div>
            <div className="relative mt-3 flex flex-wrap gap-1.5 text-[9px] lg:text-[10px]">
              {["Все", "Концерты", "Фестивали", "Форумы", "Спорт", "Выставки"].map((f, i) => (
                <span key={f} className={`rounded-full border px-2.5 py-0.5 ${i === 0 ? "border-[#8783ff] bg-[#4742cf] text-white shadow-[0_0_20px_rgba(96,95,255,0.45)]" : "border-[#355086] bg-[#0a1a39] text-[#c8d4f3]"}`}>
                  {f}
                </span>
              ))}
            </div>
            <div className="relative mt-3 space-y-2.5">
              {previewRows.map((r) => (
                <div key={r.title} className="rounded-xl border border-[#345082] bg-[linear-gradient(165deg,rgba(10,28,56,0.94),rgba(6,18,39,0.98))] p-2.5 shadow-[inset_0_1px_0_rgba(171,195,248,0.16),0_16px_30px_rgba(6,14,35,0.5)]">
                  <div className="grid items-center gap-2.5 md:grid-cols-[auto_1.7fr_auto_1fr]">
                    <div className="relative h-10 w-16 overflow-hidden rounded-md border border-[#4b6db0] bg-gradient-to-br from-[#962fff] via-[#335dff] to-[#23b1d7] shadow-[0_8px_18px_rgba(69,109,255,0.42)]">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.24),transparent_35%),linear-gradient(180deg,transparent,rgba(3,8,23,0.5))]" />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-[10px] font-medium leading-snug text-[#edf2ff] lg:text-[11px]">{r.title}</p>
                      <p className="truncate text-[9px] text-[#a7b6db] lg:text-[10px]">{r.subtitle}</p>
                    </div>
                    <span className={`rounded-full border px-2.5 py-0.5 text-[8px] font-medium shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] lg:text-[9px] ${r.statusClass}`}>{r.status}</span>
                    <div className="grid grid-cols-2 gap-2.5 text-right">
                      <div>
                        <p className="text-[8px] uppercase tracking-wide text-[#7f90b7]">Продано билетов</p>
                        <p className="text-[10px] font-semibold leading-tight text-[#eef3ff] lg:text-[11px]">{r.sold}</p>
                      </div>
                      <div>
                        <p className="text-[8px] uppercase tracking-wide text-[#7f90b7]">Выручка</p>
                        <p className="text-[10px] font-semibold leading-tight text-[#eef3ff] lg:text-[11px]">{r.revenue}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-[1.24fr_1fr]">
          <div className="rounded-[20px] border border-[#243964]/90 bg-[linear-gradient(175deg,rgba(5,14,34,0.98),rgba(4,13,33,0.86))] p-4 shadow-[inset_0_1px_0_rgba(151,177,232,0.12)] lg:p-5">
            <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.01em] lg:text-[28px]">Быстрый вход в страницы проекта</h3>
            <p className="text-[10px] leading-relaxed text-[#97a8cf] lg:text-[11px]">Откройте ключевые страницы платформы одним кликом</p>
            <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-4">
              {quickAccessCards.map((card) => (
                <Link
                  key={card.title}
                  to={card.route}
                  className={`group rounded-xl border border-[#314b78] bg-gradient-to-b ${card.glow} p-3.5 shadow-[inset_0_1px_0_rgba(178,199,250,0.16),0_14px_28px_rgba(6,15,36,0.38)] transition duration-300 hover:-translate-y-0.5 hover:border-[#6a8cd0]/90`}
                >
                  <div className={`inline-flex rounded-md border p-1.5 shadow-[inset_0_1px_0_rgba(236,243,255,0.28),0_8px_16px_rgba(6,14,32,0.35)] ${card.iconWrap}`}>
                    <Users className="h-3.5 w-3.5" />
                  </div>
                  <p className="mt-2 text-[11px] font-medium leading-snug text-[#f0f4ff] lg:text-[12px]">{card.title}</p>
                  <p className="mt-1 text-[9px] leading-[1.48] text-[#b9c6e3]">{card.description}</p>
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-[20px] border border-[#243964]/90 bg-[linear-gradient(175deg,rgba(5,14,34,0.98),rgba(4,13,33,0.86))] p-4 shadow-[inset_0_1px_0_rgba(151,177,232,0.12)] lg:p-5">
            <h3 className="text-[26px] font-semibold leading-tight tracking-[-0.01em] lg:text-[28px]">Демо-инструменты</h3>
            <p className="text-[10px] leading-relaxed text-[#97a8cf] lg:text-[11px]">Инструменты для управления демо-средой и загрузки типовых данных</p>
            <div className="mt-3 grid gap-2 lg:grid-cols-3">
              <button onClick={runReset} className="rounded-xl border border-[#365280] bg-gradient-to-b from-[#311450]/28 to-[#08142e] p-3.5 text-left shadow-[inset_0_1px_0_rgba(190,149,255,0.2),0_12px_22px_rgba(6,15,36,0.34)] transition hover:border-[#7b69cf]/75">
                <div className="inline-flex rounded-md border border-[#9445d9]/45 bg-[#812eb6]/24 p-1.5 shadow-[inset_0_1px_0_rgba(227,199,255,0.24)]">
                  <RefreshCw className="h-3.5 w-3.5 text-[#c997ff]" />
                </div>
                <p className="mt-2 text-[11px] font-medium leading-tight text-[#f0f3ff] lg:text-[12px]">Сбросить демо</p>
                <p className="text-[9px] leading-[1.44] text-[#b7c5e1]">Очистить текущее демо и вернуть систему к базовому состоянию</p>
              </button>
              <button onClick={runGenerate} className="rounded-xl border border-[#365280] bg-gradient-to-b from-[#0f345f]/34 to-[#08142e] p-3.5 text-left shadow-[inset_0_1px_0_rgba(145,208,255,0.22),0_12px_22px_rgba(6,15,36,0.34)] transition hover:border-[#6297d4]/75">
                <div className="inline-flex rounded-md border border-[#3c82d6]/45 bg-[#245aa3]/24 p-1.5 shadow-[inset_0_1px_0_rgba(201,230,255,0.22)]">
                  <Database className="h-3.5 w-3.5 text-[#6dc2ff]" />
                </div>
                <p className="mt-2 text-[11px] font-medium leading-tight text-[#f0f3ff] lg:text-[12px]">Загрузить mock-данные</p>
                <p className="text-[9px] leading-[1.44] text-[#b7c5e1]">Загрузить типовые данные по мероприятиям, билетам и пользователям</p>
              </button>
              <button onClick={runScenario} className="rounded-xl border border-[#365280] bg-gradient-to-b from-[#134b44]/26 to-[#08142e] p-3.5 text-left shadow-[inset_0_1px_0_rgba(143,233,203,0.2),0_12px_22px_rgba(6,15,36,0.34)] transition hover:border-[#68bda2]/75">
                <div className="inline-flex rounded-md border border-[#3cae87]/45 bg-[#228565]/24 p-1.5 shadow-[inset_0_1px_0_rgba(204,255,236,0.22)]">
                  <Play className="h-3.5 w-3.5 text-[#67dfb7]" />
                </div>
                <p className="mt-2 text-[11px] font-medium leading-tight text-[#f0f3ff] lg:text-[12px]">Запустить demo-сценарий</p>
                <p className="text-[9px] leading-[1.44] text-[#b7c5e1]">Запустить готовый сценарий работы системы с типовыми данными</p>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-3 rounded-[20px] border border-[#1f3159]/90 bg-[linear-gradient(175deg,rgba(4,14,34,0.98),rgba(4,13,33,0.86))] p-4 lg:p-5">
          <h3 className="text-[25px] font-semibold leading-tight lg:text-[27px]">Откройте каждую сторону платформы</h3>
          <p className="text-[10px] text-[#93a3cb] lg:text-[11px]">Перед вами ключевые модули и сценарии, через которые платформа работает для всех участников рынка</p>
          <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-3 lg:grid-cols-6">
            {platformTiles.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className={`rounded-xl border border-[#2b3f65]/90 bg-gradient-to-br ${t.cardTint} p-3 shadow-[inset_0_1px_0_rgba(138,162,216,0.12),0_10px_20px_rgba(5,13,30,0.26)]`}>
                  <div className={`inline-flex rounded-md border p-1.5 ${t.iconTint}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <p className="mt-2 text-[12px] font-medium leading-snug">{t.title}</p>
                  <p className="mt-1 text-[9px] leading-snug text-[#afbddf]">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-3 grid gap-3 lg:grid-cols-2">
          <div className="rounded-[20px] border border-[#1f3159]/90 bg-[linear-gradient(172deg,rgba(4,14,34,0.98),rgba(4,13,33,0.86))] p-4 lg:p-5">
            <h3 className="text-[24px] font-semibold leading-tight lg:text-[26px]">Единая система для рынка мероприятий</h3>
            <ul className="mt-3 space-y-2 text-[10px] leading-snug text-[#d5dff6] lg:text-[11px]">
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ca6ff]" />
                <span>Регистрировать — единый учёт мероприятий, организаторов и площадок</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ca6ff]" />
                <span>Координировать — работу регулятора, организаторов и каналов продаж</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ca6ff]" />
                <span>Контролировать — продажи, возвраты, статусы и операции в одном окне</span>
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#8ca6ff]" />
                <span>Анализировать — прозрачную отчётность по рынку и мероприятиям</span>
              </li>
            </ul>
            <div className="mt-4 rounded-xl border border-[#2d3f66] bg-[radial-gradient(circle_at_center,rgba(126,90,255,0.45),rgba(6,16,34,0.3)_45%,rgba(6,16,34,1)_80%)] p-7 text-center shadow-[0_22px_45px_rgba(70,84,188,0.36)]">
              <Shield className="mx-auto h-7 w-7 text-[#d5c2ff]" />
            </div>
          </div>
          <div className="rounded-[20px] border border-[#1f3159]/90 bg-[linear-gradient(172deg,rgba(4,14,34,0.98),rgba(4,13,33,0.86))] p-4 lg:p-5">
            <h3 className="text-[24px] font-semibold leading-tight lg:text-[26px]">Всё необходимое в одной платформе</h3>
            <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] leading-snug lg:text-[11px]">
              {["Реестр мероприятий", "Роли и доступы", "Билеты и продажи", "Интеграции", "Отчётность", "История действий"].map((item) => (
                <div key={item} className="rounded-lg border border-[#31456f]/90 bg-[#06142e]/90 p-2.5">
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-3 grid grid-cols-1 gap-2 rounded-[20px] border border-[#1f3159]/90 bg-[linear-gradient(172deg,rgba(4,14,34,0.98),rgba(4,13,33,0.86))] p-3 lg:grid-cols-5">
          {metrics.map((m) => (
            <div key={m} className="rounded-lg border border-[#2b3f65]/90 bg-[#07142b]/88 px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(132,156,219,0.12)]">
              <Gauge className="mx-auto h-4 w-4 text-[#94abdf]" />
              <p className="mt-1 text-[18px] font-semibold leading-tight">{m.split(" ")[0]}</p>
              <p className="text-[9px] text-[#b7c5e4]">{m.replace(`${m.split(" ")[0]} `, "")}</p>
            </div>
          ))}
        </section>

        <section className="mt-3 rounded-[20px] border border-[#1f3159]/90 bg-[linear-gradient(172deg,rgba(4,14,34,0.98),rgba(4,13,33,0.86))] p-4 lg:p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-semibold leading-tight lg:text-[26px]">Типовые сценарии в демо</h3>
              <p className="text-[10px] text-[#93a3cb] lg:text-[11px]">Примеры событий и форматов, которые проходят через платформу</p>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-1 gap-2.5 md:grid-cols-4">
            {scenarios.map((s) => (
              <div key={s.title} className="overflow-hidden rounded-xl border border-[#2d4068]/90 bg-[#071428]/95 shadow-[0_14px_24px_rgba(6,13,30,0.36)]">
                <div className={`h-16 bg-gradient-to-r ${s.gradient}`} />
                <div className="p-3">
                  <span className="rounded-full border border-[#6f7fcf] bg-[#273d87] px-2 py-0.5 text-[8px] uppercase tracking-wide">{s.tag}</span>
                  <p className="mt-2 text-[12px] font-medium leading-tight">{s.title}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-3 rounded-[20px] border border-[#4662ba]/90 bg-[radial-gradient(circle_at_85%_20%,rgba(141,91,255,0.5),rgba(33,64,153,0.35)_35%,rgba(7,18,45,0.9)_75%)] px-5 py-4 shadow-[0_22px_50px_rgba(71,86,190,0.45)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[24px] font-semibold leading-tight lg:text-[26px]">Готовы посмотреть платформу в действии?</h3>
              <p className="text-[10px] text-[#c8d2ef] lg:text-[11px]">Откройте демо и посмотрите, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе</p>
            </div>
            <button className="rounded-lg bg-[#4f74ff] px-4 py-2 text-[11px] font-semibold shadow-[0_12px_24px_rgba(85,117,255,0.5)]">Запросить демо</button>
          </div>
        </section>

        <footer className="mt-3 rounded-[20px] border border-[#1f3255]/90 bg-[#040d22]/90 px-4 py-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <img src={platformLogo} alt="CinemaLab" className="h-5 w-5 rounded" />
              <p className="text-[12px] font-semibold">CinemaLab</p>
              <p className="text-[10px] text-[#94a5cd]">Билетная платформа</p>
            </div>
            <div className="flex items-center gap-4 text-[9px] text-[#99aad0] lg:text-[10px]">
              {navItems.map((item) => (
                <a href="#" key={item}>
                  {item}
                </a>
              ))}
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
