import React, { useState } from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import RegulatorView from "@/components/RegulatorView";
import TicketHubView from "@/components/TicketHubView";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { loadState, generateDemoData, runDemoScenario, resetState, defaultState } from "@/lib/store";
import { toast } from "sonner";

type AdminTab = "applications" | "events" | "tickets" | "ops";

const sidebarItems: { key: AdminTab; label: string }[] = [
  { key: "applications", label: "Заявки" },
  { key: "events", label: "События" },
  { key: "tickets", label: "Билеты" },
  { key: "ops", label: "Операции" },
];

export default function AdminPage() {
  const { state, update, setState } = useStorageSync();
  const [tab, setTab] = useState<AdminTab>("applications");
  const [demoOpen, setDemoOpen] = useState(false);

  const handleGenerateDemo = () => {
    const s = loadState();
    generateDemoData(s);
    setState({ ...s });
    toast.success("Демо-данные сгенерированы");
  };

  const handleRunScenario = () => {
    const s = runDemoScenario();
    setState({ ...s });
    toast.success("Демо-сценарий выполнен");
  };

  const handleReset = () => {
    resetState();
    setState(defaultState());
    toast.success("Сброшено");
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#F4F5F7", color: "#111" }}>
      <Sonner />

      {/* Sidebar */}
      <aside className="w-60 shrink-0 border-r bg-white sticky top-0 h-screen" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="h-14 flex items-center px-5 border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <span className="font-bold text-base tracking-tight">Admin Console</span>
        </div>
        <nav className="py-3">
          {sidebarItems.map((item) => (
            <button key={item.key} onClick={() => setTab(item.key)}
              className={`w-full text-left px-5 py-2.5 text-sm font-medium transition-colors ${
                tab === item.key
                  ? "bg-[#F4F5F7] text-[#111] font-semibold"
                  : "text-[#6B7280] hover:text-[#111] hover:bg-[#F9FAFB]"
              }`}>
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        <header className="sticky top-0 z-40 bg-white border-b h-14 flex items-center justify-end px-6" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
          <button onClick={() => setDemoOpen(true)}
            className="px-4 h-9 rounded-xl bg-[#111] text-white font-semibold text-xs">
            Demo Tools
          </button>
        </header>

        <main className="p-6">
          {tab === "applications" && <RegulatorView state={state} onUpdate={update} />}
          {tab === "events" && <TicketHubView state={state} onUpdate={update} initialTab="events" />}
          {tab === "tickets" && <TicketHubView state={state} onUpdate={update} initialTab="tickets" />}
          {tab === "ops" && <TicketHubView state={state} onUpdate={update} initialTab="ops" />}
        </main>
      </div>

      {/* Demo Tools Drawer */}
      {demoOpen && (
        <div className="fixed inset-0 z-50 flex justify-end" onClick={() => setDemoOpen(false)}>
          <div className="absolute inset-0 bg-black/20" />
          <div className="relative w-full max-w-sm bg-white h-full shadow-xl p-6 overflow-y-auto animate-in slide-in-from-right"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-1">
              <h3 className="text-lg font-semibold">Demo Tools (временное)</h3>
              <button onClick={() => setDemoOpen(false)} className="text-xl text-[#6B7280] hover:text-[#111]">✕</button>
            </div>
            <p className="text-sm text-[#6B7280] mb-6">для демонстрации, будет удалено</p>
            <div className="space-y-3">
              <button onClick={handleGenerateDemo}
                className="w-full px-5 h-11 rounded-xl bg-[#111] text-white font-semibold text-sm">
                Сгенерировать демо-данные
              </button>
              <button onClick={handleRunScenario}
                className="w-full px-5 h-11 rounded-xl bg-[#111] text-white font-semibold text-sm">
                Прогнать демо-сценарий
              </button>
              <button onClick={handleReset}
                className="w-full px-5 h-11 rounded-xl bg-[#111] text-white font-semibold text-sm">
                Сбросить всё
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
