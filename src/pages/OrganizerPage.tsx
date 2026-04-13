import React from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import OrganizerView from "@/components/OrganizerView";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function OrganizerPage() {
  const { state, update } = useStorageSync();

  return (
    <div className="min-h-screen" style={{ background: "#FAFAFA" }}>
      <Sonner />
      <header className="sticky top-0 z-40 bg-white border-b" style={{ borderColor: "rgba(0,0,0,0.08)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center">
          <span className="font-bold text-base tracking-tight text-[#111]">Organizer Portal</span>
          <div className="ml-3 w-1 h-5 rounded" style={{ background: "#F2C94C" }} />
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-6">
        <OrganizerView state={state} onUpdate={update} />
      </main>
    </div>
  );
}
