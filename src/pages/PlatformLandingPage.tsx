import React from "react";
import {
  Activity,
  Building2,
  Compass,
  Cpu,
  ShieldCheck,
  Sparkles,
  Store,
  Ticket,
} from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { A } from "@/components/admin/adminStyles";
import DemoToolsPanel from "@/components/demo/DemoToolsPanel";
import ModuleCard from "@/components/platform/ModuleCard";
import platformLogo from "../../logo.jpg";

const HERO_TEXT =
  "Единый цифровой контур управления событием: от заявки и комплаенса до партнёрских продаж и пользовательской афиши.";

const chips = ["Enterprise Demo Hub", "Unified Control Surface", "Platform Gateway", "Live Modules"];

export default function PlatformLandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{
        background: `${A.pageBg}`,
        color: A.textPrimary,
      }}
    >
      <Sonner
        toastOptions={{
          style: { background: A.cardBg, border: `1px solid ${A.borderGlass}`, color: A.textPrimary },
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `
            radial-gradient(circle at 12% 12%, rgba(99,230,255,0.12), transparent 36%),
            radial-gradient(circle at 86% 18%, rgba(99,230,255,0.10), transparent 34%),
            radial-gradient(circle at 74% 78%, rgba(139,92,246,0.10), transparent 38%),
            ${A.cosmicGradient}
          `,
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8 py-6 md:py-8">
        <header
          className="h-16 px-4 md:px-5 rounded-2xl border flex items-center justify-between"
          style={{
            background: "linear-gradient(180deg, rgba(19,28,45,0.86) 0%, rgba(15,24,38,0.76) 100%)",
            borderColor: A.border,
            backdropFilter: "blur(16px)",
            boxShadow: "0 8px 28px rgba(0,0,0,0.35)",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="h-10 w-10 rounded-xl border p-1.5 shrink-0"
              style={{ borderColor: "rgba(99,230,255,0.28)", background: "rgba(255,255,255,0.03)" }}
            >
              <img src={platformLogo} alt="Platform logo" className="h-full w-full object-contain rounded-md" />
            </div>
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-[0.12em]" style={{ color: A.textMuted }}>
                Event Pass Hub
              </p>
              <p className="text-sm md:text-base font-semibold tracking-tight truncate" style={{ color: A.textPrimary }}>
                Demo Platform Control Gateway
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs">
            <span
              className="inline-flex h-7 items-center rounded-full px-3 border"
              style={{ borderColor: "rgba(99,230,255,0.30)", color: A.cyan, background: "rgba(99,230,255,0.08)" }}
            >
              DEMO ENV
            </span>
            <span
              className="inline-flex h-7 items-center rounded-full px-3 border"
              style={{ borderColor: A.borderLight, color: A.textSecondary, background: "rgba(255,255,255,0.03)" }}
            >
              4 ACTIVE MODULES
            </span>
          </div>
        </header>

        <section
          className="mt-8 md:mt-12 rounded-2xl border p-6 md:p-8 lg:p-9"
          style={{
            borderColor: "rgba(255,255,255,0.11)",
            background: "linear-gradient(165deg, rgba(20,31,52,0.92) 0%, rgba(13,21,35,0.88) 100%)",
            boxShadow: "0 28px 54px rgba(0,0,0,0.46)",
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 lg:gap-10 items-stretch">
            <div>
              <div className="flex flex-wrap gap-2">
                {chips.map((chip) => (
                  <span
                    key={chip}
                    className="px-3 py-1.5 rounded-full text-[11px] md:text-xs uppercase tracking-[0.08em] border"
                    style={{
                      background: "rgba(255,255,255,0.03)",
                      borderColor: "rgba(255,255,255,0.12)",
                      color: A.textSecondary,
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <h1
                className="mt-5 text-3xl md:text-5xl font-semibold leading-[1.05] tracking-tight max-w-[680px]"
                style={{ letterSpacing: "-0.6px" }}
              >
                Enterprise control hub для управления полным циклом мероприятия
              </h1>
              <p className="mt-5 max-w-[660px] text-sm md:text-base leading-7" style={{ color: A.textSecondary }}>
                {HERO_TEXT}
              </p>

              <div className="mt-7 flex flex-wrap items-center gap-3">
                <a
                  href="#platform-modules"
                  className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold border transition-colors"
                  style={{
                    borderColor: "rgba(99,230,255,0.38)",
                    background: "rgba(99,230,255,0.12)",
                    color: A.textPrimary,
                  }}
                >
                  Открыть контур модулей
                </a>
                <a
                  href="#demo-tools"
                  className="inline-flex h-11 items-center justify-center rounded-xl px-5 text-sm font-semibold border transition-colors"
                  style={{
                    borderColor: A.borderLight,
                    background: "rgba(255,255,255,0.03)",
                    color: A.textSecondary,
                  }}
                >
                  Demo control actions
                </a>
              </div>
            </div>

            <div
              className="rounded-2xl border p-5 md:p-6"
              style={{
                borderColor: "rgba(99,230,255,0.24)",
                background: "linear-gradient(180deg, rgba(17,28,46,0.94) 0%, rgba(12,20,34,0.92) 100%)",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="h-11 w-11 rounded-xl border p-1.5" style={{ borderColor: "rgba(99,230,255,0.30)", background: "rgba(255,255,255,0.03)" }}>
                    <img src={platformLogo} alt="Brand mark" className="h-full w-full object-contain rounded-md" />
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-[0.1em]" style={{ color: A.textMuted }}>
                      Platform Identity
                    </p>
                    <p className="text-sm font-semibold">Control Surface Preview</p>
                  </div>
                </div>
                <Sparkles size={18} style={{ color: A.cyan }} />
              </div>

              <div className="mt-5 grid grid-cols-2 gap-3">
                {[
                  { label: "Core Module", value: "Control Center", icon: <ShieldCheck size={14} /> },
                  { label: "Connected Flows", value: "3 Active", icon: <Activity size={14} /> },
                  { label: "Environment", value: "Demo", icon: <Cpu size={14} /> },
                  { label: "Sync", value: "Realtime", icon: <Compass size={14} /> },
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-xl border p-3"
                    style={{ borderColor: "rgba(255,255,255,0.12)", background: "rgba(255,255,255,0.02)" }}
                  >
                    <div className="flex items-center gap-2 text-xs" style={{ color: A.textMuted }}>
                      {item.icon}
                      <span>{item.label}</span>
                    </div>
                    <p className="mt-2 text-sm font-semibold">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section
          className="mt-8 md:mt-10 rounded-2xl border p-5 md:p-6"
          style={{ borderColor: A.border, background: "rgba(15,24,38,0.72)" }}
        >
          <div className="flex items-center justify-between gap-4 mb-4">
            <h2 className="text-xl md:text-2xl font-semibold tracking-tight">Архитектура платформы</h2>
            <span className="text-xs uppercase tracking-[0.1em]" style={{ color: A.textMuted }}>
              Core-connected ecosystem
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="rounded-xl border p-4" style={{ borderColor: A.border, background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: A.textSecondary }}>
                <Building2 size={14} /> Организатор
              </div>
              <p className="mt-1 text-xs" style={{ color: A.textMuted }}>
                Подготовка события и документы
              </p>
            </div>
            <div
              className="rounded-xl border p-4"
              style={{
                borderColor: "rgba(99,230,255,0.34)",
                background: "linear-gradient(155deg, rgba(99,230,255,0.12) 0%, rgba(255,255,255,0.03) 100%)",
              }}
            >
              <div className="flex items-center gap-2 text-sm font-semibold" style={{ color: A.textPrimary }}>
                <ShieldCheck size={14} style={{ color: A.cyan }} /> Центр управления (Core)
              </div>
              <p className="mt-1 text-xs" style={{ color: A.textSecondary }}>
                Согласование, статусы и контроль всего цикла
              </p>
            </div>
            <div className="rounded-xl border p-4" style={{ borderColor: A.border, background: "rgba(255,255,255,0.02)" }}>
              <div className="flex items-center gap-2 text-sm font-medium" style={{ color: A.textSecondary }}>
                <Store size={14} /> Партнёры / Афиша
              </div>
              <p className="mt-1 text-xs" style={{ color: A.textMuted }}>
                Каналы продаж и пользовательский билетный поток
              </p>
            </div>
          </div>
        </section>

        <section id="platform-modules" className="mt-8 md:mt-10 space-y-4 md:space-y-5">
          <ModuleCard
            featured
            to="/admin"
            title="Центр управления"
            description="Главный модуль системы: проверка, согласование, статусы и контроль всей схемы."
            role="Core module"
            icon={<ShieldCheck size={18} />}
            ctaLabel="Перейти в центр управления"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            <ModuleCard
              to="/organizer"
              title="Кабинет организатора"
              description="Создание событий, подача заявок и работа с документами."
              role="Organizer"
              icon={<Building2 size={18} />}
            />
            <ModuleCard
              to="/channel"
              title="Кабинет партнёра"
              description="Партнёрский контур продажи и распространения билетов."
              role="Partner"
              icon={<Store size={18} />}
            />
            <ModuleCard
              to="/demo"
              title="Афиша и билеты"
              description="Пользовательская витрина событий с выбором и покупкой билетов."
              role="B2C Flow"
              icon={<Ticket size={18} />}
            />
          </div>
        </section>

        <section
          id="demo-tools"
          className="mt-8 md:mt-10 rounded-2xl border p-6 md:p-7"
          style={{ background: "rgba(17,26,42,0.88)", borderColor: A.border }}
        >
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">Управление демо</h2>
            <p className="mt-2 text-sm leading-6" style={{ color: A.textSecondary }}>
              Технический блок для управления демонстрационной средой, сценариями и быстрыми действиями.
            </p>
          </div>

          <DemoToolsPanel />
        </section>
      </div>
    </div>
  );
}
