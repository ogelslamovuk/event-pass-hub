import {
  ArrowRight,
  BarChart3,
  Building2,
  CheckCircle2,
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

const shellBackground =
  "radial-gradient(circle at 18% 10%, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at 42% 12%, rgba(168,85,247,0.18), transparent 20%), radial-gradient(circle at 84% 86%, rgba(59,130,246,0.14), transparent 20%), linear-gradient(180deg, #020611 0%, #040b18 48%, #020611 100%)";

const panelBase: React.CSSProperties = {
  background: "linear-gradient(180deg, rgba(8,15,28,0.96) 0%, rgba(5,11,22,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.36)",
};

function AccentIcon({ icon: Icon, accent }: { icon: LucideIcon; accent: Accent }) {
  return (
    <div
      className="flex h-11 w-11 items-center justify-center rounded-[14px] border"
      style={{ borderColor: accent.border, background: accent.iconBg, color: accent.iconColor, boxShadow: accent.shadow }}
    >
      <Icon size={18} />
    </div>
  );
}

export default function MainPage() {
  const flow = ["Организатор", "Заявка", "Регулятор", "Реестр", "Мероприятие", "Билеты", "Каналы продаж", "Покупатель", "Контроль", "Аналитика"];

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
          <div className="relative overflow-hidden rounded-[34px] px-6 py-7 md:px-8 md:py-9" style={panelBase}>
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
            <p className="mt-5 text-[16px] leading-8 text-[rgba(213,223,246,0.82)] md:text-[18px]">Платформа связывает организаторов, регулятора, площадки, реселлеров и покупателей в единый управляемый контур: от допуска организатора и согласования мероприятия до продажи билета, контроля и аналитики.</p>
            <p className="mt-4 text-[16px] font-medium leading-8 text-[rgba(233,238,255,0.92)] md:text-[18px]">Это не еще одна афиша. Это цифровой слой, который соединяет регулирование, билетную продажу и рыночную статистику.</p>
            <div className="mt-6 flex flex-wrap gap-3">
              {["Регуляторный контур", "Билетная продажа", "Аналитика рынка"].map((chip, idx) => (
                <span key={chip} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: [accents.violet, accents.blue, accents.emerald][idx].border, background: "rgba(255,255,255,0.03)" }}>{chip}</span>
              ))}
            </div>
          </div>

          <div className="rounded-[34px] px-5 py-6 md:px-6" style={{ ...panelBase, border: "1px solid rgba(79,123,255,0.28)" }}>
            <h2 className="text-[28px] font-semibold tracking-[-0.03em]">Один маршрут события</h2>
            <div className="mt-5 space-y-3">
              {flow.map((item, idx) => (
                <div key={item} className="rounded-[16px] border px-4 py-3 text-[14px] leading-6" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                  {idx + 1}. {item}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}>
          <h2 className="text-[28px] font-semibold">Рынок сломан, но уже регулируется</h2>
          <div className="mt-4 space-y-3 text-[rgba(203,213,225,0.82)]">
            <p className="leading-8">Рынок культурно-массовых мероприятий уже живет в обязательном регуляторном контуре: организаторы проходят включение в реестр, мероприятия требуют согласования, документы подаются до начала реализации билетов.</p>
            <p className="leading-8">Но коммерческая часть рынка остается разрозненной.</p>
            <p className="leading-8">Продажи идут через отдельных реселлеров, квоты, ручные договоренности и несвязанные между собой каналы. В результате государство видит рынок фрагментарно, организаторы зависят от отдельных продавцов, а реселлеры работают не с полным ассортиментом событий.</p>
            <p className="leading-8">Мы провели исследование действующих процессов, изучили регламентные документы, формы заявлений, порядок включения организаторов в реестр и процедуру получения удостоверений на проведение мероприятий. Это подтвердило ключевую гипотезу: регуляторная рамка уже существует, но она не соединена с билетной продажей, деньгами и аналитикой.</p>
          </div>
          <p className="mt-4 text-[18px] font-medium">Есть обязательный процесс. Есть денежный поток. Нет единой цифровой инфраструктуры между ними.</p>

          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { title: "Государство", description: "Нужен периметр контроля, статистика, прозрачность продаж и понимание реального состояния рынка.", icon: ShieldCheck, accent: accents.blue },
              { title: "Организатор", description: "Нужен понятный маршрут: регистрация, заявка, согласование, публикация, продажи и отчетность.", icon: Building2, accent: accents.violet },
              { title: "Реселлер", description: "Нужен доступ к большему количеству мероприятий без ручного выбивания квот и отдельных договоренностей.", icon: Store, accent: accents.emerald },
              { title: "Платформа", description: "Может занять позицию инфраструктурного оператора между регулированием и коммерческим оборотом.", icon: Link2, accent: accents.indigo },
            ].map((card) => (
              <article key={card.title} className="rounded-[22px] border p-5" style={{ ...panelBase, boxShadow: `0 18px 44px rgba(0,0,0,0.28), inset 0 0 0 1px ${card.accent.glow}` }}>
                <AccentIcon icon={card.icon} accent={card.accent} />
                <h3 className="mt-4 text-[22px] font-semibold">{card.title}</h3>
                <p className="mt-2 break-words text-[14px] leading-7 text-[rgba(203,213,225,0.82)]">{card.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}>
          <h2 className="text-[28px] font-semibold">Решение: единый цифровой контур</h2>
          <p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Платформа превращает мероприятие в управляемый цифровой объект.</p>
          <p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Каждый участник и каждое действие получают цифровой след: организатор, площадка, мероприятие, билет, канал продажи, возврат, проход, статус согласования и отчетность.</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {flow.map((item) => (
              <span key={item} className="rounded-full border px-3 py-2 text-[13px]" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.03)" }}>{item}</span>
            ))}
          </div>
          <p className="mt-4 leading-8 text-[rgba(233,238,255,0.92)]">Мы соединяем административный допуск мероприятия с его коммерческой жизнью: продажей билетов, каналами реализации, контролем и статистикой.</p>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}>
          <h2 className="text-[28px] font-semibold">От разрешения до денег — в одном маршруте</h2>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
            {[
              "Организатор подает заявку.",
              "Регулятор рассматривает и фиксирует решение.",
              "Мероприятие попадает в цифровой реестр.",
              "Билеты становятся доступны подключенным каналам продаж.",
              "Реселлеры продают билеты через единый доступ.",
              "Покупатель получает цифровой билет.",
              "Платформа фиксирует продажи, возвраты, проходы и аналитику.",
            ].map((step, idx) => (
              <div key={step} className="rounded-[18px] border p-4" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)" }}>
                <div className="mb-2 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.12em] text-[rgba(148,163,184,0.8)]">
                  <CheckCircle2 size={14} /> Шаг {idx + 1}
                </div>
                <p className="leading-7 text-[rgba(203,213,225,0.82)]">{step}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Мероприятие перестает быть набором отдельных документов, договоров и продаж. Оно становится управляемым объектом с понятным статусом, историей, билетным фондом, каналами реализации и финансовым следом.</p>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}>
          <h2 className="text-[28px] font-semibold">Почему участники согласятся</h2>
          <p className="mt-2 text-[rgba(203,213,225,0.78)]">Платформа работает только в том случае, если каждый участник получает свою выгоду.</p>
          <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            {[
              { t: "Государство / Минкульт", d: "Получает контрольный контур рынка: кто проводит мероприятия, какие события согласованы, сколько билетов выпущено, сколько продано, через какие каналы и в каких разрезах.", a: accents.blue },
              { t: "Организатор", d: "Получает единый рабочий маршрут: регистрация, заявка, документы, публикация мероприятия, подключение каналов продаж, отчетность. Организатор меньше зависит от одного реселлера и получает доступ к более широкому рынку продаж.", a: accents.violet },
              { t: "Реселлер", d: "Реселлер может потерять часть комиссии, но получает взамен больший доступ к мероприятиям, единый технический стандарт и возможность продавать больше. Платформа заменяет ручную модель квотирования на более ликвидный и масштабируемый доступ к билетному фонду.", a: accents.emerald },
              { t: "Покупатель", d: "Получает больше доступных мероприятий, понятный цифровой билет, прозрачную покупку, возврат и проверку.", a: accents.amber },
            ].map((x) => (
              <article key={x.t} className="rounded-[20px] border p-4" style={{ borderColor: x.a.border, background: "rgba(255,255,255,0.02)" }}>
                <h3 className="text-[20px] font-semibold break-words">{x.t}</h3>
                <p className="mt-2 break-words leading-7 text-[rgba(203,213,225,0.82)]">{x.d}</p>
              </article>
            ))}
          </div>
          <p className="mt-4 leading-8 text-[rgba(233,238,255,0.92)]">Платформа не ломает рынок. Она перераспределяет существующую комиссию за счет того, что дает рынку больше ликвидности, контроля и прозрачности.</p>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}>
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
                <article key={t} className="rounded-[20px] border p-4" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                  <AccentIcon icon={Icon} accent={a} />
                  <h3 className="mt-3 text-[20px] font-semibold">{t}</h3>
                  <p className="mt-2 leading-7 text-[rgba(203,213,225,0.82)]">{d}</p>
                </article>
              );
            })}
          </div>
          <p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Прототип демонстрирует не отдельную страницу и не кабинет ради кабинета. Он показывает модель будущей инфраструктуры: как мероприятие проходит путь от организатора и регулятора до продажи билета и отражения операции в системе.</p>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}>
          <h2 className="text-[28px] font-semibold">Деньги уже есть в рынке</h2>
          <p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Сегодня организатор передает билеты реселлеру. Реселлер продает билет покупателю и удерживает комиссию.</p>
          <div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[
              { l: "Номинал билета", v: "100 BYN", a: accents.blue },
              { l: "Возврат организатору", v: "90 BYN", a: accents.emerald },
              { l: "Комиссия реселлера", v: "10 BYN", a: accents.amber },
            ].map((m) => (
              <div key={m.l} className="rounded-[20px] border p-4" style={{ borderColor: m.a.border, background: "rgba(255,255,255,0.02)" }}>
                <p className="text-[14px] text-[rgba(203,213,225,0.78)]">{m.l}</p>
                <p className="mt-2 text-[30px] font-semibold break-words">{m.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Именно эта комиссия — существующий денежный слой рынка.</p>
          <h3 className="mt-4 text-[22px] font-semibold">Что меняет платформа</h3>
          <p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Платформа не строит бизнес-модель на госпошлинах, регистрационных платежах или административных сборах. Эти платежи выносятся за скобки.</p>
          <p className="mt-2 leading-8 text-[rgba(203,213,225,0.82)]">Доход платформы возникает из существующей комиссии за продажу билетов.</p>
          <p className="mt-2 leading-8 text-[rgba(203,213,225,0.82)]">Организатор, реселлеры и платформа делят комиссионный поток, который уже существует на рынке.</p>
          <div className="mt-5 rounded-[22px] border p-5 text-[20px] font-semibold leading-9 break-words" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(90deg, rgba(79,123,255,0.16), rgba(176,89,255,0.1))" }}>
            Доход платформы = GMV × средняя комиссия продаж × доля платформы
          </div>
          <div className="mt-4 space-y-2 text-[rgba(203,213,225,0.82)]">
            <p>GMV — общий объем проданных билетов.</p>
            <p>Средняя комиссия продаж — комиссия, которую рынок уже платит реселлерам.</p>
            <p>Доля платформы — часть комиссии за инфраструктуру, доступ, контроль и обработку операций.</p>
          </div>
        </section>

        <section
          className="mt-5 rounded-[30px] px-5 py-6 md:px-6"
          style={{
            ...panelBase,
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
              <div
                key={m.l}
                className="rounded-[20px] border p-4"
                style={{
                  borderColor: "rgba(255,255,255,0.08)",
                  background: "linear-gradient(180deg, rgba(9,17,31,0.96) 0%, rgba(6,12,25,0.94) 100%)",
                }}
              >
                <p className="text-[14px] leading-6 text-[rgba(203,213,225,0.78)]">{m.l}</p>
                <p className="mt-2 text-[24px] font-semibold break-words">{m.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 leading-8 text-[rgba(233,238,255,0.9)]">
            Даже небольшая доля в существующей комиссии может формировать значимую выручку, если платформа становится
            обязательным цифровым маршрутом для рынка мероприятий.
          </p>
        </section>

        <footer className="mt-5 rounded-[24px] px-5 py-5" style={panelBase}>
          <div className="flex items-start gap-3">
            <AccentIcon icon={Wallet} accent={accents.violet} />
            <div>
              <p className="leading-8 text-[rgba(233,238,255,0.9)]">
                Платформа соединяет обязательный регуляторный процесс с реальным коммерческим оборотом рынка.
              </p>
              <p className="mt-2 leading-8 text-[rgba(233,238,255,0.9)]">
                Кто контролирует цифровой маршрут мероприятия — тот контролирует данные, доступ к рынку и часть
                комиссионного потока.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
