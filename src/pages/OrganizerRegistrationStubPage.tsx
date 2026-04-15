import React from "react";
import { Link } from "react-router-dom";

export default function OrganizerRegistrationStubPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "#0B0F14", color: "#F5F7FA" }}>
      <div className="w-full max-w-xl rounded-2xl border p-7" style={{ borderColor: "rgba(255,255,255,0.10)", background: "#111A24" }}>
        <h1 className="text-2xl font-bold mb-3">Регистрация организатора</h1>
        <p className="text-sm mb-6" style={{ color: "rgba(245,247,250,0.70)" }}>
          Форма подачи заявки на регистрацию организатора будет добавлена позже.
        </p>
        <Link to="/organizer/login" className="inline-flex h-10 px-4 items-center rounded-xl text-sm font-semibold" style={{ background: "#F2C94C", color: "#111" }}>
          Вернуться ко входу
        </Link>
      </div>
    </div>
  );
}
