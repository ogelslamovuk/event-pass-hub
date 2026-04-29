import { ArrowRight, Building2, ClipboardCheck, Play, RefreshCcw, ShieldCheck, Store, Ticket } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { useStorageSync } from "@/hooks/useStorageSync";
import { generateDemoData, resetDemoData, runDemoScenario } from "@/lib/demoEngine";
import platformLogo from "../../logo.jpg";

const shellBackground =
  "radial-gradient(circle at 18% 10%, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at 42% 12%, rgba(168,85,247,0.18), transparent 20%), radial-gradient(circle at 84% 86%, rgba(59,130,246,0.14), transparent 20%), linear-gradient(180deg, #020611 0%, #040b18 48%, #020611 100%)";

const panelBase = {
  background: "linear-gradient(180deg, rgba(8,15,28,0.96) 0%, rgba(5,11,22,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.36)",
};

export default function ProtoPage() {
  const { setState } = useStorageSync();

  const quickCards = [
    { title: "Кабинет организатора", desc: "Управление мероприятиями, билетами и продажами", to: "/organizer", icon: Building2 },
    { title: "Центр управления", desc: "Контроль мероприятий, лицензий, билетов, данных и процессов", to: "/admin", icon: ShieldCheck },
    { title: "Кабинет реселлера", desc: "Работа с мероприятиями, билетами и каналами распространения", to: "/channel", icon: Store },
    { title: "B2C Афиша", desc: "Публичная витрина мероприятий, поиск событий и покупка билетов", to: "/demo", icon: Ticket },
  ];

  const tools = [
    { title: "Сбросить демо", desc: "Очистить текущие данные и вернуть систему к базовому состоянию", icon: RefreshCcw, action: () => { setState({ ...resetDemoData() }); toast.success("Демо сброшено"); } },
    { title: "Загрузить mock-данные", desc: "Загрузить типовые данные по мероприятиям, билетам и пользователям", icon: ClipboardCheck, action: () => { setState({ ...generateDemoData() }); toast.success("Mock-данные загружены"); } },
    { title: "Запустить demo-сценарий", desc: "Запустить готовый сценарий работы системы с типовыми данными", icon: Play, action: () => { setState({ ...runDemoScenario() }); toast.success("Demo-сценарий запущен"); } },
  ];

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <Sonner toastOptions={{ style: { background: "rgba(7, 13, 24, 0.96)", border: "1px solid rgba(255,255,255,0.08)", color: "#ffffff" } }} />
      <div className="pointer-events-none fixed inset-0" style={{ background: shellBackground }} />
      <div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-4 md:px-6 xl:px-8">
        <header className="rounded-[26px] px-5 py-4 md:px-7" style={panelBase}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3"><img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded-lg object-cover" /><div className="flex min-w-0 items-center gap-3"><span className="text-[17px] font-semibold">CinemaLab</span><span className="text-[14px] text-[rgba(203,213,225,0.72)]">Прототип платформы</span></div></div>
            <Link to="/main" className="inline-flex items-center gap-2 rounded-[14px] border px-4 py-2 text-[14px] font-medium" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(90deg, #4F7BFF 0%, #B059FF 100%)" }}>К описанию проекта <ArrowRight size={16} /></Link>
          </div>
        </header>

        <section className="mt-6 rounded-[34px] px-6 py-7 md:px-8 md:py-9" style={panelBase}>
          <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] md:text-[48px]">Инструменты прототипа</h1>
          <p className="mt-5 text-[16px] leading-8 text-[rgba(213,223,246,0.82)] md:text-[18px]">Быстрый вход в основные роли и демо-инструменты платформы.</p>
          <div className="mt-6 flex flex-wrap gap-3">{["Демо-среда", "Быстрый вход", "Тестовые данные"].map((c) => <span key={c} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: "rgba(255,255,255,0.1)" }}>{c}</span>)}</div>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">Быстрый вход</h2><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">{quickCards.map((card) => (<Link key={card.title} to={card.to} className="rounded-[22px] border p-5 transition-all hover:-translate-y-[1px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(9,17,31,0.96) 0%, rgba(6,12,25,0.94) 100%)" }}><card.icon size={18} /><h3 className="mt-4 text-[22px] font-semibold leading-7">{card.title}</h3><p className="mt-2 leading-7 text-[rgba(203,213,225,0.78)]">{card.desc}</p></Link>))}</div></section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">Демо-инструменты</h2><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">{tools.map((tool) => (<button key={tool.title} type="button" onClick={tool.action} className="rounded-[22px] border p-5 text-left transition-all hover:-translate-y-[1px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "linear-gradient(180deg, rgba(9,17,31,0.96) 0%, rgba(6,12,25,0.94) 100%)" }}><tool.icon size={18} /><h3 className="mt-4 text-[22px] font-semibold leading-7">{tool.title}</h3><p className="mt-2 leading-7 text-[rgba(203,213,225,0.78)]">{tool.desc}</p></button>))}</div></section>
      </div>
    </div>
  );
}
