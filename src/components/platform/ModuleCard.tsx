import React from "react";
import { Link } from "react-router-dom";
import { A } from "@/components/admin/adminStyles";

interface Props {
  to: string;
  title: string;
  description: string;
  featured?: boolean;
}

export default function ModuleCard({ to, title, description, featured = false }: Props) {
  return (
    <Link
      to={to}
      className="group block rounded-2xl border p-6 md:p-7 transition-all duration-200"
      style={{
        background: featured ? "rgba(22,32,51,0.92)" : "rgba(17,26,42,0.88)",
        borderColor: featured ? "rgba(99,230,255,0.30)" : A.border,
        boxShadow: featured ? "0 14px 38px rgba(0,0,0,0.36)" : A.cardShadow,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = featured ? "rgba(99,230,255,0.44)" : "rgba(255,255,255,0.16)";
        e.currentTarget.style.transform = "translateY(-1px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = featured ? "rgba(99,230,255,0.30)" : A.border;
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <div className="space-y-2.5">
        <h3
          className="text-xl md:text-2xl font-semibold tracking-tight"
          style={{ color: A.textPrimary, letterSpacing: "-0.2px" }}
        >
          {title}
        </h3>
        <p
          className="text-sm md:text-[15px] leading-6"
          style={{ color: A.textSecondary }}
        >
          {description}
        </p>
      </div>
    </Link>
  );
}
