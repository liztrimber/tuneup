"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useStore } from "@/lib/store";
import { dbAgendaToStore, dbActionToStore, dbLaborToStore } from "./mappers";
import type { Database } from "@/lib/supabase/types";

type AgendaRow = Database["public"]["Tables"]["agenda_items"]["Row"];
type ActionRow = Database["public"]["Tables"]["action_items"]["Row"];
type LaborRow = Database["public"]["Tables"]["labor_tasks"]["Row"];

export function useRealtimeSync(householdId: string, userId: string, partnerId: string | null) {
  useEffect(() => {
    if (!householdId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`household:${householdId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "agenda_items", filter: `household_id=eq.${householdId}` },
        (payload) => handleAgendaChange(payload, userId, partnerId)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "action_items", filter: `household_id=eq.${householdId}` },
        (payload) => handleActionChange(payload, userId, partnerId)
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "labor_tasks", filter: `household_id=eq.${householdId}` },
        (payload) => handleLaborChange(payload, userId, partnerId)
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [householdId, userId, partnerId]);
}

function handleAgendaChange(
  payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> },
  userId: string,
  partnerId: string | null
) {
  const { eventType } = payload;
  const store = useStore.getState();

  if (eventType === "INSERT") {
    const row = payload.new as AgendaRow;
    if (store.agendaItems.some((i) => i.id === row.id)) return;
    const item = dbAgendaToStore(row, userId, partnerId);
    useStore.setState({ agendaItems: [...store.agendaItems, item] });
  }

  if (eventType === "UPDATE") {
    const row = payload.new as AgendaRow;
    const item = dbAgendaToStore(row, userId, partnerId);
    useStore.setState({
      agendaItems: store.agendaItems.map((i) => (i.id === row.id ? item : i)),
    });
  }

  if (eventType === "DELETE") {
    const row = payload.old as { id: string };
    useStore.setState({
      agendaItems: store.agendaItems.filter((i) => i.id !== row.id),
    });
  }
}

function handleActionChange(
  payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> },
  userId: string,
  partnerId: string | null
) {
  const { eventType } = payload;
  const store = useStore.getState();

  if (eventType === "INSERT") {
    const row = payload.new as ActionRow;
    if (store.actionItems.some((i) => i.id === row.id)) return;
    const item = dbActionToStore(row, userId, partnerId);
    useStore.setState({ actionItems: [...store.actionItems, item] });
  }

  if (eventType === "UPDATE") {
    const row = payload.new as ActionRow;
    const item = dbActionToStore(row, userId, partnerId);
    useStore.setState({
      actionItems: store.actionItems.map((i) => (i.id === row.id ? item : i)),
    });
  }

  if (eventType === "DELETE") {
    const row = payload.old as { id: string };
    useStore.setState({
      actionItems: store.actionItems.filter((i) => i.id !== row.id),
    });
  }
}

function handleLaborChange(
  payload: { eventType: string; new: Record<string, unknown>; old: Record<string, unknown> },
  userId: string,
  partnerId: string | null
) {
  const { eventType } = payload;
  const store = useStore.getState();

  if (eventType === "INSERT") {
    const row = payload.new as LaborRow;
    if (store.laborTasks.some((t) => t.id === row.id)) return;
    const task = dbLaborToStore(row, userId, partnerId);
    useStore.setState({ laborTasks: [...store.laborTasks, task] });
  }

  if (eventType === "UPDATE") {
    const row = payload.new as LaborRow;
    const task = dbLaborToStore(row, userId, partnerId);
    useStore.setState({
      laborTasks: store.laborTasks.map((t) => (t.id === row.id ? task : t)),
    });
  }

  if (eventType === "DELETE") {
    const row = payload.old as { id: string };
    useStore.setState({
      laborTasks: store.laborTasks.filter((t) => t.id !== row.id),
    });
  }
}
