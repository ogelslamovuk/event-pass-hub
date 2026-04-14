import React from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import B2CView from "@/components/B2CView";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function DemoPage() {
  const { state, update } = useStorageSync();

  return (
    <div className="min-h-screen" style={{ background: "#070B14", color: "#F8FAFC" }}>
      <Sonner />
      <header className="sticky top-0 z-40 border-b" style={{ borderColor: "rgba(255,255,255,0.08)", background: "rgba(7,11,20,0.9)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-base tracking-tight">TicketHub /demo</span>
          <span className="px-2 py-0.5 rounded text-xs font-medium" style={{ background: "rgba(129,140,248,0.2)", color: "#C7D2FE" }}>B2C MVP</span>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <B2CView state={state} onUpdate={update} />
      </main>
    </div>
  );
}
