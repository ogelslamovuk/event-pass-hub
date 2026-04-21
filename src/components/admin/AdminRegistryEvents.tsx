import React from "react";
import type { AppState } from "@/lib/store";
import AdminApplications from "./AdminApplications";

interface Props {
  state: AppState;
  onUpdate: (s: AppState) => void;
}

export default function AdminRegistryEvents({ state, onUpdate }: Props) {
  return (
    <AdminApplications
      state={state}
      onUpdate={onUpdate}
      title="Мероприятия"
      subtitle="Реестр одобренных мероприятий"
      fixedStatus="approved"
      hideKpi
    />
  );
}
