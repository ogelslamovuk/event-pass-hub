import React from "react";
import { Link } from "react-router-dom";
import { A } from "@/components/admin/adminStyles";

interface Props {
  to: string;
  title: string;
  description: string;
  featured?: boolean;
  role?: string;
  ctaLabel?: string;
  icon?: React.ReactNode;
}

export default function ModuleCard({
  to,
  title,
  description,
  featured = false,
  role,
  ctaLabel = "Открыть модуль",
  icon,
}: Props) {
  return (
    <Link
      to={to}
      className="group relative block overflow-hidden rounded-2xl border p-6 md:p-7 transition-all duration-300"
      style={{
        background: featured
          ? "linear-gradient(145deg, rgba(24,37,60,0.96) 0%, rgba(16,27,45,0.92) 62%, rgba(14,23,38,0.9) 100%)"
          : "linear-gradient(155deg, rgba(19,30,49,0.92) 0%, rgba(16,24,39,0.88) 100%)",
        borderColor: featured ? "rgba(99,230,255,0.30)" : A.border,
        boxShadow: featured ? "0 22px 42px rgba(0,0,0,0.48)" : "0 12px 34px rgba(0,0,0,0.42)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = featured ? "rgba(99,230,255,0.44)" : "rgba(255,255,255,0.16)";
        e.currentTarget.style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = featured ? "rgba(99,230,255,0.30)" : A.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background: featured
            ? "radial-gradient(circle at 85% 15%, rgba(99,230,255,0.16), transparent 45%)"
            : "radial-gradient(circle at 85% 18%, rgba(99,230,255,0.08), transparent 42%)",
        }}
      />

      <div className="relative">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-center gap-3">
            {icon ? (
              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  borderColor: featured ? "rgba(99,230,255,0.35)" : "rgba(255,255,255,0.14)",
                  color: featured ? A.cyan : A.textSecondary,
                }}
              >
                {icon}
              </div>
            ) : null}
            {role ? (
              <span
                className="inline-flex h-7 items-center rounded-full border px-3 text-[11px] font-medium uppercase tracking-[0.12em]"
                style={{
                  color: featured ? A.cyan : A.textSecondary,
                  borderColor: featured ? "rgba(99,230,255,0.30)" : "rgba(255,255,255,0.14)",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                {role}
              </span>
            ) : null}
          </div>
          <span className="text-lg leading-none" style={{ color: featured ? A.cyan : "rgba(245,247,250,0.65)" }}>
            ↗
          </span>
        </div>

        <h3
          className="text-xl md:text-2xl font-semibold tracking-tight"
          style={{ color: A.textPrimary, letterSpacing: "-0.2px" }}
        >
          {title}
        </h3>
        <p
          className="mt-2.5 text-sm md:text-[15px] leading-6"
          style={{ color: A.textSecondary }}
        >
          {description}
        </p>

        <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium" style={{ color: featured ? A.cyan : A.textPrimary }}>
          <span>{ctaLabel}</span>
          <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
        </div>
      </div>
    </Link>
  );
}
