import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CarCosts, Climate, Companion, NowCosts, Vehicle } from "./data";

const KEY = "glovebox.v1";

export type AppState = {
  moveDate: string; // YYYY-MM-DD
  vehicle: Vehicle;
  climate: Climate;
  who: Companion[];
  done: Record<string, boolean>;
  night: Record<number, boolean>;
  nightDay: string;
  now: NowCosts;
  car: CarCosts;
};

export const todayISO = () => {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${m}-${day}`;
};

export function defaults(): AppState {
  const d = new Date();
  d.setDate(d.getDate() + 21);
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return {
    moveDate: `${d.getFullYear()}-${m}-${day}`,
    vehicle: "suv",
    climate: "cold",
    who: [],
    done: {},
    night: {},
    nightDay: todayISO(),
    // Example figures so the budget opens in a working state.
    now: { rent: 1450, util: 140, ins: 15, internet: 60 },
    car: { gym: 30, mailbox: 25, storage: 90, phone: 45, gas: 220, food: 420, laundry: 30, parking: 0 },
  };
}

type Ctx = {
  state: AppState;
  ready: boolean;
  update: (patch: Partial<AppState> | ((s: AppState) => Partial<AppState>)) => void;
  reset: () => void;
};

const StateContext = createContext<Ctx | null>(null);

export function StateProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(defaults);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (!raw) return;
        const saved = { ...defaults(), ...JSON.parse(raw) } as AppState;
        // The nightly routine resets each day.
        if (saved.nightDay !== todayISO()) {
          saved.night = {};
          saved.nightDay = todayISO();
        }
        setState(saved);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const update = useCallback<Ctx["update"]>((patch) => {
    setState((s) => ({ ...s, ...(typeof patch === "function" ? patch(s) : patch) }));
  }, []);

  const reset = useCallback(() => setState(defaults()), []);

  return <StateContext.Provider value={{ state, ready, update, reset }}>{children}</StateContext.Provider>;
}

export function useAppState() {
  const ctx = useContext(StateContext);
  if (!ctx) throw new Error("useAppState must be used inside StateProvider");
  return ctx;
}
