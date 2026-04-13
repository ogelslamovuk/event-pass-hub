import React from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import B2CView from "@/components/B2CView";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function DemoPage() {
  const { state, update } = useStorageSync();

  return (
    <div className="min-h-screen" style={{ background: "#FFFFFF", color: "#111" }}>
      <Sonner />
      <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center">
          <span className="font-bold text-base tracking-tight">B2C Demo</span>
          <span className="ml-2 px-2 py-0.5 rounded text-xs font-medium" style={{ background: "#3B82F6", color: "#fff" }}>demo</span>
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <B2CView state={state} onUpdate={update} />
      </main>
    </div>
  );
}
