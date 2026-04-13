import React, { useState, useCallback } from "react";
import type { AppState, Role } from "@/lib/store";
import { loadState, saveState, resetState, generateDemoData, runDemoScenario, defaultState } from "@/lib/store";
import { toast } from "sonner";
import OrganizerView from "@/components/OrganizerView";
import RegulatorView from "@/components/RegulatorView";
import TicketHubView from "@/components/TicketHubView";
import ChannelView from "@/components/ChannelView";
import B2CView from "@/components/B2CView";

const roles: { key: Role; label: string; color: string }[] = [
  { key: "organizer", label: "Организатор", color: "bg-role-organizer" },
  { key: "regulator", label: "Регулятор", color: "bg-role-regulator" },
  { key: "tickethub", label: "TicketHub", color: "bg-role-tickethub" },
  { key: "channel", label: "Канал продаж", color: "bg-role-channel" },
  { key: "b2c", label: "B2C demo", color: "bg-role-b2c" },
];

const Index = () => {
  const [state, setState] = useState<AppState>(loadState);
  const [role, setRole] = useState<Role>(state.ui.selectedRole);

  const update = useCallback((s: AppState) => {
    saveState(s);
    setState({ ...s });
  }, []);

  const switchRole = (r: Role) => {
    setRole(r);
    state.ui.selectedRole = r;
    saveState(state);
  };

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-card/95 backdrop-blur border-b border-border shadow-sm">
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight">TicketHub MVP</span>
          <div className="flex gap-1 bg-muted rounded-lg p-1">
            {roles.map((r) => (
              <button key={r.key} onClick={() => switchRole(r.key)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  role === r.key ? `${r.color} shadow-sm` : "hover:bg-card/50"
                }`}>
                {r.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={handleGenerateDemo}
              className="px-3 h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs">
              Демо-данные
            </button>
            <button onClick={handleRunScenario}
              className="px-3 h-9 rounded-xl bg-primary text-primary-foreground font-semibold text-xs">
              Демо-сценарий
            </button>
            <button onClick={handleReset}
              className="px-3 h-9 rounded-xl border border-border font-semibold text-xs">
              Сбросить
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        {role === "organizer" && <OrganizerView state={state} onUpdate={update} />}
        {role === "regulator" && <RegulatorView state={state} onUpdate={update} />}
        {role === "tickethub" && <TicketHubView state={state} onUpdate={update} />}
        {role === "channel" && <ChannelView state={state} onUpdate={update} />}
        {role === "b2c" && <B2CView state={state} onUpdate={update} />}
      </main>
    </div>
  );
};

export default Index;
