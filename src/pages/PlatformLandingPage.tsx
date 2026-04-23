import React from 'react';
import { Link } from 'react-router-dom';
import { generateDemoData, resetDemoData, runDemoScenario } from '../lib/demoEngine';

type ActionCard = {
  title: string;
  description: string;
  href?: string;
  action?: () => void;
  accent: string;
  icon: React.ReactNode;
};

type PreviewEvent = {
  title: string;
  type: string;
  date: string;
  location: string;
  status: string;
  statusTone: 'green' | 'amber' | 'slate';
  sold: string;
  revenue: string;
  image: string;
};

const previewEvents: PreviewEvent[] = [
  {
    title: 'Большой летний фестиваль',
    type: 'Фестиваль',
    date: '14–16 июня 2025',
    location: 'Москва, Лужники',
    status: 'Лицензия выдана',
    statusTone: 'green',
    sold: '45 320',
    revenue: '124 560 000 ₽',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Международный форум креативных индустрий',
    type: 'Форум',
    date: '20–21 августа 2025',
    location: 'Санкт-Петербург',
    status: 'На рассмотрении',
    statusTone: 'amber',
    sold: '8 750',
    revenue: '18 900 000 ₽',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=900&q=80',
  },
  {
    title: 'Чемпионат России по баскетболу',
    type: 'Спорт',
    date: '11 октября 2025',
    location: 'Казань, Баскет-Холл',
    status: 'Черновик',
    statusTone: 'slate',
    sold: '0',
    revenue: '0 ₽',
    image:
      'https://images.unsplash.com/photo-1546519638-68e109498ffc?auto=format&fit=crop&w=900&q=80',
  },
];

const quickLinks: ActionCard[] = [
  {
    title: 'Кабинет организатора',
    description: 'Управление мероприятиями, билетами и продажами',
    href: '/organizer',
    accent: 'from-fuchsia-500/25 via-violet-500/18 to-transparent',
    icon: <UserStackIcon />,
  },
  {
    title: 'Центр управления',
    description: 'Контроль мероприятий, лицензий, билетов, данных и процессов',
    href: '/admin',
    accent: 'from-sky-500/25 via-blue-500/18 to-transparent',
    icon: <ControlCenterIcon />,
  },
  {
    title: 'Кабинет реселлера',
    description: 'Работа с мероприятиями, билетами и каналами распространения',
    href: '/channel',
    accent: 'from-emerald-500/25 via-cyan-500/18 to-transparent',
    icon: <ResellerIcon />,
  },
  {
    title: 'B2C Афиша',
    description: 'Публичная витрина мероприятий, поиск событий и покупка билетов',
    href: '/demo',
    accent: 'from-fuchsia-500/20 via-pink-500/14 to-transparent',
    icon: <PosterIcon />,
  },
];

const demoTools: ActionCard[] = [
  {
    title: 'Сбросить демо',
    description: 'Очистить текущее демо и вернуть систему к базовому состоянию',
    action: resetDemoData,
    accent: 'from-violet-500/25 via-indigo-500/16 to-transparent',
    icon: <ResetIcon />,
  },
  {
    title: 'Загрузить mock-данные',
    description: 'Загрузить типовые данные по мероприятиям, билетам и пользователям',
    action: generateDemoData,
    accent: 'from-sky-500/25 via-blue-500/16 to-transparent',
    icon: <UploadIcon />,
  },
  {
    title: 'Запустить demo-сценарий',
    description: 'Запустить готовый сценарий работы системы с типовыми данными',
    action: runDemoScenario,
    accent: 'from-emerald-500/25 via-teal-500/16 to-transparent',
    icon: <PlayIcon />,
  },
];

