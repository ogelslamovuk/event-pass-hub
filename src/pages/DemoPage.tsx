import React from "react";
import { useStorageSync } from "@/hooks/useStorageSync";
import B2CView from "@/components/B2CView";
import { Toaster as Sonner } from "@/components/ui/sonner";

export default function DemoPage() {
  const { state, update } = useStorageSync();

  return (
    <div
      className="min-h-screen"
      style={{
        background:
          "radial-gradient(ellipse 1100px 600px at 30% -10%, rgba(99,102,241,0.18), transparent 60%), radial-gradient(ellipse 900px 500px at 80% 20%, rgba(139,92,246,0.12), transparent 55%), radial-gradient(ellipse 600px 400px at 50% 100%, rgba(14,165,233,0.08), transparent 50%), #06080E",
        color: "#F1F5F9",
      }}
    >
      <Sonner
        theme="dark"
        toastOptions={{
          style: {
            background: "#111827",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#F1F5F9",
          },
        }}
      />
      <main className="mx-auto max-w-[1280px] px-5 md:px-8 py-0">
        <B2CView state={state} onUpdate={update} />
      </main>
    </div>
  );
}
