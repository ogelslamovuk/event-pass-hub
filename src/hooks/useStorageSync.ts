import { useEffect, useCallback, useRef, useState } from "react";
import type { AppState } from "@/lib/store";
import { loadState, saveState } from "@/lib/store";

const STORAGE_KEY = "ticket_hub_state_v1";

export function useStorageSync() {
  const [state, setState] = useState<AppState>(loadState);
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue) as AppState;
          setState({ ...parsed });
        } catch {}
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const update = useCallback((s: AppState) => {
    saveState(s);
    setState({ ...s });
  }, []);

  return { state, update, setState };
}