const moduleTiles = [
  {
    title: 'Лицензирование мероприятий',
    description: 'Согласование мероприятия, организатора и площадки в единой системе',
    icon: <ShieldIcon />,
    tone: 'from-fuchsia-500/18 via-violet-500/12 to-transparent',
  },
  {
    title: 'Реестр мероприятий',
    description: 'Единые карточки мероприятий, статусы, параметры и история изменений',
    icon: <CalendarIcon />,
    tone: 'from-sky-500/18 via-blue-500/12 to-transparent',
  },
  {
    title: 'Билеты и продажи',
    description: 'Выпуск, реализация, возвраты и учёт билетного движения',
    icon: <TicketIcon />,
    tone: 'from-amber-500/18 via-orange-500/12 to-transparent',
  },
  {
    title: 'Отчётность',
    description: 'Сводные показатели, выгрузки и контрольные формы',
    icon: <ReportIcon />,
    tone: 'from-violet-500/18 via-indigo-500/12 to-transparent',
  },
  {
    title: 'Аналитика',
    description: 'Мониторинг продаж, динамики и операционных показателей',
    icon: <AnalyticsIcon />,
    tone: 'from-orange-500/18 via-yellow-500/12 to-transparent',
  },
  {
    title: 'Интеграции',
    description: 'Подключение внешних систем, касс, сайтов и API',
    icon: <LinkChainIcon />,
    tone: 'from-emerald-500/18 via-cyan-500/12 to-transparent',
  },
];

const marketBullets = [
  'Регистрировать и вести единый учёт мероприятий, организаторов и площадок',
  'Координировать и синхронизировать работу регулятора, организаторов и каналов продаж',
  'Контролировать выпуск, продажи, возвраты, статусы и операции в одном окне',
  'Анализировать рынок и получать прозрачную отчётность по мероприятиям и билетам',
];

const platformFeatures = [
  'Реестр мероприятий — единые карточки, статусы и параметры мероприятий',
  'Роли и доступы — разграничение полномочий для всех участников системы',
  'Билеты и продажи — выпуск, реализация, возвраты и контроль движения билетов',
  'Интеграции — подключение внешних сервисов, касс и каналов продаж',
  'Отчётность — оперативные показатели и регламентные выгрузки',
  'История действий — аудит изменений и прозрачность операций по каждому объекту',
];

const metrics = [
  { value: '30K+', label: 'событий', icon: <CalendarIcon /> },
  { value: '25M+', label: 'билетов учтено', icon: <TicketIcon /> },
  { value: '12M+', label: 'посетителей', icon: <PeopleIcon /> },
  { value: '2.1K+', label: 'участников рынка', icon: <BuildingsIcon /> },
  { value: '99.9%', label: 'доступность платформы', icon: <ShieldIcon /> },
];

const scenarios = [
  {
    eyebrow: 'Фестиваль',
    title: 'Музыкальный фестиваль',
    description: 'многодневное событие • несколько категорий билетов • контроль квот',
    image:
      'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=1200&q=80',
  },
  {
    eyebrow: 'Форум',
    title: 'Деловой форум',
    description: 'регистрация участников • билеты • отчётность по мероприятию',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
  {
    eyebrow: 'Спорт',
    title: 'Спортивное событие',
    description: 'массовое мероприятие • поток участников • контроль проходов',
    image:
      'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=1200&q=80',
  },
  {
    eyebrow: 'Выставка',
    title: 'Выставочный проект',
    description: 'длительный период продаж • разные типы билетов • аналитика посещаемости',
    image:
      'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
  },
];

const menuItems = ['Программный сценарий', 'Роли', 'Отчётность', 'Ресурсы', 'Цены'];

const statusClassMap: Record<PreviewEvent['statusTone'], string> = {
  green: 'border-emerald-400/30 bg-emerald-500/18 text-emerald-200',
  amber: 'border-amber-400/30 bg-amber-500/16 text-amber-200',
  slate: 'border-slate-300/20 bg-slate-500/14 text-slate-200',
};

function BrandMark() {
  return (
    <div className="relative flex h-8 w-10 items-center justify-center">
      <span className="absolute left-0 top-1 h-6 w-1.5 rotate-[24deg] rounded-full bg-gradient-to-b from-fuchsia-400 to-violet-600" />
      <span className="absolute left-2.5 top-0.5 h-7 w-1.5 rotate-[24deg] rounded-full bg-gradient-to-b from-violet-400 to-indigo-600" />
      <span className="absolute right-2 top-2 h-5 w-1.5 rotate-[24deg] rounded-full bg-gradient-to-b from-sky-400 to-blue-600" />
      <span className="absolute right-0 top-0 h-7 w-1.5 rotate-[24deg] rounded-full bg-gradient-to-b from-blue-300 to-violet-500" />
    </div>
  );
}

function SurfaceCard({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        'relative overflow-hidden rounded-[28px] border border-white/8 bg-[linear-gradient(180deg,rgba(8,17,46,0.94),rgba(4,10,28,0.98))] shadow-[0_24px_80px_rgba(1,8,32,0.56)] backdrop-blur-xl',
        'before:pointer-events-none before:absolute before:inset-0 before:rounded-[28px] before:border before:border-white/6 before:[mask-image:linear-gradient(180deg,rgba(255,255,255,0.65),transparent_58%)]',
        className,
      ].join(' ')}
    >
      {children}
    </div>
  );
}

