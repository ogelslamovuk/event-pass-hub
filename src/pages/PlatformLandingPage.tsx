import React from "react";
import {
  ArrowRight,
  BarChart3,
  CalendarCheck2,
  CheckCircle2,
  ClipboardList,
  Database,
  Gauge,
  Globe2,
  Layers3,
  Link2,
  Play,
  RefreshCw,
  Shield,
  ShoppingCart,
  Ticket,
  Trash2,
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
    glow: "from-fuchsia-500/20 to-indigo-500/10",
  },
  {
    title: "Центр управления",
    description: "Контроль мероприятий, лицензий, билетов, данных и процессов",
    route: "/admin",
    glow: "from-blue-500/20 to-cyan-500/10",
  },
  {
    title: "Кабинет реселлера",
    description: "Работа с мероприятиями, билетами и каналами распространения",
    route: "/channel",
    glow: "from-emerald-500/20 to-teal-500/10",
  },
  {
    title: "B2C Афиша",
    description: "Публичная витрина мероприятий, поиск событий и покупка билетов",
    route: "/demo",
    glow: "from-purple-500/20 to-pink-500/10",
  },
];

const platformTiles = [
  { title: "Лицензирование мероприятий", desc: "Согласование мероприятия, организатора и площадки", icon: Shield },
  { title: "Реестр мероприятий", desc: "Карточки, статусы, параметры и история", icon: CalendarCheck2 },
  { title: "Билеты и продажи", desc: "Выпуск, реализация, возвраты и учёт", icon: Ticket },
  { title: "Отчётность", desc: "Показатели, выгрузки и контрольные формы", icon: ClipboardList },
  { title: "Аналитика", desc: "Мониторинг продаж и операционных показателей", icon: BarChart3 },
  { title: "Интеграции", desc: "Кассы, сайты, внешние системы и API", icon: Link2 },
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

      <div className="fixed inset-0 pointer-events-none opacity-90" style={{ background: "radial-gradient(circle at 20% 15%, rgba(68,88,255,0.22), transparent 42%), radial-gradient(circle at 80% 90%, rgba(176,67,255,0.22), transparent 45%), linear-gradient(180deg, #020617 0%, #030a1d 100%)" }} />

      <div className="relative mx-auto max-w-[1420px] px-5 pb-8 pt-5 md:px-7">
        <header className="rounded-2xl border border-[#243352] bg-[#040d22]/90 px-5 py-4 backdrop-blur-xl md:px-6">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center gap-3 min-w-0">
              <img src={platformLogo} alt="CinemaLab logo" className="h-9 w-9 rounded-md object-cover" />
              <p className="text-3xl font-semibold leading-none">CinemaLab</p>
              <p className="ml-2 text-sm text-[#98a6c9]">Билетная платформа</p>
            </div>
            <nav className="flex items-center gap-8 text-[15px] text-[#d6def5]">
              {navItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-white">
                  {item}
                </a>
              ))}
            </nav>
          </div>
        </header>

        <section className="mt-5 grid gap-4 lg:grid-cols-[1.02fr_1.38fr]">
          <div className="rounded-3xl border border-[#213356] bg-[#020b1f]/90 p-8">
            <span className="inline-flex rounded-xl border border-[#49506f] bg-[#121c37] px-4 py-1 text-lg text-[#a9b4d9]">Билетная платформа</span>
            <h1 className="mt-5 text-[66px] leading-[1.02] font-semibold tracking-tight">
              Единая платформа
              <br />
              управления
              <br />
              <span className="text-[#9658ff]">мероприятиями</span>
              <br />и билетами
            </h1>
            <p className="mt-5 max-w-[760px] text-[26px] leading-[1.45] text-[#c7d1ee]">
              Демо-портал показывает, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе: управляют мероприятиями, ведут билеты, контролируют продажи, получают отчётность и видят общую картину рынка.
            </p>
            <div className="mt-8 grid grid-cols-3 gap-4">
              {["Единый реестр мероприятий", "Единый реестр билетов", "Отчётность и контроль"].map((item) => (
                <div key={item} className="rounded-2xl border border-[#2e426a] bg-[#07122b] p-4">
                  <Layers3 className="h-5 w-5 text-[#7b8ec4]" />
                  <p className="mt-2 text-[28px] leading-tight text-[#e7eeff]">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-[#29407a] bg-[#020c20]/95 p-6 shadow-[0_0_80px_rgba(106,77,255,0.25)]">
            <h2 className="text-[48px] font-semibold">Лицензирование</h2>
            <p className="text-[25px] text-[#adbbde]">Лицензирование мероприятий, организаторов, площадок</p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm">
              {["Все", "Концерты", "Фестивали", "Форумы", "Спорт", "Выставки"].map((f, i) => (
                <span key={f} className={`rounded-full border px-3 py-1 ${i === 0 ? "border-[#6f6cff] bg-[#3834ad]" : "border-[#2a3d66] bg-[#071229]"}`}>
                  {f}
                </span>
              ))}
            </div>
            <div className="mt-4 space-y-3">
              {previewRows.map((r) => (
                <div key={r.title} className="rounded-2xl border border-[#1d2f52] bg-[#071327] p-4">
                  <div className="grid items-center gap-3 md:grid-cols-[1.6fr_auto_auto]">
                    <div>
                      <p className="text-[27px] font-medium">{r.title}</p>
                      <p className="text-[20px] text-[#95a4ca]">{r.subtitle}</p>
                    </div>
                    <span className={`rounded-full border px-3 py-1 text-sm ${r.statusClass}`}>{r.status}</span>
                    <div className="grid grid-cols-2 gap-5 text-right">
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#7f90b7]">Продано билетов:</p>
                        <p className="text-[24px]">{r.sold}</p>
                      </div>
                      <div>
                        <p className="text-xs uppercase tracking-wide text-[#7f90b7]">Выручка:</p>
                        <p className="text-[24px]">{r.revenue}</p>
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
            <h3 className="text-[48px] font-semibold">Быстрый вход в страницы проекта</h3>
            <p className="text-[23px] text-[#93a3cb]">Откройте ключевые страницы платформы одним кликом</p>
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
              {quickAccessCards.map((card) => (
                <Link key={card.title} to={card.route} className={`rounded-2xl border border-[#2c3f66] bg-gradient-to-b ${card.glow} p-4`}>
                  <Users className="h-6 w-6 text-[#9eb7ff]" />
                  <p className="mt-2 text-[29px] leading-tight">{card.title}</p>
                  <p className="mt-1 text-[19px] leading-snug text-[#b3c0df]">{card.description}</p>
                  <ArrowRight className="mt-4 h-5 w-5 text-[#95a9da]" />
                </Link>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
            <h3 className="text-[48px] font-semibold">Демо-инструменты</h3>
            <p className="text-[23px] text-[#93a3cb]">Инструменты для управления демо-средой и загрузки типовых данных</p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              <button onClick={runReset} className="rounded-2xl border border-[#31456f] bg-[#08142e] p-4 text-left">
                <RefreshCw className="h-6 w-6 text-[#c997ff]" />
                <p className="mt-2 text-[33px] leading-tight">Сбросить демо</p>
                <p className="text-[19px] text-[#b7c5e1]">Очистить текущее демо</p>
              </button>
              <button onClick={runGenerate} className="rounded-2xl border border-[#31456f] bg-[#08142e] p-4 text-left">
                <Database className="h-6 w-6 text-[#6dc2ff]" />
                <p className="mt-2 text-[33px] leading-tight">Загрузить mock-данные</p>
                <p className="text-[19px] text-[#b7c5e1]">Типовые данные по мероприятиям и билетам</p>
              </button>
              <button onClick={runScenario} className="rounded-2xl border border-[#31456f] bg-[#08142e] p-4 text-left">
                <Play className="h-6 w-6 text-[#67dfb7]" />
                <p className="mt-2 text-[33px] leading-tight">Запустить demo-сценарий</p>
                <p className="text-[19px] text-[#b7c5e1]">Готовый сценарий работы системы</p>
              </button>
            </div>
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
          <h3 className="text-[50px] font-semibold">Откройте каждую сторону платформы</h3>
          <p className="text-[23px] text-[#93a3cb]">Перед вами ключевые модули и сценарии, через которые платформа работает для всех участников рынка</p>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-3 lg:grid-cols-6">
            {platformTiles.map((t) => {
              const Icon = t.icon;
              return (
                <div key={t.title} className="rounded-2xl border border-[#2b3f65] bg-[#051027] p-4">
                  <Icon className="h-7 w-7 text-[#90a6de]" />
                  <p className="mt-3 text-[35px] leading-tight">{t.title}</p>
                  <p className="mt-2 text-[19px] leading-snug text-[#afbddf]">{t.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-4 grid gap-4 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
            <h3 className="text-[48px] font-semibold">Единая система для рынка мероприятий</h3>
            <ul className="mt-4 space-y-3 text-[21px] text-[#d5dff6]">
              <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 text-[#8ca6ff]" /><span>Регистрировать — единый учёт мероприятий, организаторов и площадок</span></li>
              <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 text-[#8ca6ff]" /><span>Координировать — работу регулятора, организаторов и каналов продаж</span></li>
              <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 text-[#8ca6ff]" /><span>Контролировать — продажи, возвраты, статусы и операции в одном окне</span></li>
              <li className="flex gap-3"><CheckCircle2 className="mt-1 h-5 w-5 text-[#8ca6ff]" /><span>Анализировать — прозрачную отчётность по рынку и мероприятиям</span></li>
            </ul>
            <div className="mt-5 rounded-2xl border border-[#2d3f66] bg-[radial-gradient(circle_at_center,rgba(126,90,255,0.35),rgba(6,16,34,0.3)_45%,rgba(6,16,34,1)_80%)] p-10 text-center">
              <Shield className="mx-auto h-10 w-10 text-[#d5c2ff]" />
            </div>
          </div>
          <div className="rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
            <h3 className="text-[48px] font-semibold">Всё необходимое в одной платформе</h3>
            <div className="mt-4 grid grid-cols-2 gap-4 text-[22px]">
              {["Реестр мероприятий", "Роли и доступы", "Билеты и продажи", "Интеграции", "Отчётность", "История действий"].map((item) => (
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
              <p className="mt-1 text-[34px] font-semibold leading-tight">{m.split(" ")[0]}</p>
              <p className="text-[18px] text-[#b7c5e4]">{m.replace(`${m.split(" ")[0]} `, "")}</p>
            </div>
          ))}
        </section>

        <section className="mt-4 rounded-2xl border border-[#1d3053] bg-[#040e23] p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-[48px] font-semibold">Типовые сценарии в демо</h3>
              <p className="text-[22px] text-[#93a3cb]">Примеры событий и форматов, которые проходят через платформу</p>
            </div>
            <button className="rounded-xl border border-[#5a6eb2] bg-[#3a4dbd] px-5 py-3 text-[19px]">Смотреть все сценарии</button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-4">
            {scenarios.map((s) => (
              <div key={s} className="overflow-hidden rounded-2xl border border-[#2d4068] bg-[#071428]">
                <div className="h-24 bg-[linear-gradient(130deg,#5f2bff,#1e81ff,#39a2c5)]" />
                <div className="p-4">
                  <span className="rounded-full border border-[#6f7fcf] bg-[#273d87] px-2 py-1 text-xs">Сценарий</span>
                  <p className="mt-2 text-[31px] leading-tight">{s}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-4 rounded-2xl border border-[#435fb9] bg-[radial-gradient(circle_at_85%_20%,rgba(141,91,255,0.45),rgba(33,64,153,0.35)_35%,rgba(7,18,45,0.9)_75%)] px-8 py-6">
          <div className="flex items-center justify-between gap-5">
            <div>
              <h3 className="text-[48px] font-semibold">Готовы посмотреть платформу в действии?</h3>
              <p className="text-[23px] text-[#c8d2ef]">Откройте демо и посмотрите, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе</p>
            </div>
            <button className="rounded-xl bg-[#4f74ff] px-8 py-4 text-[24px] font-semibold">Запросить демо</button>
          </div>
        </section>

        <footer className="mt-4 rounded-2xl border border-[#1f3255] bg-[#040d22] px-6 py-4">
          <div className="flex items-center justify-between gap-5">
            <div className="flex items-center gap-3">
              <img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded" />
              <p className="text-[34px] font-semibold">CinemaLab</p>
              <p className="text-[18px] text-[#94a5cd]">Билетная платформа</p>
            </div>
            <div className="flex items-center gap-6 text-[16px] text-[#99aad0]">
              {navItems.map((item) => (
                <a href="#" key={item}>{item}</a>
              ))}
            </div>
            <p className="text-[16px] text-[#7184b4]">© 2025 CinemaLab.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
