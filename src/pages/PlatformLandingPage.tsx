import React from "react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { A } from "@/components/admin/adminStyles";
import DemoToolsPanel from "@/components/demo/DemoToolsPanel";
import ModuleCard from "@/components/platform/ModuleCard";

const HERO_TEXT = "Единая платформа для централизованного управления жизненным циклом мероприятия. Она объединяет подачу и проверку заявок, партнёрские каналы продаж и пользовательскую афишу в одном цифровом контуре. Центр управления — главный модуль системы, где контролируется весь путь события: от заявки до продажи билета.";

const chips = ["Организатор", "Центр управления", "Партнёры", "Афиша и билеты"];

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

      <div className="fixed inset-0 pointer-events-none" style={{ background: A.cosmicGradient }} />

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8 py-6 md:py-8">
        <header
          className="h-14 px-5 rounded-2xl border flex items-center justify-between"
          style={{
            background: "rgba(16,23,38,0.72)",
            borderColor: A.border,
            backdropFilter: "blur(16px)",
          }}
        >
          <span className="text-sm md:text-base font-semibold tracking-tight" style={{ color: A.textPrimary }}>
            Демо-платформа
          </span>
          <a href="#demo-tools" className="text-sm font-medium" style={{ color: A.cyan }}>
            Управление демо
          </a>
        </header>

        <section className="mt-8 md:mt-12 rounded-2xl border p-6 md:p-9" style={{ borderColor: A.border, background: "rgba(17,26,42,0.75)" }}>
          <h1 className="text-3xl md:text-5xl font-semibold leading-tight tracking-tight" style={{ letterSpacing: "-0.4px" }}>
            Единая платформа управления мероприятиями
          </h1>
          <p className="mt-5 max-w-[920px] text-sm md:text-base leading-7" style={{ color: A.textSecondary }}>
            {HERO_TEXT}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {chips.map((chip) => (
              <span
                key={chip}
                className="px-3 py-1.5 rounded-full text-xs md:text-sm"
                style={{ background: "rgba(255,255,255,0.06)", border: `1px solid ${A.border}`, color: A.textSecondary }}
              >
                {chip}
              </span>
            ))}
          </div>
        </section>

        <section className="mt-8 md:mt-10 space-y-4 md:space-y-5">
          <ModuleCard
            featured
            to="/admin"
            title="Центр управления"
            description="Главный модуль системы: проверка, согласование, статусы и контроль всей схемы."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
            <ModuleCard
              to="/organizer"
              title="Кабинет организатора"
              description="Создание событий, подача заявок и работа с документами."
            />
            <ModuleCard
              to="/channel"
              title="Кабинет партнёра"
              description="Партнёрский контур продажи и распространения билетов."
            />
            <ModuleCard
              to="/demo"
              title="Афиша и билеты"
              description="Пользовательская витрина событий с выбором и покупкой билетов."
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
            <p className="mt-1 text-xs" style={{ color: A.textMuted }}>
              Все инструменты демо перенесены сюда из Центра управления.
            </p>
          </div>

          <DemoToolsPanel />
        </section>
      </div>
    </div>
  );
}