function ActionSurface({ card }: { card: ActionCard }) {
  const body = (
    <SurfaceCard className="group h-full p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/12 hover:shadow-[0_26px_90px_rgba(5,10,34,0.74)]">
      <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} opacity-100`} />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/18 to-transparent" />
      <div className="relative flex h-full flex-col">
        <div className="mb-6 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          {card.icon}
        </div>
        <h3 className="min-h-[56px] text-[27px] font-semibold leading-[1.05] tracking-[-0.03em] text-white lg:text-[29px]">
          {card.title}
        </h3>
        <p className="mt-3 text-[14px] leading-6 text-slate-300/90">{card.description}</p>
        <div className="mt-auto pt-6">
          <div className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 transition group-hover:border-white/20 group-hover:bg-white/8">
            <ArrowIcon />
          </div>
        </div>
      </div>
    </SurfaceCard>
  );

  if (card.href) {
    return <Link to={card.href}>{body}</Link>;
  }

  return (
    <button type="button" onClick={card.action} className="h-full text-left">
      {body}
    </button>
  );
}

export default function PlatformLandingPage() {
  return (
    <div className="min-h-screen bg-[#030816] text-white">
      <div className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_0%,rgba(77,104,255,0.18),transparent_28%),radial-gradient(circle_at_70%_0%,rgba(164,57,255,0.18),transparent_22%),radial-gradient(circle_at_50%_30%,rgba(14,37,94,0.45),transparent_45%),linear-gradient(180deg,#040918_0%,#030815_40%,#050b1d_100%)]" />
        <div className="pointer-events-none absolute left-[4%] top-[120px] h-[420px] w-[420px] rounded-full bg-violet-600/14 blur-[130px]" />
        <div className="pointer-events-none absolute right-[8%] top-[80px] h-[360px] w-[360px] rounded-full bg-blue-500/12 blur-[120px]" />
        <div className="relative mx-auto max-w-[1520px] px-5 pb-10 pt-5 sm:px-6 lg:px-8 lg:pb-16">
          <header className="mb-5 flex flex-col gap-4 rounded-[22px] border border-white/7 bg-[rgba(5,10,27,0.76)] px-5 py-4 backdrop-blur-xl md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <BrandMark />
              <div className="flex items-baseline gap-4">
                <span className="text-[28px] font-semibold tracking-[-0.03em] text-white">CinemaLab</span>
                <span className="hidden text-sm font-medium text-slate-400 sm:inline">Билетная платформа</span>
              </div>
            </div>
            <nav className="flex flex-wrap items-center gap-x-7 gap-y-2 text-sm text-slate-300/90">
              {menuItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-white">
                  {item}
                </a>
              ))}
            </nav>
          </header>

          <section className="grid gap-6 lg:grid-cols-[1.02fr_1.35fr]">
            <SurfaceCard className="min-h-[700px] p-10 lg:p-12">
              <div className="absolute left-[-80px] top-[90px] h-[330px] w-[330px] rounded-full bg-violet-600/14 blur-[110px]" />
              <div className="absolute right-[-110px] top-[-10px] h-[360px] w-[360px] rounded-full bg-blue-500/10 blur-[120px]" />
              <div className="relative flex h-full flex-col">
                <div className="inline-flex w-fit rounded-2xl border border-violet-300/20 bg-violet-500/10 px-5 py-3 text-sm font-medium tracking-wide text-violet-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                  Билетная платформа
                </div>

                <div className="mt-10 max-w-[640px]">
                  <h1 className="text-[74px] font-semibold leading-[0.95] tracking-[-0.055em] text-white sm:text-[86px] lg:text-[92px]">
                    <span className="block">Единая</span>
                    <span className="block">платформа</span>
                    <span className="block">управления</span>
                    <span className="block bg-gradient-to-r from-fuchsia-300 via-violet-300 to-sky-300 bg-clip-text text-transparent">
                      мероприятиями
                    </span>
                    <span className="block">и билетами</span>
                  </h1>

                  <p className="mt-10 max-w-[610px] text-[22px] leading-[1.78] text-slate-300/90 lg:text-[23px]">
                    Демо-портал показывает, как регулятор, организаторы, реселлеры и B2C-витрина
                    работают в одной системе: управляют мероприятиями, ведут билеты, контролируют
                    продажи, получают отчётность и видят общую картину рынка.
                  </p>
                </div>

                <div className="mt-auto grid gap-4 pt-14 sm:grid-cols-3">
                  {[
                    { title: 'Единый реестр мероприятий', icon: <CalendarIcon /> },
                    { title: 'Единый реестр билетов', icon: <TicketIcon /> },
                    { title: 'Отчётность и контроль', icon: <ReportIcon /> },
                  ].map((item) => (
                    <div
                      key={item.title}
                      className="rounded-[26px] border border-white/8 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]"
                    >
                      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/7 text-white">
                        {item.icon}
                      </div>
                      <div className="text-[20px] font-medium leading-[1.18] tracking-[-0.025em] text-white">
                        {item.title}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="min-h-[700px] p-8 lg:p-9">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_0%,rgba(132,71,255,0.16),transparent_28%),radial-gradient(circle_at_20%_15%,rgba(53,124,255,0.12),transparent_25%)]" />
              <div className="relative h-full">
                <div className="mb-8 flex flex-wrap items-start justify-between gap-5">
                  <div>
                    <h2 className="text-[46px] font-semibold tracking-[-0.045em] text-white lg:text-[54px]">
                      Лицензирование
                    </h2>
                    <p className="mt-4 max-w-[520px] text-[20px] leading-[1.45] text-slate-300/90">
                      Лицензирование мероприятий, организаторов, площадок
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      className="h-11 rounded-2xl bg-gradient-to-r from-[#4f7dff] to-[#be4cff] px-6 text-[17px] font-semibold text-white shadow-[0_14px_34px_rgba(102,85,255,0.35)] transition hover:brightness-110"
                    >
                      Добавить мероприятие
                    </button>
                    {[0, 1, 2].map((dot) => (
                      <div
                        key={dot}
                        className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
                      >
                        <span className="h-2.5 w-2.5 rounded-full bg-slate-200/85" />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mb-7 flex flex-wrap gap-3">
                  {['Все', 'Концерты', 'Фестивали', 'Форумы', 'Спорт', 'Выставки'].map((tab, index) => (
                    <button
                      key={tab}
                      type="button"
                      className={[
                        'rounded-full border px-5 py-3 text-[16px] transition',
                        index === 0
                          ? 'border-blue-300/20 bg-blue-500/22 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]'
                          : 'border-white/10 bg-white/[0.035] text-slate-300 hover:border-white/14 hover:text-white',
                      ].join(' ')}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="space-y-4">
                  {previewEvents.map((event) => (
                    <div
                      key={event.title}
                      className="grid gap-4 rounded-[30px] border border-white/8 bg-[linear-gradient(180deg,rgba(6,13,34,0.96),rgba(4,10,24,0.98))] px-4 py-4 shadow-[0_20px_65px_rgba(2,8,28,0.45)] lg:grid-cols-[148px_minmax(0,1.45fr)_auto_170px_170px] lg:items-center lg:px-5"
                    >
                      <div className="h-[132px] w-full overflow-hidden rounded-[24px] border border-white/8 bg-slate-900 shadow-[0_12px_28px_rgba(0,0,0,0.28)]">
                        <img src={event.image} alt={event.title} className="h-full w-full object-cover" />
                      </div>

                      <div className="min-w-0 pr-2">
                        <h3 className="text-[21px] font-semibold leading-[1.14] tracking-[-0.03em] text-white">
                          {event.title}
                        </h3>
                        <div className="mt-4 space-y-2 text-[16px] leading-[1.45] text-slate-300/88">
                          <div>{event.type}</div>
                          <div>{event.date}</div>
                          <div>{event.location}</div>
                        </div>
                      </div>

                      <div className="lg:justify-self-start">
                        <span
                          className={[
                            'inline-flex min-h-[42px] items-center rounded-full border px-4 py-2 text-sm font-semibold',
                            statusClassMap[event.statusTone],
                          ].join(' ')}
                        >
                          {event.status}
                        </span>
                      </div>

                      <div className="text-left lg:text-right">
                        <div className="text-[13px] uppercase tracking-[0.18em] text-slate-500">Продано билетов</div>
                        <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-white lg:text-[20px]">
                          {event.sold}
                        </div>
                      </div>

                      <div className="text-left lg:text-right">
                        <div className="text-[13px] uppercase tracking-[0.18em] text-slate-500">Выручка</div>
                        <div className="mt-2 text-[18px] font-semibold tracking-[-0.02em] text-white lg:text-[20px]">
                          {event.revenue}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </SurfaceCard>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <SurfaceCard className="p-8 lg:p-9">
              <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-white">Быстрый вход в страницы проекта</h2>
              <p className="mt-2 text-[16px] text-slate-400">Откройте ключевые страницы платформы одним кликом</p>
              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {quickLinks.map((card) => (
                  <ActionSurface key={card.title} card={card} />
                ))}
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-8 lg:p-9">
              <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-white">Демо-инструменты</h2>
              <p className="mt-2 text-[16px] text-slate-400">Инструменты для управления демо-средой и загрузки типовых данных</p>
              <div className="mt-7 grid gap-4 md:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                {demoTools.map((card) => (
                  <ActionSurface key={card.title} card={card} />
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="mt-6">
            <SurfaceCard className="p-8 lg:p-9">
              <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-white">Откройте каждую сторону платформы</h2>
              <p className="mt-2 text-[16px] text-slate-400">
                Перед вами ключевые модули и сценарии, через которые платформа работает для всех участников рынка
              </p>
              <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-6">
                {moduleTiles.map((tile) => (
                  <div
                    key={tile.title}
                    className="relative overflow-hidden rounded-[26px] border border-white/8 bg-[linear-gradient(180deg,rgba(8,17,44,0.94),rgba(5,10,26,0.98))] p-5 shadow-[0_18px_50px_rgba(2,8,28,0.36)]"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${tile.tone}`} />
                    <div className="relative">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white">
                        {tile.icon}
                      </div>
                      <h3 className="text-[22px] font-semibold leading-[1.12] tracking-[-0.03em] text-white">{tile.title}</h3>
                      <p className="mt-3 text-[15px] leading-6 text-slate-300/88">{tile.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-[1.02fr_1fr]">
            <SurfaceCard className="p-8 lg:p-9">
              <div className="flex h-full flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-[530px]">
                  <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-white">Единая система для рынка мероприятий</h2>
                  <ul className="mt-6 space-y-5">
                    {marketBullets.map((item, index) => (
                      <li key={item} className="flex items-start gap-4">
                        <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                          {index === 0 ? <RecordIcon /> : index === 1 ? <SyncIcon /> : index === 2 ? <CheckIcon /> : <AnalyticsIcon />}
                        </div>
                        <span className="text-[17px] leading-7 text-slate-300/92">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="relative mx-auto flex h-[260px] w-full max-w-[380px] items-center justify-center overflow-hidden rounded-[34px] border border-white/8 bg-[radial-gradient(circle_at_50%_42%,rgba(116,72,255,0.34),rgba(21,32,70,0.12)_34%,transparent_62%),linear-gradient(180deg,rgba(9,18,46,0.88),rgba(5,11,29,0.98))] lg:mx-0">
                  <div className="absolute h-[190px] w-[190px] rounded-full border border-violet-300/18" />
                  <div className="absolute h-[260px] w-[260px] rounded-full border border-blue-300/10" />
                  <div className="absolute h-[88px] w-[88px] rounded-3xl border border-white/10 bg-white/8 shadow-[0_0_40px_rgba(130,79,255,0.32)]" />
                  <div className="relative z-10 flex h-[92px] w-[92px] items-center justify-center rounded-[28px] border border-white/12 bg-[linear-gradient(180deg,rgba(73,44,145,0.58),rgba(10,16,41,0.9))] text-white shadow-[0_0_38px_rgba(126,82,255,0.28)]">
                    <ShieldIcon large />
                  </div>
                </div>
              </div>
            </SurfaceCard>

            <SurfaceCard className="p-8 lg:p-9">
              <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-white">Всё необходимое в одной платформе</h2>
              <div className="mt-7 grid gap-4 md:grid-cols-2">
                {platformFeatures.map((feature, index) => (
                  <div key={feature} className="rounded-[24px] border border-white/8 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl border border-white/10 bg-white/6">
                      {index === 0 ? <RecordIcon /> : index === 1 ? <KeyIcon /> : index === 2 ? <TicketIcon /> : index === 3 ? <LinkChainIcon /> : index === 4 ? <ReportIcon /> : <HistoryIcon />}
                    </div>
                    <div className="text-[17px] leading-7 text-slate-300/92">{feature}</div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="mt-6">
            <SurfaceCard className="p-0">
              <div className="grid divide-y divide-white/8 md:grid-cols-5 md:divide-x md:divide-y-0">
                {metrics.map((metric) => (
                  <div key={metric.label} className="flex items-center gap-4 px-6 py-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/6 text-white">
                      {metric.icon}
                    </div>
                    <div>
                      <div className="text-[34px] font-semibold leading-none tracking-[-0.04em] text-white">{metric.value}</div>
                      <div className="mt-1 text-[15px] text-slate-400">{metric.label}</div>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="mt-6">
            <SurfaceCard className="p-8 lg:p-9">
              <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-[36px] font-semibold tracking-[-0.04em] text-white">Типовые сценарии в демо</h2>
                  <p className="mt-2 text-[16px] text-slate-400">Примеры событий и форматов, которые проходят через платформу</p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-11 items-center gap-2 self-start rounded-2xl border border-white/10 bg-white/[0.04] px-5 text-sm font-medium text-slate-200 transition hover:border-white/16 hover:bg-white/[0.06]"
                >
                  Смотреть все сценарии
                  <ArrowIcon />
                </button>
              </div>
              <div className="grid gap-4 xl:grid-cols-4">
                {scenarios.map((scenario) => (
                  <div key={scenario.title} className="relative overflow-hidden rounded-[28px] border border-white/8 bg-slate-900">
                    <div className="absolute inset-0 bg-gradient-to-t from-[#060d22] via-[#060d22]/50 to-transparent" />
                    <img src={scenario.image} alt={scenario.title} className="h-[240px] w-full object-cover" />
                    <div className="absolute inset-x-0 bottom-0 p-5">
                      <div className="mb-3 inline-flex rounded-full border border-white/12 bg-black/28 px-3 py-1.5 text-xs font-medium text-white/90 backdrop-blur-sm">
                        {scenario.eyebrow}
                      </div>
                      <h3 className="text-[26px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">{scenario.title}</h3>
                      <p className="mt-3 text-[15px] leading-6 text-slate-300/90">{scenario.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SurfaceCard>
          </section>

          <section className="mt-6">
            <SurfaceCard className="overflow-hidden p-8 lg:p-9">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_30%,rgba(162,79,255,0.22),transparent_26%),radial-gradient(circle_at_88%_100%,rgba(57,123,255,0.28),transparent_28%)]" />
              <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-[38px] font-semibold tracking-[-0.04em] text-white">Готовы посмотреть платформу в действии?</h2>
                  <p className="mt-3 max-w-[720px] text-[18px] leading-8 text-slate-300/90">
                    Откройте демо и посмотрите, как регулятор, организаторы, реселлеры и B2C-витрина работают в одной системе.
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex h-14 items-center gap-3 rounded-2xl bg-gradient-to-r from-[#4178ff] to-[#c04cff] px-8 text-lg font-semibold text-white shadow-[0_16px_42px_rgba(86,80,255,0.36)] transition hover:brightness-110"
                >
                  Запросить демо
                  <ArrowIcon />
                </button>
              </div>
            </SurfaceCard>
          </section>

          <footer className="mt-6 flex flex-col gap-5 rounded-[22px] border border-white/7 bg-[rgba(5,10,27,0.72)] px-5 py-5 text-slate-400 backdrop-blur-xl lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <BrandMark />
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-4">
                <span className="text-[26px] font-semibold tracking-[-0.03em] text-white">CinemaLab</span>
                <span className="text-sm text-slate-400">Билетная платформа</span>
              </div>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
              {menuItems.map((item) => (
                <a key={item} href="#" className="transition hover:text-white">
                  {item}
                </a>
              ))}
            </div>
            <div className="text-sm">© 2025 CinemaLab. Все права защищены.</div>
          </footer>
        </div>
      </div>
    </div>
  );
}

function iconWrapper(path: React.ReactNode, large = false) {
  const size = large ? 'h-8 w-8' : 'h-5 w-5';
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className={size}>
      {path}
    </svg>
  );
}

function UserStackIcon() {
  return iconWrapper(
    <>
      <path d="M15.5 19a4.5 4.5 0 0 0-9 0" />
      <circle cx="11" cy="8" r="3.25" />
      <path d="M17 11.5a3 3 0 0 1 0 6" />
      <path d="M17 7.25a2.25 2.25 0 1 1 0 4.5" />
    </>,
  );
}

function ControlCenterIcon() {
  return iconWrapper(
    <>
      <rect x="3.5" y="4" width="7" height="6.5" rx="1.7" />
      <rect x="13.5" y="4" width="7" height="6.5" rx="1.7" />
      <rect x="3.5" y="13.5" width="7" height="6.5" rx="1.7" />
      <rect x="13.5" y="13.5" width="7" height="6.5" rx="1.7" />
    </>,
  );
}

function ResellerIcon() {
  return iconWrapper(
    <>
      <path d="M6 19v-1.5A3.5 3.5 0 0 1 9.5 14h5A3.5 3.5 0 0 1 18 17.5V19" />
      <circle cx="12" cy="8.25" r="3.25" />
      <path d="M3.5 18.5V17a2.5 2.5 0 0 1 2-2.45" />
      <path d="M20.5 18.5V17a2.5 2.5 0 0 0-2-2.45" />
    </>,
  );
}

function PosterIcon() {
  return iconWrapper(
    <>
      <rect x="5" y="4" width="14" height="16" rx="2" />
      <path d="M8.5 8h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 16h4.5" />
    </>,
  );
}

function ResetIcon() {
  return iconWrapper(
    <>
      <path d="M4.5 9A8 8 0 1 1 6 17.5" />
      <path d="M4.5 4.5V9H9" />
    </>,
  );
}

function UploadIcon() {
  return iconWrapper(
    <>
      <path d="M12 16V7" />
      <path d="m8.5 10.5 3.5-3.5 3.5 3.5" />
      <path d="M5 17.5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2" />
    </>,
  );
}

function PlayIcon() {
  return iconWrapper(
    <>
      <path d="m9 7 8 5-8 5V7Z" />
      <circle cx="12" cy="12" r="9" />
    </>,
  );
}

function ArrowIcon() {
  return iconWrapper(
    <>
      <path d="M5 12h14" />
      <path d="m13 6 6 6-6 6" />
    </>,
  );
}

function ShieldIcon({ large = false }: { large?: boolean }) {
  return iconWrapper(
    <>
      <path d="M12 3.75c2.5 1.7 5.25 2.2 7 2.45v5.25c0 4.18-2.7 7.28-7 8.8-4.3-1.52-7-4.62-7-8.8V6.2c1.75-.25 4.5-.75 7-2.45Z" />
      <path d="m9.5 12.1 1.7 1.8 3.6-3.85" />
    </>,
    large,
  );
}

function CalendarIcon() {
  return iconWrapper(
    <>
      <rect x="4" y="5.25" width="16" height="14" rx="2.25" />
      <path d="M8 3.5v3" />
      <path d="M16 3.5v3" />
      <path d="M4 9.25h16" />
    </>,
  );
}

function TicketIcon() {
  return iconWrapper(
    <>
      <path d="M4 9a2.5 2.5 0 0 1 2.5-2.5h11A2.5 2.5 0 0 1 20 9a2 2 0 0 0 0 4 2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 13a2 2 0 0 0 0-4Z" />
      <path d="M12 7v10" strokeDasharray="2.5 2.5" />
    </>,
  );
}

function ReportIcon() {
  return iconWrapper(
    <>
      <path d="M7 18V9" />
      <path d="M12 18V6" />
      <path d="M17 18v-4" />
      <path d="M4.5 19.5h15" />
    </>,
  );
}

function AnalyticsIcon() {
  return iconWrapper(
    <>
      <path d="M4.5 18.5h15" />
      <path d="M7 18.5v-6" />
      <path d="M12 18.5V8" />
      <path d="M17 18.5V5" />
    </>,
  );
}

function LinkChainIcon() {
  return iconWrapper(
    <>
      <path d="M10.25 13.75 8 16a3 3 0 1 1-4.25-4.25L6 9.5" />
      <path d="m13.75 10.25 2.25-2.25A3 3 0 1 1 20.25 12.25L18 14.5" />
      <path d="m8.75 15.25 6.5-6.5" />
    </>,
  );
}

function PeopleIcon() {
  return iconWrapper(
    <>
      <circle cx="9" cy="8.25" r="3" />
      <circle cx="16.5" cy="9.25" r="2.5" />
      <path d="M4.5 18.5a4.5 4.5 0 0 1 9 0" />
      <path d="M14 18.5a3.5 3.5 0 0 1 7 0" />
    </>,
  );
}

function BuildingsIcon() {
  return iconWrapper(
    <>
      <path d="M4 19.5V8.5L10.5 5v14.5" />
      <path d="M20 19.5V4.5L13.5 7v12.5" />
      <path d="M7 10.5h.01" />
      <path d="M7 14h.01" />
      <path d="M14.5 10.5h.01" />
      <path d="M14.5 14h.01" />
    </>,
  );
}

function RecordIcon() {
  return iconWrapper(
    <>
      <rect x="5" y="4.5" width="14" height="15" rx="2" />
      <path d="M8.5 8.25h7" />
      <path d="M8.5 12h7" />
      <path d="M8.5 15.75h4.5" />
    </>,
  );
}

function SyncIcon() {
  return iconWrapper(
    <>
      <path d="M20 7v5h-5" />
      <path d="M4 17v-5h5" />
      <path d="M6.5 9A7 7 0 0 1 18 7" />
      <path d="M17.5 15A7 7 0 0 1 6 17" />
    </>,
  );
}

function CheckIcon() {
  return iconWrapper(
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="m8.5 12.2 2.3 2.3 4.7-5" />
    </>,
  );
}

function KeyIcon() {
  return iconWrapper(
    <>
      <circle cx="8.25" cy="12" r="3.25" />
      <path d="M11.5 12H20" />
      <path d="M16 12v3" />
      <path d="M18.5 12v2" />
    </>,
  );
}

function HistoryIcon() {
  return iconWrapper(
    <>
      <path d="M4.5 12A7.5 7.5 0 1 0 7 6.4" />
      <path d="M4 4.5v4h4" />
      <path d="M12 8.5V12l2.5 1.75" />
    </>,
  );
}
