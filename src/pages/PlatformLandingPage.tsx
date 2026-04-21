import React from "react";
import { Building2, ShieldCheck, Store, Ticket } from "lucide-react";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { A } from "@/components/admin/adminStyles";
import DemoToolsPanel from "@/components/demo/DemoToolsPanel";
import ModuleCard from "@/components/platform/ModuleCard";
import platformLogo from "../../logo.jpg";

const HERO_TEXT = "Подача заявок, согласование, партнёрские продажи и розничная афиша — в одном цифровом контуре.";

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
            radial-gradient(circle at 12% 8%, rgba(99,230,255,0.1), transparent 36%),
            radial-gradient(circle at 85% 80%, rgba(139,92,246,0.08), transparent 40%),
            linear-gradient(180deg, rgba(9,14,23,0.94) 0%, rgba(10,13,20,0.98) 100%)
          `,
        }}
      />

      <div className="relative mx-auto max-w-[1200px] px-4 md:px-8 py-6 md:py-8">
        <header
          className="h-20 px-5 md:px-6 rounded-2xl border flex items-center"
          style={{
            background: "linear-gradient(180deg, rgba(20,31,49,0.9) 0%, rgba(14,22,36,0.84) 100%)",
            borderColor: A.border,
            backdropFilter: "blur(16px)",
            boxShadow: "0 16px 36px rgba(0,0,0,0.42)",
          }}
        >
          <div className="flex items-center gap-4 min-w-0">
            <div
              className="h-14 w-14 rounded-xl border p-2 shrink-0"
              style={{ borderColor: "rgba(99,230,255,0.34)", background: "rgba(255,255,255,0.04)" }}
            >
              <img src={platformLogo} alt="Логотип платформы" className="h-full w-full object-contain rounded-md" />
            </div>
            <div className="min-w-0">
              <p className="text-base md:text-lg font-semibold tracking-tight" style={{ color: A.textPrimary }}>
                Демо-платформа
              </p>
            </div>
          </div>
        </header>

        <section
          className="mt-8 md:mt-10 rounded-2xl border p-7 md:p-10 text-center"
          style={{
            borderColor: "rgba(255,255,255,0.11)",
            background: "linear-gradient(165deg, rgba(20,31,52,0.9) 0%, rgba(13,21,35,0.86) 100%)",
            boxShadow: "0 24px 46px rgba(0,0,0,0.46)",
          }}
        >
          <h1 className="text-3xl md:text-5xl font-semibold leading-[1.08] tracking-tight">
            Единая платформа управления мероприятиями
          </h1>
          <p className="mt-5 mx-auto max-w-[760px] text-sm md:text-lg leading-7" style={{ color: A.textSecondary }}>
            {HERO_TEXT}
          </p>
        </section>

        <section className="mt-8 md:mt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
            <ModuleCard
              to="/organizer"
              title="Вход для организатора"
              description="Подача заявок, статусы, события."
              role="Организатор"
              icon={<Building2 size={18} />}
              ctaLabel="Перейти"
            />
            <ModuleCard
              featured
              to="/admin"
              title="Центр управления"
              description="Проверка, согласование, контроль."
              role="Главный модуль"
              icon={<ShieldCheck size={18} />}
              ctaLabel="Перейти"
            />
            <ModuleCard
              to="/channel"
              title="Кабинет партнёра"
              description="Каналы продаж, условия, интеграции."
              role="Партнёр"
              icon={<Store size={18} />}
              ctaLabel="Перейти"
            />
            <ModuleCard
              to="/demo"
              title="Афиша и билеты"
              description="Розничная витрина и покупка билетов."
              role="Розница"
              icon={<Ticket size={18} />}
              ctaLabel="Перейти"
            />
          </div>
        </section>

        <section
          id="demo-tools"
          className="mt-8 md:mt-10 rounded-2xl border p-6 md:p-7"
          style={{ background: "rgba(14,21,35,0.78)", borderColor: "rgba(255,255,255,0.09)" }}
        >
          <div className="mb-5">
            <h2 className="text-2xl font-semibold tracking-tight">Управление демо-набором</h2>
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
