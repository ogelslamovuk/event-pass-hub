import {
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

type Accent = {
  border: string;
  glow: string;
  iconBg: string;
  iconColor: string;
  shadow: string;
};

const accents = {
  violet: {
    border: "rgba(192, 132, 252, 0.38)",
    glow: "rgba(168, 85, 247, 0.28)",
    iconBg: "linear-gradient(180deg, rgba(168,85,247,0.24) 0%, rgba(91,33,182,0.18) 100%)",
    iconColor: "#E9D5FF",
    shadow: "0 12px 34px rgba(124, 58, 237, 0.22)",
  },
  blue: {
    border: "rgba(96, 165, 250, 0.4)",
    glow: "rgba(59, 130, 246, 0.28)",
    iconBg: "linear-gradient(180deg, rgba(59,130,246,0.24) 0%, rgba(29,78,216,0.16) 100%)",
    iconColor: "#DBEAFE",
    shadow: "0 12px 34px rgba(37, 99, 235, 0.2)",
  },
  emerald: {
    border: "rgba(52, 211, 153, 0.36)",
    glow: "rgba(16, 185, 129, 0.24)",
    iconBg: "linear-gradient(180deg, rgba(16,185,129,0.22) 0%, rgba(6,95,70,0.16) 100%)",
    iconColor: "#D1FAE5",
    shadow: "0 12px 34px rgba(5, 150, 105, 0.18)",
  },
  amber: {
    border: "rgba(251, 191, 36, 0.36)",
    glow: "rgba(245, 158, 11, 0.24)",
    iconBg: "linear-gradient(180deg, rgba(245,158,11,0.22) 0%, rgba(146,64,14,0.16) 100%)",
    iconColor: "#FEF3C7",
    shadow: "0 12px 34px rgba(180, 83, 9, 0.2)",
  },
  indigo: {
    border: "rgba(165, 180, 252, 0.36)",
    glow: "rgba(99, 102, 241, 0.24)",
    iconBg: "linear-gradient(180deg, rgba(99,102,241,0.24) 0%, rgba(49,46,129,0.18) 100%)",
    iconColor: "#E0E7FF",
    shadow: "0 12px 34px rgba(79, 70, 229, 0.2)",
  },
  orange: {
    border: "rgba(251, 146, 60, 0.36)",
    glow: "rgba(249, 115, 22, 0.24)",
    iconBg: "linear-gradient(180deg, rgba(249,115,22,0.24) 0%, rgba(154,52,18,0.16) 100%)",
    iconColor: "#FFEDD5",
    shadow: "0 12px 34px rgba(194, 65, 12, 0.2)",
  },
} as const;

const shellBackground =
  "radial-gradient(circle at 14% 9%, rgba(59,130,246,0.22), transparent 30%), radial-gradient(circle at 46% 12%, rgba(168,85,247,0.20), transparent 26%), radial-gradient(circle at 85% 45%, rgba(79,70,229,0.18), transparent 30%), radial-gradient(circle at 78% 88%, rgba(14,165,233,0.14), transparent 30%), linear-gradient(180deg, #06101f 0%, #081426 52%, #020611 100%)";

const panelBase: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(13,24,43,0.96) 0%, rgba(7,14,28,0.94) 100%)",
  border: "1px solid rgba(148,163,184,0.16)",
  boxShadow: "0 28px 80px rgba(0,0,0,0.40), inset 0 1px 0 rgba(255,255,255,0.06)",
};

function AccentIcon({ icon, accent }: { icon: LucideIcon; accent: Accent }) {
  const Icon = icon;
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-[14px] border"
      style={{ borderColor: accent.border, background: accent.iconBg, color: accent.iconColor, boxShadow: accent.shadow }}
    >
      <Icon size={18} />
    </div>
  );
}

function SectionPanel({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <section className={`rounded-[30px] px-5 py-6 md:px-6 md:py-7 ${className}`} style={{ ...panelBase, ...style }}>
      {children}
    </section>
  );
}

