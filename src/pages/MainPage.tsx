import {
  ArrowDown,
  ArrowRight,
  BarChart3,
  Building2,
  ClipboardCheck,
  FileText,
  Link2,
  ShieldCheck,
  Store,
  Ticket,
  Users,
  Wallet,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import platformLogo from "../../logo.jpg";

type AccentKey = "violet" | "blue" | "indigo" | "emerald" | "amber" | "orange";

const accents: Record<AccentKey, { border: string; glow: string; color: string }> = {
  violet: { border: "rgba(192,132,252,0.40)", glow: "rgba(168,85,247,0.24)", color: "#C084FC" },
  blue: { border: "rgba(96,165,250,0.42)", glow: "rgba(59,130,246,0.24)", color: "#60A5FA" },
  indigo: { border: "rgba(129,140,248,0.40)", glow: "rgba(99,102,241,0.24)", color: "#818CF8" },
  emerald: { border: "rgba(52,211,153,0.36)", glow: "rgba(16,185,129,0.20)", color: "#34D399" },
  amber: { border: "rgba(251,191,36,0.36)", glow: "rgba(245,158,11,0.20)", color: "#FBBF24" },
  orange: { border: "rgba(251,146,60,0.36)", glow: "rgba(249,115,22,0.20)", color: "#FB923C" },
};

const shellBackground =
  "radial-gradient(circle at 12% 8%, rgba(59,130,246,0.24), transparent 28%), " +
  "radial-gradient(circle at 46% 6%, rgba(168,85,247,0.22), transparent 24%), " +
  "radial-gradient(circle at 88% 28%, rgba(99,102,241,0.20), transparent 26%), " +
  "radial-gradient(circle at 82% 86%, rgba(14,165,233,0.16), transparent 28%), " +
  "linear-gradient(180deg, #081426 0%, #06101F 42%, #020611 100%)";

const sectionPanelBase: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(13,24,43,0.96) 0%, rgba(7,14,28,0.94) 100%)",
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 28px 80px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
  borderRadius: 34,
};

const glassCardBase: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(15,27,48,0.94) 0%, rgba(8,16,32,0.92) 100%)",
  border: "1px solid rgba(255,255,255,0.10)",
  boxShadow: "0 18px 48px rgba(0,0,0,0.30), inset 0 1px 0 rgba(255,255,255,0.05)",
};

const routeStations = [
  { number: "01", title: "Допуск", subitems: ["Организатор", "Заявка", "Регулятор"], icon: ShieldCheck, accent: "violet" as const },
  { number: "02", title: "Регистрация", subitems: ["Реестр", "Мероприятие", "Билеты"], icon: FileText, accent: "blue" as const },
  { number: "03", title: "Продажа", subitems: ["Каналы продаж", "Покупатель"], icon: Store, accent: "emerald" as const },
  { number: "04", title: "Контроль и данные", subitems: ["Контроль", "Аналитика"], icon: BarChart3, accent: "indigo" as const },
];

const problemCards = [
  { title: "Разрозненные продажи", text: "Отдельные реселлеры, квоты и ручные договоренности.", icon: Store, accent: "orange" as const },
  { title: "Неполная прозрачность", text: "Государство видит рынок фрагментарно.", icon: ShieldCheck, accent: "blue" as const },
  { title: "Зависимость организатора", text: "Организатор привязан к отдельным продавцам и каналам.", icon: Building2, accent: "violet" as const },
  { title: "Потерянная ликвидность", text: "Реселлер продает не весь рынок, а ограниченные квоты.", icon: Ticket, accent: "amber" as const },
];

const circuitDomains = [
  { title: "Организаторский контур", nodes: ["Организатор", "Заявка", "Документы"], icon: Building2, accent: "violet" as const },
  { title: "Регуляторный контур", nodes: ["Рассмотрение", "Решение", "Реестр"], icon: ShieldCheck, accent: "blue" as const },
  { title: "Коммерческий контур", nodes: ["Билеты", "Каналы продаж", "Покупатель"], icon: Ticket, accent: "emerald" as const },
  { title: "Контур данных", nodes: ["Продажи", "Возвраты", "Контроль", "Аналитика"], icon: BarChart3, accent: "indigo" as const },
];

