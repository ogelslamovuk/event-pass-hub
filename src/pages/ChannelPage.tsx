import React from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import ChannelView from "@/components/ChannelView";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function ChannelPage() {
  const { state, update } = useStorageSync();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(1200px 500px at 10% -20%, rgba(56,189,248,0.16), transparent 55%), radial-gradient(900px 500px at 90% -10%, rgba(129,140,248,0.18), transparent 55%), #070B14",
        color: "#E5E7EB",
      }}
    >
      <Sonner />
      <main className="mx-auto max-w-[1300px] px-4 py-5 md:px-6">
        <ChannelView state={state} onUpdate={update} />
      </main>
    </div>
  );
}
