"use client";

import { createContext, useContext, useRef, type ReactNode } from "react";
import { useStore } from "@/lib/store";
import { useRealtimeSync } from "@/lib/data/realtime";
import type { HouseholdData } from "@/lib/data/queries";

interface HouseholdContextValue {
  userId: string;
  householdId: string;
  displayName: string;
  partnerId: string | null;
}

const HouseholdContext = createContext<HouseholdContextValue | null>(null);

export function HouseholdProvider({
  userId,
  householdId,
  displayName,
  partnerId,
  initialData,
  children,
}: HouseholdContextValue & { initialData: HouseholdData; children: ReactNode }) {
  const hydrated = useRef(false);
  if (!hydrated.current) {
    useStore.getState()._hydrate({
      ...initialData,
      _userId: userId,
      _householdId: householdId,
      _partnerId: partnerId,
    });
    hydrated.current = true;
  }

  useRealtimeSync(householdId, userId, partnerId);

  return (
    <HouseholdContext value={{ userId, householdId, displayName, partnerId }}>
      {children}
    </HouseholdContext>
  );
}

export function useHousehold() {
  const ctx = useContext(HouseholdContext);
  if (!ctx) throw new Error("useHousehold must be used within HouseholdProvider");
  return ctx;
}