const journeySteps = [
  { number: "01", title: "Подача заявки", caption: "Организатор подает заявку на мероприятие.", icon: ClipboardCheck, accent: "violet" as const },
  { number: "02", title: "Рассмотрение", caption: "Регулятор проверяет и согласовывает.", icon: FileText, accent: "blue" as const },
  { number: "03", title: "Включение в реестр", caption: "Мероприятие получает официальный статус.", icon: ShieldCheck, accent: "indigo" as const },
  { number: "04", title: "Выпуск билетов", caption: "Билетный фонд создается в цифровой среде.", icon: Ticket, accent: "emerald" as const },
  { number: "05", title: "Подключение каналов", caption: "Реселлеры получают доступ к продаже.", icon: Link2, accent: "blue" as const },
  { number: "06", title: "Продажа покупателю", caption: "Покупатель приобретает цифровой билет.", icon: Store, accent: "violet" as const },
  { number: "07", title: "Контроль и аналитика", caption: "Система фиксирует операции и данные.", icon: BarChart3, accent: "indigo" as const },
];

const benefitCards = [
  { title: "Государство / Минкульт", text: "Прозрачность рынка, контроль в реальном времени и достоверные данные для решений.", icon: ShieldCheck, accent: "blue" as const },
  { title: "Организатор", text: "Быстрый легальный маршрут: заявка, согласование, выпуск билетов и продажи.", icon: Building2, accent: "violet" as const },
  { title: "Реселлер", text: "Больше доступных мероприятий и защищенный стандарт подключения к билетному фонду.", icon: Store, accent: "emerald" as const },
  { title: "Покупатель", text: "Понятный цифровой билет, безопасная покупка, возврат и проверка.", icon: Users, accent: "amber" as const },
];

