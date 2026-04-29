import { ArrowRight, BarChart3, Building2, CheckCircle2, FileText, Link2, ShieldCheck, Store, Ticket, Users } from "lucide-react";
import { Link } from "react-router-dom";
import platformLogo from "../../logo.jpg";

const shellBackground =
  "radial-gradient(circle at 18% 10%, rgba(59,130,246,0.16), transparent 24%), radial-gradient(circle at 42% 12%, rgba(168,85,247,0.18), transparent 20%), radial-gradient(circle at 84% 86%, rgba(59,130,246,0.14), transparent 20%), linear-gradient(180deg, #020611 0%, #040b18 48%, #020611 100%)";

const panelBase = {
  background: "linear-gradient(180deg, rgba(8,15,28,0.96) 0%, rgba(5,11,22,0.94) 100%)",
  border: "1px solid rgba(255,255,255,0.08)",
  boxShadow: "0 24px 64px rgba(0,0,0,0.36)",
};

export default function MainPage() {
  const flow = [
    "Организатор",
    "Заявка",
    "Регулятор",
    "Реестр",
    "Мероприятие",
    "Билеты",
    "Каналы продаж",
    "Покупатель",
    "Контроль",
    "Аналитика",
  ];

  return (
    <div className="min-h-screen bg-[#020611] text-white">
      <div className="pointer-events-none fixed inset-0" style={{ background: shellBackground }} />
      <div className="relative mx-auto max-w-[1440px] px-4 pb-10 pt-4 md:px-6 xl:px-8">
        <header className="rounded-[26px] px-5 py-4 md:px-7" style={panelBase}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <img src={platformLogo} alt="CinemaLab" className="h-8 w-8 rounded-lg object-cover" />
              <div className="flex min-w-0 items-center gap-3">
                <span className="text-[17px] font-semibold tracking-[-0.03em] text-white">CinemaLab</span>
                <span className="text-[14px] text-[rgba(203,213,225,0.72)]">Билетная платформа</span>
              </div>
            </div>
            <Link to="/proto" className="inline-flex items-center gap-2 rounded-[14px] border px-4 py-2 text-[14px] font-medium" style={{ borderColor: "rgba(255,255,255,0.1)", background: "linear-gradient(90deg, #4F7BFF 0%, #B059FF 100%)" }}>
              К прототипу <ArrowRight size={16} />
            </Link>
          </div>
        </header>

        <section className="mt-6 rounded-[34px] px-6 py-7 md:px-8 md:py-9" style={panelBase}>
          <h1 className="text-[34px] font-semibold leading-[1.08] tracking-[-0.04em] md:text-[48px]">Единая цифровая инфраструктура для рынка культурно-массовых мероприятий</h1>
          <p className="mt-5 text-[16px] leading-8 text-[rgba(213,223,246,0.82)] md:text-[18px]">Платформа связывает организаторов, регулятора, площадки, реселлеров и покупателей в единый управляемый контур: от допуска организатора и согласования мероприятия до продажи билета, контроля и аналитики.</p>
          <p className="mt-4 text-[16px] font-medium leading-8 text-[rgba(233,238,255,0.92)] md:text-[18px]">Это не еще одна афиша. Это цифровой слой, который соединяет регулирование, билетную продажу и рыночную статистику.</p>
          <div className="mt-6 flex flex-wrap gap-3">{["Регуляторный контур", "Билетная продажа", "Аналитика рынка"].map((c) => <span key={c} className="rounded-full border px-4 py-2 text-[13px]" style={{ borderColor: "rgba(255,255,255,0.1)" }}>{c}</span>)}</div>
        </section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">Рынок сломан, но уже регулируется</h2><p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Рынок культурно-массовых мероприятий уже живет в обязательном регуляторном контуре: организаторы проходят включение в реестр, мероприятия требуют согласования, документы подаются до начала реализации билетов.</p><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Но коммерческая часть рынка остается разрозненной.</p><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Продажи идут через отдельных реселлеров, квоты, ручные договоренности и несвязанные между собой каналы. В результате государство видит рынок фрагментарно, организаторы зависят от отдельных продавцов, а реселлеры работают не с полным ассортиментом событий.</p><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Мы провели исследование действующих процессов, изучили регламентные документы, формы заявлений, порядок включения организаторов в реестр и процедуру получения удостоверений на проведение мероприятий. Это подтвердило ключевую гипотезу: регуляторная рамка уже существует, но она не соединена с билетной продажей, деньгами и аналитикой.</p><p className="mt-4 text-[18px] font-medium text-[rgba(233,238,255,0.94)]">Есть обязательный процесс. Есть денежный поток. Нет единой цифровой инфраструктуры между ними.</p></section>

        <section className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2" style={{}}>{[{title:"Государство",desc:"Нужен периметр контроля, статистика, прозрачность продаж и понимание реального состояния рынка.",icon:ShieldCheck},{title:"Организатор",desc:"Нужен понятный маршрут: регистрация, заявка, согласование, публикация, продажи и отчетность.",icon:Building2},{title:"Реселлер",desc:"Нужен доступ к большему количеству мероприятий без ручного выбивания квот и отдельных договоренностей.",icon:Store},{title:"Платформа",desc:"Может занять позицию инфраструктурного оператора между регулированием и коммерческим оборотом.",icon:Link2}].map(({title,desc,icon:Icon})=><article key={title} className="rounded-[22px] border p-5" style={panelBase}><Icon size={18}/><h3 className="mt-4 text-[22px] font-semibold">{title}</h3><p className="mt-2 leading-7 text-[rgba(203,213,225,0.82)] break-words">{desc}</p></article>)}</section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">Решение: единый цифровой контур</h2><p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Платформа превращает мероприятие в управляемый цифровой объект.</p><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Каждый участник и каждое действие получают цифровой след: организатор, площадка, мероприятие, билет, канал продажи, возврат, проход, статус согласования и отчетность.</p><div className="mt-5 flex flex-wrap gap-2">{flow.map((item)=><span key={item} className="rounded-full border px-3 py-1.5 text-[13px]" style={{borderColor:"rgba(255,255,255,0.1)"}}>{item}</span>)}</div><p className="mt-4 text-[16px] leading-8 text-[rgba(233,238,255,0.92)]">Мы соединяем административный допуск мероприятия с его коммерческой жизнью: продажей билетов, каналами реализации, контролем и статистикой.</p></section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">От разрешения до денег — в одном маршруте</h2><ol className="mt-4 space-y-2">{["Организатор подает заявку.","Регулятор рассматривает и фиксирует решение.","Мероприятие попадает в цифровой реестр.","Билеты становятся доступны подключенным каналам продаж.","Реселлеры продают билеты через единый доступ.","Покупатель получает цифровой билет.","Платформа фиксирует продажи, возвраты, проходы и аналитику."].map((s,i)=><li key={s} className="flex gap-3"><span className="mt-1"><CheckCircle2 size={16}/></span><span className="leading-7 text-[rgba(203,213,225,0.82)]">{i+1}. {s}</span></li>)}</ol><p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Мероприятие перестает быть набором отдельных документов, договоров и продаж. Оно становится управляемым объектом с понятным статусом, историей, билетным фондом, каналами реализации и финансовым следом.</p></section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">Почему участники согласятся</h2><p className="mt-2 text-[rgba(203,213,225,0.78)]">Платформа работает только в том случае, если каждый участник получает свою выгоду.</p><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{[{t:"Государство / Минкульт",d:"Получает контрольный контур рынка: кто проводит мероприятия, какие события согласованы, сколько билетов выпущено, сколько продано, через какие каналы и в каких разрезах."},{t:"Организатор",d:"Получает единый рабочий маршрут: регистрация, заявка, документы, публикация мероприятия, подключение каналов продаж, отчетность. Организатор меньше зависит от одного реселлера и получает доступ к более широкому рынку продаж."},{t:"Реселлер",d:"Реселлер может потерять часть комиссии, но получает взамен больший доступ к мероприятиям, единый технический стандарт и возможность продавать больше. Платформа заменяет ручную модель квотирования на более ликвидный и масштабируемый доступ к билетному фонду."},{t:"Покупатель",d:"Получает больше доступных мероприятий, понятный цифровой билет, прозрачную покупку, возврат и проверку."}].map((x)=><article key={x.t} className="rounded-[20px] border p-4" style={{borderColor:"rgba(255,255,255,0.08)"}}><h3 className="text-[20px] font-semibold">{x.t}</h3><p className="mt-2 leading-7 text-[rgba(203,213,225,0.82)]">{x.d}</p></article>)}</div><p className="mt-4 text-[16px] leading-8 text-[rgba(233,238,255,0.92)]">Платформа не ломает рынок. Она перераспределяет существующую комиссию за счет того, что дает рынку больше ликвидности, контроля и прозрачности.</p></section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">Один рынок — четыре рабочих контура</h2><div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">{[{t:"Кабинет организатора",d:"Регистрация, заявки, документы, мероприятия, статусы, история взаимодействия.",i:Building2},{t:"Регуляторный контур",d:"Рассмотрение заявок, реестры, решения, журнал действий, контроль и аналитика.",i:ShieldCheck},{t:"Каналы продаж",d:"Подключение реселлеров, API/виджет, продажи, возвраты, проверки, синхронизация билетного фонда.",i:Ticket},{t:"Публичный контур",d:"Афиша, покупка билета, цифровой билет, возврат и проверка на входе.",i:Users}].map(({t,d,i:Icon})=><article key={t} className="rounded-[20px] border p-4" style={{borderColor:"rgba(255,255,255,0.08)"}}><Icon size={18}/><h3 className="mt-3 text-[20px] font-semibold">{t}</h3><p className="mt-2 leading-7 text-[rgba(203,213,225,0.82)]">{d}</p></article>)}</div><p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Прототип демонстрирует не отдельную страницу и не кабинет ради кабинета. Он показывает модель будущей инфраструктуры: как мероприятие проходит путь от организатора и регулятора до продажи билета и отражения операции в системе.</p></section>

        <section className="mt-5 rounded-[28px] px-5 py-6 md:px-6" style={panelBase}><h2 className="text-[28px] font-semibold">Деньги уже есть в рынке</h2><p className="mt-4 leading-8 text-[rgba(203,213,225,0.82)]">Сегодня организатор передает билеты реселлеру. Реселлер продает билет покупателю и удерживает комиссию.</p><div className="mt-4 rounded-[22px] border p-5" style={{borderColor:"rgba(255,255,255,0.08)"}}><p className="leading-8">Номинал билета: 100 BYN</p><p className="leading-8">Возврат организатору: 90 BYN</p><p className="leading-8">Комиссия реселлера: 10 BYN</p></div><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Именно эта комиссия — существующий денежный слой рынка.</p><h3 className="mt-4 text-[22px] font-semibold">Что меняет платформа</h3><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Платформа не строит бизнес-модель на госпошлинах, регистрационных платежах или административных сборах. Эти платежи выносятся за скобки.</p><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Доход платформы возникает из существующей комиссии за продажу билетов.</p><p className="mt-3 leading-8 text-[rgba(203,213,225,0.82)]">Организатор, реселлеры и платформа делят комиссионный поток, который уже существует на рынке.</p><div className="mt-5 rounded-[22px] border p-5 text-[20px] font-semibold leading-9" style={{borderColor:"rgba(255,255,255,0.1)"}}>Доход платформы = GMV × средняя комиссия продаж × доля платформы</div><div className="mt-4 space-y-2 text-[rgba(203,213,225,0.82)]"><p>GMV — общий объем проданных билетов.</p><p>Средняя комиссия продаж — комиссия, которую рынок уже платит реселлерам.</p><p>Доля платформы — часть комиссии за инфраструктуру, доступ, контроль и обработку операций.</p></div></section>

        <section className="mt-5 rounded-[30px] px-5 py-6 md:px-6" style={{...panelBase, border:"1px solid rgba(79,123,255,0.28)"}}><h2 className="text-[30px] font-semibold">Потенциал монетизации</h2><div className="mt-5 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">{[{l:"Мероприятий в год",v:"..."},{l:"Проданных билетов в год",v:"..."},{l:"Расчетный GMV рынка",v:"... BYN"},{l:"Средняя комиссия продаж",v:"8–10%"},{l:"Потенциальная доля платформы в комиссии",v:"...%"},{l:"Оценочная выручка платформы",v:"... BYN / год"}].map((m)=><div key={m.l} className="rounded-[20px] border p-4" style={{borderColor:"rgba(255,255,255,0.08)"}}><p className="text-[14px] text-[rgba(203,213,225,0.78)]">{m.l}</p><p className="mt-2 text-[24px] font-semibold break-words">{m.v}</p></div>)}</div><p className="mt-5 leading-8 text-[rgba(233,238,255,0.9)]">Даже небольшая доля в существующей комиссии может формировать значимую выручку, если платформа становится обязательным цифровым маршрутом для рынка мероприятий.</p></section>

        <footer className="mt-5 rounded-[24px] px-5 py-5" style={panelBase}><p className="leading-8 text-[rgba(233,238,255,0.9)]">Платформа соединяет обязательный регуляторный процесс с реальным коммерческим оборотом рынка.</p><p className="mt-2 leading-8 text-[rgba(233,238,255,0.9)]">Кто контролирует цифровой маршрут мероприятия — тот контролирует данные, доступ к рынку и часть комиссионного потока.</p></footer>
      </div>
    </div>
  );
}