function GlassCard({ children, className = "", accent }: { children: React.ReactNode; className?: string; accent?: Accent }) {
  return (
    <article
      className={`relative overflow-hidden rounded-[22px] border p-4 ${className}`}
      style={{
        background: "linear-gradient(180deg, rgba(15,27,48,0.92), rgba(8,16,32,0.90))",
        borderColor: accent?.border ?? "rgba(255,255,255,0.10)",
        boxShadow: `0 18px 46px rgba(0,0,0,0.28), inset 0 1px 0 rgba(255,255,255,0.05)${accent ? `, 0 0 0 1px ${accent.glow}` : ""}`,
      }}
    >
      {accent && (
        <div
          className="pointer-events-none absolute -right-10 -top-10 h-24 w-24 rounded-full blur-2xl"
          style={{ background: accent.glow }}
        />
      )}
      <div className="relative">{children}</div>
    </article>
  );
}

const routeStations = [
  { number: "01", title: "Допуск", items: ["Организатор", "Заявка", "Регулятор"], icon: ShieldCheck, accent: accents.violet },
  { number: "02", title: "Регистрация", items: ["Реестр", "Мероприятие", "Билеты"], icon: FileText, accent: accents.blue },
  { number: "03", title: "Продажа", items: ["Каналы продаж", "Покупатель"], icon: Store, accent: accents.emerald },
  { number: "04", title: "Контроль и данные", items: ["Контроль", "Аналитика"], icon: BarChart3, accent: accents.indigo },
] as const;

