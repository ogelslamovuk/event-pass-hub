import React from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import ChannelView from "@/components/ChannelView";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function ChannelPage() {
  const { state, update } = useStorageSync();

  return (
    <div className="min-h-screen" style={{ background: "#0B0F19", color: "#E5E7EB" }}>
      <Sonner />
      <header className="sticky top-0 z-40 border-b" style={{ background: "#111827", borderColor: "rgba(255,255,255,0.08)" }}>
        <div className="max-w-[1200px] mx-auto px-6 h-14 flex items-center">
          <span className="font-bold text-base tracking-tight text-white">Sales Channel</span>
          <div className="ml-3 w-2 h-2 rounded-full" style={{ background: "#22C55E" }} />
        </div>
      </header>
      <main className="max-w-[1200px] mx-auto px-6 py-6 channel-theme">
        <ChannelView state={state} onUpdate={update} />
      </main>
    </div>
  );
}