function AccentIcon({ icon, accent, size = 18 }: { icon: LucideIcon; accent: AccentKey; size?: number }) {
  const Icon = icon;
  const palette = accents[accent];
  return <div className="flex h-11 w-11 items-center justify-center rounded-[14px] border" style={{ borderColor: palette.border, color: palette.color, background: `${palette.glow}` }}><Icon size={size} /></div>;
}
const SectionPanel = ({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) => <section className={`rounded-[34px] px-5 py-6 md:px-7 md:py-8 ${className}`} style={{ ...sectionPanelBase, ...style }}>{children}</section>;
const GlassCard = ({ children, className = "", accent }: { children: React.ReactNode; className?: string; accent?: AccentKey }) => <article className={`relative overflow-hidden rounded-[24px] border p-4 ${className}`} style={{ ...glassCardBase, borderColor: accent ? accents[accent].border : "rgba(255,255,255,0.10)" }}>{accent && <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full blur-2xl" style={{ background: accents[accent].glow }} />}<div className="relative">{children}</div></article>;

function ArrowBadge({ direction }: { direction: "right" | "down" }) {
  const Icon = direction === "right" ? ArrowRight : ArrowDown;
  return <div className="flex h-9 w-9 items-center justify-center rounded-full border" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.04)", boxShadow: "0 0 26px rgba(96,165,250,0.18)", color: "#BFDBFE" }}><Icon size={16} /></div>;
}

function RouteStation({ station }: { station: (typeof routeStations)[number] }) { const Icon = station.icon; return <GlassCard accent={station.accent} className="rounded-[24px] p-4"><div className="flex items-center justify-between"><span className="rounded-full border px-2.5 py-1 text-[11px]" style={{ borderColor: accents[station.accent].border }}>{station.number}</span><AccentIcon icon={Icon} accent={station.accent} /></div><h3 className="mt-3 text-[18px] font-semibold">{station.title}</h3><div className="mt-3 flex flex-wrap gap-2">{station.subitems.map((s)=><span key={s} className="rounded-full border px-2.5 py-1 text-[11px]" style={{ background:"rgba(255,255,255,0.04)", borderColor:"rgba(255,255,255,0.08)" }}>{s}</span>)}</div></GlassCard>; }

function EventRouteDiagram(){return <GlassCard className="rounded-[30px] p-5 md:p-6" accent="indigo"><h3 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.04em]">Маршрут события</h3><p className="mt-2 text-[13px] leading-5 text-[rgba(203,213,225,0.68)]">От допуска организатора до контроля продаж</p><div className="mt-6 hidden md:grid md:grid-cols-[1fr_auto_1fr] md:items-center md:gap-3"><RouteStation station={routeStations[0]} /><ArrowBadge direction="right" /><RouteStation station={routeStations[1]} /><ArrowBadge direction="down" /><div /><div /><RouteStation station={routeStations[2]} /><ArrowBadge direction="right" /><RouteStation station={routeStations[3]} /></div><div className="mt-6 grid gap-3 md:hidden"><RouteStation station={routeStations[0]} /><ArrowBadge direction="down" /><RouteStation station={routeStations[1]} /><ArrowBadge direction="down" /><RouteStation station={routeStations[2]} /><ArrowBadge direction="down" /><RouteStation station={routeStations[3]} /></div></GlassCard>;}

function ProblemCard({ card }: { card: (typeof problemCards)[number] }) { const Icon = card.icon; return <GlassCard accent={card.accent} className="p-5"><div className="flex items-center gap-3"><AccentIcon icon={Icon} accent={card.accent} /><span className="text-[13px] leading-5 text-[rgba(203,213,225,0.68)]">Проблема</span></div><h3 className="mt-3 text-[21px] font-semibold">{card.title}</h3><p className="mt-2 text-[14px] leading-6 text-[rgba(213,223,246,0.82)]">{card.text}</p></GlassCard>; }

function ResearchProofCard(){return <div className="mt-4 grid grid-cols-1 gap-4 rounded-[26px] p-5 md:grid-cols-[auto_1fr]" style={{...glassCardBase,borderColor:"rgba(96,165,250,0.28)"}}><AccentIcon icon={FileText} accent="blue" /><div><span className="inline-flex rounded-full border px-3 py-1 text-[13px] leading-5" style={{borderColor:"rgba(96,165,250,0.4)",background:"rgba(96,165,250,0.1)"}}>Проверено по процессам</span><h3 className="mt-3 text-[28px] md:text-[36px] font-semibold tracking-[-0.04em]">Мы изучили процессы</h3><p className="mt-2 text-[16px] leading-8 text-[rgba(213,223,246,0.82)]">Изучены регламентные процедуры, формы заявлений, порядок включения организаторов в реестр и выдачи удостоверений. Вывод: регуляторная рамка уже существует, но не соединена с продажами, деньгами и аналитикой.</p></div></div>;}

function DomainCard({ domain }: { domain: (typeof circuitDomains)[number] }) { const Icon = domain.icon; return <GlassCard accent={domain.accent} className="p-5 rounded-[24px]"><AccentIcon icon={Icon} accent={domain.accent} /><h4 className="mt-3 text-[18px] font-semibold">{domain.title}</h4><div className="mt-3 flex flex-wrap gap-2">{domain.nodes.map((n)=><span key={n} className="rounded-full border px-2.5 py-1 text-[11px]" style={{background:"rgba(255,255,255,0.04)",borderColor:"rgba(255,255,255,0.08)"}}>{n}</span>)}</div></GlassCard>; }

function DigitalCircuitDiagram(){return <div className="relative mt-6 overflow-hidden rounded-[30px] p-5 md:p-7" style={{...glassCardBase,borderColor:"rgba(96,165,250,0.18)"}}><div className="hidden lg:grid lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-4"><DomainCard domain={circuitDomains[0]} /><ArrowBadge direction="right" /><DomainCard domain={circuitDomains[1]} /><ArrowBadge direction="down" /><div className="mx-auto flex h-[156px] w-[156px] flex-col items-center justify-center rounded-full text-center" style={{background:"radial-gradient(circle at 50% 35%, rgba(96,165,250,0.34), rgba(99,102,241,0.18) 48%, rgba(15,23,42,0.94) 100%)",border:"1px solid rgba(191,219,254,0.30)",boxShadow:"0 0 70px rgba(96,165,250,0.24), inset 0 1px 0 rgba(255,255,255,0.08)"}}><p className="text-[20px] font-semibold">Событие</p><p className="text-[13px] leading-5 text-[rgba(203,213,225,0.68)]">цифровой объект</p></div><ArrowBadge direction="down" /><DomainCard domain={circuitDomains[2]} /><ArrowBadge direction="right" /><DomainCard domain={circuitDomains[3]} /></div><div className="grid gap-3 lg:hidden"><div className="mx-auto flex h-[156px] w-[156px] flex-col items-center justify-center rounded-full text-center" style={{background:"radial-gradient(circle at 50% 35%, rgba(96,165,250,0.34), rgba(99,102,241,0.18) 48%, rgba(15,23,42,0.94) 100%)",border:"1px solid rgba(191,219,254,0.30)",boxShadow:"0 0 70px rgba(96,165,250,0.24), inset 0 1px 0 rgba(255,255,255,0.08)"}}><p className="text-[20px] font-semibold">Событие</p><p className="text-[13px] leading-5 text-[rgba(203,213,225,0.68)]">цифровой объект</p></div><ArrowBadge direction="down" /><DomainCard domain={circuitDomains[0]} /><ArrowBadge direction="down" /><DomainCard domain={circuitDomains[1]} /><ArrowBadge direction="down" /><DomainCard domain={circuitDomains[2]} /><ArrowBadge direction="down" /><DomainCard domain={circuitDomains[3]} /></div></div>;}

function JourneyStep({ step }: { step: (typeof journeySteps)[number] }) { const Icon = step.icon; return <div className="w-[180px]"><div className="flex h-11 w-11 items-center justify-center rounded-full border text-[12px] font-semibold" style={{borderColor:accents[step.accent].border,background:"rgba(255,255,255,0.05)",boxShadow:`0 0 24px ${accents[step.accent].glow}`}}>{step.number}</div><GlassCard className="mt-3 p-4" accent={step.accent}><AccentIcon icon={Icon} accent={step.accent} /><h4 className="mt-3 text-[16px] font-semibold">{step.title}</h4><p className="mt-2 text-[13px] leading-5 text-[rgba(203,213,225,0.68)]">{step.caption}</p></GlassCard></div>; }

function JourneyRibbon(){return <><div className="mt-6 hidden overflow-x-auto rounded-[30px] p-5 md:block" style={glassCardBase}><div className="relative min-w-[1320px]"><div className="absolute left-[56px] right-[56px] top-[54px] h-[2px]" style={{background:"linear-gradient(90deg, rgba(168,85,247,0.45), rgba(59,130,246,0.55), rgba(16,185,129,0.45), rgba(99,102,241,0.45))"}} /><div className="relative grid grid-cols-7 gap-4">{journeySteps.map((step)=><JourneyStep key={step.number} step={step} />)}</div></div></div><div className="mt-6 grid gap-4 md:hidden">{journeySteps.map((step)=><div key={step.number} className="relative pl-8"><div className="absolute bottom-0 left-[21px] top-0 w-px" style={{background:"linear-gradient(180deg, rgba(168,85,247,0.45), rgba(59,130,246,0.45))"}} /><JourneyStep step={step} /></div>)}</div></>;}

function BenefitCard({ item }: { item: (typeof benefitCards)[number] }) { const Icon = item.icon; return <GlassCard accent={item.accent} className="p-5 rounded-[24px]"><AccentIcon icon={Icon} accent={item.accent} /><h3 className="mt-3 text-[22px] font-semibold">{item.title}</h3><p className="mt-2 text-[14px] leading-6 text-[rgba(213,223,246,0.82)]">{item.text}</p></GlassCard>; }

export default function MainPage() {return <div className="min-h-screen bg-[#020611] text-white"><div className="pointer-events-none fixed inset-0" style={{ background: shellBackground }} /><div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-4 md:px-6 xl:px-8"><header className="rounded-[26px] px-5 py-4 md:px-7" style={{background:"linear-gradient(180deg, rgba(7,13,24,0.92), rgba(5,10,20,0.9))",border:"1px solid rgba(255,255,255,0.07)",boxShadow:"0 16px 44px rgba(0,0,0,0.26)",backdropFilter:"blur(18px)"}}><div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex items-center gap-3"><img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded-lg object-cover" /><span className="text-[17px] font-semibold tracking-[-0.03em]">CinemaLab</span><span className="text-[14px] text-[rgba(203,213,225,0.72)]">Билетная платформа</span></div><Link to="/proto" className="inline-flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-semibold" style={{background:"linear-gradient(90deg, #4F7BFF 0%, #B059FF 100%)",boxShadow:"0 14px 32px rgba(99,102,241,0.32)"}}>К прототипу<ArrowRight size={16} /></Link></div></header>
<section className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-[1.08fr_0.92fr]"><SectionPanel className="relative overflow-hidden rounded-[34px] px-6 py-8 md:px-8 md:py-10"><h1 className="text-[38px] md:text-[58px] xl:text-[64px] font-semibold leading-[1.02] tracking-[-0.055em]">Единая цифровая инфраструктура для рынка<span className="block" style={{background:"linear-gradient(90deg, #E9D5FF 0%, #C084FC 36%, #60A5FA 100%)",WebkitBackgroundClip:"text",color:"transparent"}}>культурно-массовых мероприятий</span></h1><p className="mt-5 text-[16px] leading-8 text-[rgba(213,223,246,0.82)]">Платформа связывает организаторов, регулятора, площадки, реселлеров и покупателей в единый управляемый контур: от допуска организатора и согласования мероприятия до продажи билета, контроля и аналитики.</p><p className="mt-4 text-[16px] leading-8 text-[rgba(233,238,255,0.9)]">Это не еще одна афиша. Это цифровой слой, который соединяет регулирование, билетную продажу и рыночную статистику.</p><div className="mt-6 flex flex-wrap gap-3">{["Регуляторный контур","Билетная продажа","Аналитика рынка"].map((chip)=><span key={chip} className="rounded-full border px-4 py-2 text-[13px] leading-5" style={{borderColor:"rgba(255,255,255,0.12)",background:"rgba(255,255,255,0.04)"}}>{chip}</span>)}</div></SectionPanel><EventRouteDiagram /></section>
<SectionPanel className="mt-5"><h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.04em]">Рынок сломан, но уже регулируется</h2><p className="mt-3 text-[16px] leading-8 text-[rgba(213,223,246,0.82)]">Рынок уже находится в обязательном регуляторном контуре, но коммерческая инфраструктура остается фрагментированной: продажи, квоты, договоренности и аналитика живут отдельно друг от друга.</p><div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">{problemCards.map((card)=><ProblemCard key={card.title} card={card} />)}</div><ResearchProofCard /><div className="mt-4 rounded-[24px] border px-5 py-4 text-[18px] font-semibold leading-8" style={{background:"linear-gradient(90deg, rgba(79,123,255,0.18), rgba(168,85,247,0.14))",borderColor:"rgba(125,106,255,0.30)",boxShadow:"0 18px 44px rgba(79,70,229,0.18)"}}>Есть обязательный процесс. Есть денежный поток. Нет единой цифровой инфраструктуры между ними.</div></SectionPanel>
<SectionPanel className="mt-5"><h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.04em]">Решение: единый цифровой контур</h2><p className="mt-3 text-[16px] leading-8 text-[rgba(213,223,246,0.82)]">Платформа превращает мероприятие в управляемый цифровой объект и соединяет административное согласование с продажами, контролем и аналитикой.</p><DigitalCircuitDiagram /><div className="mt-4 rounded-[24px] border px-5 py-4 text-[18px] font-semibold leading-8" style={{ borderColor: "rgba(125,106,255,0.30)", background: "linear-gradient(90deg, rgba(79,123,255,0.18), rgba(168,85,247,0.14))" }}>Каждый участник и каждое действие получают цифровой след.</div></SectionPanel>
<SectionPanel className="mt-5"><h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.04em]">От разрешения до денег — в одном маршруте</h2><JourneyRibbon /></SectionPanel>
<SectionPanel className="mt-5"><h2 className="text-[28px] md:text-[36px] font-semibold tracking-[-0.04em]">Выгоды для каждого участника</h2><p className="mt-3 text-[16px] leading-8 text-[rgba(213,223,246,0.82)]">Платформа работает, когда каждый участник получает практическую выгоду.</p><div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">{benefitCards.map((item)=><BenefitCard key={item.title} item={item} />)}</div></SectionPanel>
<SectionPanel className="mt-5"><h2 className="text-[28px] font-semibold">Один рынок — четыре рабочих контура</h2><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{[{ t: "Кабинет организатора", d: "Регистрация, заявки, документы, мероприятия, статусы, история взаимодействия.", i: Building2, a: "violet" as const },{ t: "Регуляторный контур", d: "Рассмотрение заявок, реестры, решения, журнал действий, контроль и аналитика.", i: ShieldCheck, a: "blue" as const },{ t: "Каналы продаж", d: "Подключение реселлеров, API/виджет, продажи, возвраты, проверки, синхронизация билетного фонда.", i: Ticket, a: "emerald" as const },{ t: "Публичный контур", d: "Афиша, покупка билета, цифровой билет, возврат и проверка на входе.", i: Users, a: "orange" as const }].map(({ t, d, i, a }) => { const Icon = i; return <GlassCard key={t} accent={a}><AccentIcon icon={Icon} accent={a} /><h3 className="mt-3 text-[20px] font-semibold">{t}</h3><p className="mt-2 leading-7 text-[rgba(203,213,225,0.82)]">{d}</p></GlassCard>; })}</div><p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Прототип демонстрирует не отдельную страницу и не кабинет ради кабинета. Он показывает модель будущей инфраструктуры: как мероприятие проходит путь от организатора и регулятора до продажи билета и отражения операции в системе.</p></SectionPanel>
<SectionPanel className="mt-5"><h2 className="text-[28px] font-semibold">Деньги уже есть в рынке</h2><p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Сегодня организатор передает билеты реселлеру. Реселлер продает билет покупателю и удерживает комиссию.</p><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">{[{ l: "Номинал билета", v: "100 BYN", a: "blue" as const },{ l: "Возврат организатору", v: "90 BYN", a: "emerald" as const },{ l: "Комиссия реселлера", v: "10 BYN", a: "amber" as const }].map((m) => <GlassCard key={m.l} accent={m.a}><p className="text-[14px] text-[rgba(203,213,225,0.78)]">{m.l}</p><p className="mt-2 text-[30px] font-semibold">{m.v}</p></GlassCard>)}</div><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Именно эта комиссия — существующий денежный слой рынка.</p><h3 className="mt-4 text-[22px] font-semibold">Что меняет платформа</h3><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Платформа не строит бизнес-модель на госпошлинах, регистрационных платежах или административных сборах. Эти платежи выносятся за скобки.</p><p className="mt-2 leading-8 text-[rgba(203,213,225,0.82)]">Доход платформы возникает из существующей комиссии за продажу билетов.</p><p className="mt-2 leading-8 text-[rgba(203,213,225,0.82)]">Организатор, реселлеры и платформа делят комиссионный поток, который уже существует на рынке.</p><div className="mt-5 rounded-[22px] border p-5 text-[20px] font-semibold leading-9" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(90deg, rgba(79,123,255,0.16), rgba(176,89,255,0.1))" }}>Доход платформы = GMV × средняя комиссия продаж × доля платформы</div><div className="mt-4 space-y-2 text-[rgba(203,213,225,0.82)]"><p>GMV — общий объем проданных билетов.</p><p>Средняя комиссия продаж — комиссия, которую рынок уже платит реселлерам.</p><p>Доля платформы — часть комиссии за инфраструктуру, доступ, контроль и обработку операций.</p></div></SectionPanel>
<SectionPanel className="mt-5" style={{ border: "1px solid rgba(79,123,255,0.28)", boxShadow: "0 32px 88px rgba(0,0,0,0.42), 0 0 0 1px rgba(125,106,255,0.14)" }}><div className="flex items-center gap-3"><AccentIcon icon={BarChart3} accent="indigo" /><h2 className="text-[30px] font-semibold">Потенциал монетизации</h2></div><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{[{ l: "Мероприятий в год", v: "..." },{ l: "Проданных билетов в год", v: "..." },{ l: "Расчетный GMV рынка", v: "... BYN" },{ l: "Средняя комиссия продаж", v: "8–10%" },{ l: "Потенциальная доля платформы в комиссии", v: "...%" },{ l: "Оценочная выручка платформы", v: "... BYN / год" }].map((m)=><GlassCard key={m.l}><p className="text-[14px] leading-6 text-[rgba(203,213,225,0.78)]">{m.l}</p><p className="mt-2 text-[24px] font-semibold">{m.v}</p></GlassCard>)}</div><p className="mt-5 leading-8 text-[rgba(233,238,255,0.9)]">Даже небольшая доля в существующей комиссии может формировать значимую выручку, если платформа становится обязательным цифровым маршрутом для рынка мероприятий.</p></SectionPanel>
<footer className="mt-5 rounded-[24px] px-5 py-5" style={sectionPanelBase}><div className="flex items-start gap-3"><AccentIcon icon={Wallet} accent="violet" /><div><p className="leading-8 text-[rgba(233,238,255,0.9)]">Платформа соединяет обязательный регуляторный процесс с реальным коммерческим оборотом рынка.</p><p className="mt-2 leading-8 text-[rgba(233,238,255,0.9)]">Кто контролирует цифровой маршрут мероприятия — тот контролирует данные, доступ к рынку и часть комиссионного потока.</p></div></div></footer>
</div></div>;}