function RouteStation({ station }: { station: (typeof routeStations)[number] }) {
  const Icon = station.icon;
  return (
    <GlassCard accent={station.accent} className="min-h-[170px]">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em]" style={{ borderColor: station.accent.border }}>
          {station.number}
        </span>
        <AccentIcon icon={Icon} accent={station.accent} />
      </div>
      <h3 className="mt-3 text-[18px] font-semibold tracking-[-0.02em]">{station.title}</h3>
      <div className="mt-3 flex flex-wrap gap-2">
        {station.items.map((item) => (
          <span key={item} className="rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
            {item}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

function EventRouteDiagram() {
  return (
    <SectionPanel style={{ border: "1px solid rgba(99,102,241,0.32)" }}>
      <h2 className="text-[30px] font-semibold tracking-[-0.03em]">Маршрут события</h2>
      <div className="mt-5 block md:hidden">
        <div className="relative space-y-3 pl-6">
          <div className="pointer-events-none absolute bottom-4 left-2 top-4 w-px bg-[linear-gradient(180deg,rgba(96,165,250,0.55),rgba(168,85,247,0.45))]" />
          {routeStations.map((station) => (
            <div key={station.number} className="relative">
              <div className="absolute -left-[18px] top-6 h-3 w-3 rounded-full" style={{ background: station.accent.glow, boxShadow: `0 0 0 4px ${station.accent.glow}` }} />
              <RouteStation station={station} />
            </div>
          ))}
        </div>
      </div>

      <div className="relative mt-6 hidden md:block">
        <div className="grid grid-cols-2 gap-4">
          {routeStations.map((station) => (
            <RouteStation key={station.number} station={station} />
          ))}
        </div>
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(129,140,248,0.9)] blur-[1px]" />
        <div className="pointer-events-none absolute left-[25%] right-[25%] top-[25%] h-px bg-[linear-gradient(90deg,rgba(96,165,250,0.45),rgba(168,85,247,0.45))]" />
        <div className="pointer-events-none absolute right-[25%] top-[25%] bottom-[25%] w-px bg-[linear-gradient(180deg,rgba(96,165,250,0.45),rgba(16,185,129,0.45))]" />
        <div className="pointer-events-none absolute left-[25%] right-[25%] bottom-[25%] h-px bg-[linear-gradient(90deg,rgba(16,185,129,0.45),rgba(129,140,248,0.45))]" />
      </div>
    </SectionPanel>
  );
}

const problemCards = [
  { title: "Разрозненные продажи", text: "Отдельные реселлеры, квоты и ручные договоренности.", icon: Store, accent: accents.amber },
  { title: "Неполная прозрачность", text: "Государство видит рынок фрагментарно.", icon: ShieldCheck, accent: accents.blue },
  { title: "Зависимость организатора", text: "Организатор привязан к отдельным продавцам и каналам.", icon: Building2, accent: accents.violet },
  { title: "Потерянная ликвидность", text: "Реселлер продает не весь рынок, а ограниченные квоты.", icon: Ticket, accent: accents.emerald },
] as const;

function ProblemCard({ card }: { card: (typeof problemCards)[number] }) {
  const Icon = card.icon;
  return (
    <GlassCard accent={card.accent}>
      <AccentIcon icon={Icon} accent={card.accent} />
      <h3 className="mt-4 text-[21px] font-semibold tracking-[-0.02em]">{card.title}</h3>
      <p className="mt-2 text-[15px] leading-7 text-[rgba(203,213,225,0.86)]">{card.text}</p>
    </GlassCard>
  );
}

function ResearchProofCard() {
  return (
    <GlassCard accent={accents.blue} className="mt-4 md:p-5">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <span className="inline-flex rounded-full border px-3 py-1 text-[12px]" style={{ borderColor: accents.violet.border, background: "rgba(192,132,252,0.12)" }}>
            Проверено по процессам
          </span>
          <h3 className="mt-3 text-[24px] font-semibold tracking-[-0.03em]">Мы изучили процессы</h3>
          <p className="mt-3 text-[15px] leading-7 text-[rgba(203,213,225,0.86)]">
            Изучены регламентные процедуры, формы заявлений, порядок включения организаторов в реестр и выдачи удостоверений. Вывод: регуляторная рамка уже существует, но не соединена с продажами, деньгами и аналитикой.
          </p>
        </div>
        <AccentIcon icon={FileText} accent={accents.blue} />
      </div>
    </GlassCard>
  );
}

const domains = [
  { title: "Организаторский контур", nodes: ["Организатор", "Заявка", "Документы"], icon: Building2, accent: accents.violet },
  { title: "Регуляторный контур", nodes: ["Рассмотрение", "Решение", "Реестр"], icon: ShieldCheck, accent: accents.blue },
  { title: "Коммерческий контур", nodes: ["Билеты", "Каналы продаж", "Покупатель"], icon: Ticket, accent: accents.emerald },
  { title: "Контур данных", nodes: ["Продажи", "Возвраты", "Контроль", "Аналитика"], icon: BarChart3, accent: accents.indigo },
] as const;

function DomainCard({ domain }: { domain: (typeof domains)[number] }) {
  const Icon = domain.icon;
  return (
    <GlassCard accent={domain.accent}>
      <div className="flex items-center gap-3">
        <AccentIcon icon={Icon} accent={domain.accent} />
        <h3 className="text-[19px] font-semibold tracking-[-0.02em]">{domain.title}</h3>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {domain.nodes.map((node) => (
          <span key={node} className="rounded-full border px-2.5 py-1 text-[12px]" style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.03)" }}>
            {node}
          </span>
        ))}
      </div>
    </GlassCard>
  );
}

function DigitalCircuitDiagram() {
  return (
    <div className="mt-5">
      <h2 className="text-[30px] font-semibold tracking-[-0.03em]">Решение: единый цифровой контур</h2>
      <p className="mt-4 text-[17px] leading-8 text-[rgba(203,213,225,0.86)]">
        Платформа превращает мероприятие в управляемый цифровой объект и соединяет административное согласование с продажами, контролем и аналитикой.
      </p>

      <div className="mt-6 rounded-[28px] border p-4 md:p-6" style={{ borderColor: "rgba(148,163,184,0.2)", background: "linear-gradient(180deg, rgba(12,23,43,0.78), rgba(7,14,28,0.74))" }}>
        <div className="block lg:hidden">
          <div className="mx-auto mb-4 flex w-fit flex-col items-center rounded-full border px-6 py-5 text-center" style={{ borderColor: accents.blue.border, background: "rgba(59,130,246,0.14)", boxShadow: "0 0 52px rgba(59,130,246,0.24)" }}>
            <p className="text-[22px] font-semibold">Событие</p>
            <p className="text-[13px] text-[rgba(203,213,225,0.8)]">цифровой объект</p>
          </div>
          <div className="relative space-y-3 pl-6">
            <div className="pointer-events-none absolute bottom-6 left-2 top-1 w-px bg-[linear-gradient(180deg,rgba(96,165,250,0.55),rgba(129,140,248,0.45))]" />
            {domains.map((domain) => (
              <div key={domain.title} className="relative">
                <div className="absolute -left-[18px] top-6 h-3 w-3 rounded-full" style={{ background: domain.accent.glow, boxShadow: `0 0 0 4px ${domain.accent.glow}` }} />
                <DomainCard domain={domain} />
              </div>
            ))}
          </div>
        </div>

        <div className="relative hidden min-h-[450px] lg:block">
          <div className="absolute left-1/2 top-1/2 z-10 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center rounded-full border text-center" style={{ borderColor: accents.blue.border, background: "radial-gradient(circle at 50% 40%, rgba(96,165,250,0.34), rgba(30,64,175,0.2))", boxShadow: "0 0 70px rgba(79,70,229,0.28)" }}>
            <p className="text-[25px] font-semibold">Событие</p>
            <p className="text-[13px] text-[rgba(203,213,225,0.84)]">цифровой объект</p>
          </div>

          <div className="absolute left-0 top-0 w-[42%]"><DomainCard domain={domains[0]} /></div>
          <div className="absolute right-0 top-0 w-[42%]"><DomainCard domain={domains[1]} /></div>
          <div className="absolute bottom-0 left-0 w-[42%]"><DomainCard domain={domains[2]} /></div>
          <div className="absolute bottom-0 right-0 w-[42%]"><DomainCard domain={domains[3]} /></div>

          <div className="pointer-events-none absolute left-[41%] top-[22%] h-px w-[18%] bg-[linear-gradient(90deg,rgba(168,85,247,0.45),rgba(129,140,248,0.35))]" />
          <div className="pointer-events-none absolute right-[41%] top-[22%] h-px w-[18%] bg-[linear-gradient(90deg,rgba(129,140,248,0.35),rgba(59,130,246,0.45))]" />
          <div className="pointer-events-none absolute bottom-[22%] left-[41%] h-px w-[18%] bg-[linear-gradient(90deg,rgba(16,185,129,0.45),rgba(129,140,248,0.35))]" />
          <div className="pointer-events-none absolute bottom-[22%] right-[41%] h-px w-[18%] bg-[linear-gradient(90deg,rgba(129,140,248,0.35),rgba(99,102,241,0.45))]" />
        </div>
      </div>

      <div className="mt-4 rounded-[18px] border px-4 py-3 text-[18px] font-medium" style={{ borderColor: "rgba(129,140,248,0.4)", background: "linear-gradient(90deg, rgba(79,70,229,0.18), rgba(59,130,246,0.12))" }}>
        Каждый участник и каждое действие получают цифровой след.
      </div>
    </div>
  );
}

const journeySteps = [
  { number: "01", title: "Подача заявки", caption: "Организатор подает заявку на мероприятие.", icon: ClipboardCheck, accent: accents.violet },
  { number: "02", title: "Рассмотрение", caption: "Регулятор проверяет и согласовывает.", icon: FileText, accent: accents.blue },
  { number: "03", title: "Включение в реестр", caption: "Мероприятие получает официальный статус.", icon: ShieldCheck, accent: accents.indigo },
  { number: "04", title: "Выпуск билетов", caption: "Билетный фонд создается в цифровой среде.", icon: Ticket, accent: accents.emerald },
  { number: "05", title: "Подключение каналов", caption: "Реселлеры получают доступ к продаже.", icon: Link2, accent: accents.blue },
  { number: "06", title: "Продажа покупателю", caption: "Покупатель приобретает цифровой билет.", icon: Store, accent: accents.violet },
  { number: "07", title: "Контроль и аналитика", caption: "Система фиксирует операции и данные.", icon: BarChart3, accent: accents.indigo },
] as const;

function JourneyTimeline() {
  return (
    <div>
      <h2 className="text-[30px] font-semibold tracking-[-0.03em]">От разрешения до денег — в одном маршруте</h2>

      <div className="mt-6 rounded-[28px] border p-4 md:p-6" style={{ borderColor: "rgba(148,163,184,0.2)", background: "linear-gradient(180deg, rgba(12,23,43,0.78), rgba(7,14,28,0.74))" }}>
        <div className="relative space-y-4 xl:hidden">
          <div className="pointer-events-none absolute bottom-4 left-3 top-4 w-px bg-[linear-gradient(180deg,rgba(96,165,250,0.55),rgba(129,140,248,0.45))]" />
          {journeySteps.map((step) => {
            const Icon = step.icon;
            return (
              <GlassCard key={step.number} accent={step.accent} className="ml-6">
                <div className="flex items-center gap-3">
                  <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em]" style={{ borderColor: step.accent.border }}>
                    {step.number}
                  </span>
                  <AccentIcon icon={Icon} accent={step.accent} />
                </div>
                <h3 className="mt-3 text-[20px] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-7 text-[rgba(203,213,225,0.86)]">{step.caption}</p>
              </GlassCard>
            );
          })}
        </div>

        <div className="hidden xl:block">
          <div className="grid grid-cols-4 gap-3">
            {journeySteps.slice(0, 4).map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {idx < 3 && <div className="pointer-events-none absolute left-[76%] top-12 h-px w-[48%] bg-[linear-gradient(90deg,rgba(96,165,250,0.4),rgba(168,85,247,0.4))]" />}
                  <GlassCard accent={step.accent}>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em]" style={{ borderColor: step.accent.border }}>
                        {step.number}
                      </span>
                      <AccentIcon icon={Icon} accent={step.accent} />
                    </div>
                    <h3 className="mt-3 text-[18px] font-semibold">{step.title}</h3>
                    <p className="mt-2 text-[14px] leading-7 text-[rgba(203,213,225,0.86)]">{step.caption}</p>
                  </GlassCard>
                </div>
              );
            })}
          </div>

          <div className="mt-3 grid grid-cols-4 gap-3">
            <div className="col-span-1" />
            {journeySteps.slice(4).reverse().map((step, idx) => {
              const Icon = step.icon;
              return (
                <div key={step.number} className="relative">
                  {idx < 2 && <div className="pointer-events-none absolute right-[76%] top-12 h-px w-[48%] bg-[linear-gradient(90deg,rgba(99,102,241,0.4),rgba(16,185,129,0.4))]" />}
                  <GlassCard accent={step.accent}>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em]" style={{ borderColor: step.accent.border }}>
                        {step.number}
                      </span>
                      <AccentIcon icon={Icon} accent={step.accent} />
                    </div>
                    <h3 className="mt-3 text-[18px] font-semibold">{step.title}</h3>
                    <p className="mt-2 text-[14px] leading-7 text-[rgba(203,213,225,0.86)]">{step.caption}</p>
                  </GlassCard>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

const benefitCards = [
  { title: "Государство / Минкульт", text: "Прозрачность рынка, контроль в реальном времени и достоверные данные для решений.", icon: ShieldCheck, accent: accents.blue },
  { title: "Организатор", text: "Быстрый легальный маршрут: заявка, согласование, выпуск билетов и продажи.", icon: Building2, accent: accents.violet },
  { title: "Реселлер", text: "Больше доступных мероприятий и защищенный стандарт подключения к билетному фонду.", icon: Store, accent: accents.emerald },
  { title: "Покупатель", text: "Понятный цифровой билет, безопасная покупка, возврат и проверка.", icon: Users, accent: accents.amber },
] as const;

function BenefitCard({ item }: { item: (typeof benefitCards)[number] }) {
  const Icon = item.icon;
  return (
    <GlassCard accent={item.accent} className="md:p-5">
      <div className="flex items-start gap-3">
        <AccentIcon icon={Icon} accent={item.accent} />
        <div>
          <h3 className="text-[22px] font-semibold tracking-[-0.02em]">{item.title}</h3>
          <p className="mt-2 text-[15px] leading-7 text-[rgba(203,213,225,0.86)]">{item.text}</p>
        </div>
      </div>
    </GlassCard>
  );
}

export default function MainPage() {
  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <div className="pointer-events-none fixed inset-0" style={{ background: shellBackground }} />

      <div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-4 md:px-6 xl:px-8">
        <header
          className="rounded-[26px] px-5 py-4 md:px-7"
          style={{
            background: "linear-gradient(180deg, rgba(7,13,24,0.92) 0%, rgba(5,10,20,0.9) 100%)",
            border: "1px solid rgba(255,255,255,0.07)",
            boxShadow: "0 16px 44px rgba(0,0,0,0.26)",
            backdropFilter: "blur(18px)",
          }}
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded-lg object-cover" />
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-[17px] font-semibold tracking-[-0.03em]">CinemaLab</span>
                <span className="text-[14px] text-[rgba(203,213,225,0.72)]">Билетная платформа</span>
              </div>
            </div>
            <Link
              to="/proto"
              className="inline-flex items-center gap-2 rounded-[12px] px-4 py-2 text-[13px] font-semibold"
              style={{ background: "linear-gradient(90deg, #4F7BFF 0%, #B059FF 100%)", boxShadow: "0 14px 32px rgba(99,102,241,0.32)" }}
            >
              К прототипу
              <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        <section className="mt-6 grid grid-cols-1 gap-5 xl:grid-cols-[1.2fr_0.95fr]">
          <SectionPanel className="relative overflow-hidden rounded-[34px] px-6 py-7 md:px-8 md:py-9">
            <h1 className="text-[34px] font-semibold leading-[1.04] tracking-[-0.04em] md:text-[50px]">
              Единая цифровая инфраструктура для рынка
              <span
                style={{
                  display: "block",
                  background: "linear-gradient(90deg, #C084FC 0%, #A855F7 52%, #4F7BFF 100%)",
                  WebkitBackgroundClip: "text",
                  color: "transparent",
                }}
              >
                культурно-массовых мероприятий
              </span>
            </h1>
            <p className="mt-5 text-[16px] leading-8 text-[rgba(213,223,246,0.82)] md:text-[18px]">
              Платформа связывает организаторов, регулятора, площадки, реселлеров и покупателей в единый управляемый контур: от допуска организатора и согласования мероприятия до продажи билета, контроля и аналитики.
            </p>
            <p className="mt-4 text-[16px] font-medium leading-8 text-[rgba(233,238,255,0.92)] md:text-[18px]">
              Это не еще одна афиша. Это цифровой слой, который соединяет регулирование, билетную продажу и рыночную статистику.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Регуляторный контур", "Билетная продажа", "Аналитика рынка"].map((chip, idx) => (
                <span key={chip} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: [accents.violet, accents.blue, accents.emerald][idx].border, background: "rgba(255,255,255,0.03)" }}>
                  {chip}
                </span>
              ))}
            </div>
          </SectionPanel>

          <EventRouteDiagram />
        </section>

        <SectionPanel className="mt-5">
          <h2 className="text-[30px] font-semibold tracking-[-0.03em]">Рынок сломан, но уже регулируется</h2>
          <p className="mt-4 text-[17px] leading-8 text-[rgba(203,213,225,0.86)]">
            Рынок уже находится в обязательном регуляторном контуре, но коммерческая инфраструктура остается фрагментированной: продажи, квоты, договоренности и аналитика живут отдельно друг от друга.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {problemCards.map((card) => (
              <ProblemCard key={card.title} card={card} />
            ))}
          </div>

          <ResearchProofCard />

          <div className="mt-4 rounded-[18px] border px-4 py-3 text-[19px] font-medium" style={{ borderColor: "rgba(129,140,248,0.42)", background: "linear-gradient(90deg, rgba(59,130,246,0.14), rgba(168,85,247,0.14))" }}>
            Есть обязательный процесс. Есть денежный поток. Нет единой цифровой инфраструктуры между ними.
          </div>
        </SectionPanel>

        <SectionPanel className="mt-5">
          <DigitalCircuitDiagram />
        </SectionPanel>

        <SectionPanel className="mt-5">
          <JourneyTimeline />
        </SectionPanel>

        <SectionPanel className="mt-5">
          <h2 className="text-[30px] font-semibold tracking-[-0.03em]">Выгоды для каждого участника</h2>
          <p className="mt-2 text-[17px] text-[rgba(203,213,225,0.78)]">
            Платформа работает, когда каждый участник получает практическую выгоду.
          </p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {benefitCards.map((item) => (
              <BenefitCard key={item.title} item={item} />
            ))}
          </div>
        </SectionPanel>

        <SectionPanel className="mt-5">
          <h2 className="text-[28px] font-semibold">Один рынок — четыре рабочих контура</h2>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { t: "Кабинет организатора", d: "Регистрация, заявки, документы, мероприятия, статусы, история взаимодействия.", i: Building2, a: accents.violet },
              { t: "Регуляторный контур", d: "Рассмотрение заявок, реестры, решения, журнал действий, контроль и аналитика.", i: ShieldCheck, a: accents.blue },
              { t: "Каналы продаж", d: "Подключение реселлеров, API/виджет, продажи, возвраты, проверки, синхронизация билетного фонда.", i: Ticket, a: accents.emerald },
              { t: "Публичный контур", d: "Афиша, покупка билета, цифровой билет, возврат и проверка на входе.", i: Users, a: accents.orange },
            ].map(({ t, d, i, a }) => {
              const Icon = i;
              return (
                <GlassCard key={t} accent={a}>
                  <AccentIcon icon={Icon} accent={a} />
                  <h3 className="mt-3 text-[20px] font-semibold">{t}</h3>
                  <p className="mt-2 leading-7 text-[rgba(203,213,225,0.82)]">{d}</p>
                </GlassCard>
              );
            })}
          </div>
          <p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Прототип демонстрирует не отдельную страницу и не кабинет ради кабинета. Он показывает модель будущей инфраструктуры: как мероприятие проходит путь от организатора и регулятора до продажи билета и отражения операции в системе.</p>
        </SectionPanel>

        <SectionPanel className="mt-5">
          <h2 className="text-[28px] font-semibold">Деньги уже есть в рынке</h2>
          <p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Сегодня организатор передает билеты реселлеру. Реселлер продает билет покупателю и удерживает комиссию.</p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { l: "Номинал билета", v: "100 BYN", a: accents.blue },
              { l: "Возврат организатору", v: "90 BYN", a: accents.emerald },
              { l: "Комиссия реселлера", v: "10 BYN", a: accents.amber },
            ].map((m) => (
              <GlassCard key={m.l} accent={m.a}>
                <p className="text-[14px] text-[rgba(203,213,225,0.78)]">{m.l}</p>
                <p className="mt-2 text-[30px] font-semibold">{m.v}</p>
              </GlassCard>
            ))}
          </div>
          <p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Именно эта комиссия — существующий денежный слой рынка.</p>
          <h3 className="mt-4 text-[22px] font-semibold">Что меняет платформа</h3>
          <p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Платформа не строит бизнес-модель на госпошлинах, регистрационных платежах или административных сборах. Эти платежи выносятся за скобки.</p>
          <p className="mt-2 leading-8 text-[rgba(203,213,225,0.82)]">Доход платформы возникает из существующей комиссии за продажу билетов.</p>
          <p className="mt-2 leading-8 text-[rgba(203,213,225,0.82)]">Организатор, реселлеры и платформа делят комиссионный поток, который уже существует на рынке.</p>
          <div className="mt-5 rounded-[22px] border p-5 text-[20px] font-semibold leading-9" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(90deg, rgba(79,123,255,0.16), rgba(176,89,255,0.1))" }}>
            Доход платформы = GMV × средняя комиссия продаж × доля платформы
          </div>
          <div className="mt-4 space-y-2 text-[rgba(203,213,225,0.82)]">
            <p>GMV — общий объем проданных билетов.</p>
            <p>Средняя комиссия продаж — комиссия, которую рынок уже платит реселлерам.</p>
            <p>Доля платформы — часть комиссии за инфраструктуру, доступ, контроль и обработку операций.</p>
          </div>
        </SectionPanel>

        <SectionPanel
          className="mt-5"
          style={{
            border: "1px solid rgba(79,123,255,0.28)",
            boxShadow: "0 32px 88px rgba(0,0,0,0.42), 0 0 0 1px rgba(125,106,255,0.14)",
          }}
        >
          <div className="flex items-center gap-3">
            <AccentIcon icon={BarChart3} accent={accents.indigo} />
            <h2 className="text-[30px] font-semibold">Потенциал монетизации</h2>
          </div>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {[
              { l: "Мероприятий в год", v: "..." },
              { l: "Проданных билетов в год", v: "..." },
              { l: "Расчетный GMV рынка", v: "... BYN" },
              { l: "Средняя комиссия продаж", v: "8–10%" },
              { l: "Потенциальная доля платформы в комиссии", v: "...%" },
              { l: "Оценочная выручка платформы", v: "... BYN / год" },
            ].map((m) => (
              <GlassCard key={m.l}>
                <p className="text-[14px] leading-6 text-[rgba(203,213,225,0.78)]">{m.l}</p>
                <p className="mt-2 text-[24px] font-semibold">{m.v}</p>
              </GlassCard>
            ))}
          </div>
          <p className="mt-5 leading-8 text-[rgba(233,238,255,0.9)]">
            Даже небольшая доля в существующей комиссии может формировать значимую выручку, если платформа становится обязательным цифровым маршрутом для рынка мероприятий.
          </p>
        </SectionPanel>

        <footer className="mt-5 rounded-[24px] px-5 py-5" style={panelBase}>
          <div className="flex items-start gap-3">
            <AccentIcon icon={Wallet} accent={accents.violet} />
            <div>
              <p className="leading-8 text-[rgba(233,238,255,0.9)]">Платформа соединяет обязательный регуляторный процесс с реальным коммерческим оборотом рынка.</p>
              <p className="mt-2 leading-8 text-[rgba(233,238,255,0.9)]">Кто контролирует цифровой маршрут мероприятия — тот контролирует данные, доступ к рынку и часть комиссионного потока.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
