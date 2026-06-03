import type { AgendaItem, ActionItem, LaborTask, LaborOwner, Category } from "@/lib/store";
import type { Database } from "@/lib/supabase/types";

type AgendaRow = Database["public"]["Tables"]["agenda_items"]["Row"];
type ActionRow = Database["public"]["Tables"]["action_items"]["Row"];
type LaborRow = Database["public"]["Tables"]["labor_tasks"]["Row"];
type SettingsRow = Database["public"]["Tables"]["meeting_settings"]["Row"];

function mapOwnerFromDB(dbId: string, userId: string, partnerId: string | null): "you" | "partner" {
  return dbId === userId ? "you" : "partner";
}

function mapOwnerToDB(owner: "you" | "partner", userId: string, partnerId: string | null): string {
  if (owner === "you") return userId;
  if (!partnerId) return userId;
  return partnerId;
}

function mapLaborOwnerFromDB(dbOwner: string, userId: string, partnerId: string | null): LaborOwner {
  if (dbOwner === "shared") return "shared";
  if (dbOwner === "unassigned") return "unassigned";
  if (dbOwner === userId) return "you";
  return "partner";
}

function mapLaborOwnerToDB(owner: LaborOwner, userId: string, partnerId: string | null): string {
  if (owner === "shared") return "shared";
  if (owner === "unassigned") return "unassigned";
  if (owner === "you") return userId;
  if (!partnerId) return userId;
  return partnerId;
}

export function dbAgendaToStore(row: AgendaRow, userId: string, partnerId: string | null): AgendaItem {
  return {
    id: row.id,
    text: row.text,
    category: row.category as Category,
    addedBy: mapOwnerFromDB(row.added_by, userId, partnerId),
    repeating: row.repeating,
    discussed: row.discussed,
  };
}

export function storeAgendaToDB(
  item: AgendaItem,
  userId: string,
  partnerId: string | null,
  householdId: string
): Omit<AgendaRow, "created_at"> {
  return {
    id: item.id,
    household_id: householdId,
    text: item.text,
    category: item.category,
    added_by: mapOwnerToDB(item.addedBy, userId, partnerId),
    repeating: item.repeating,
    discussed: item.discussed,
  };
}

export function dbActionToStore(row: ActionRow, userId: string, partnerId: string | null): ActionItem {
  return {
    id: row.id,
    text: row.text,
    assignee: mapOwnerFromDB(row.assignee, userId, partnerId),
    done: row.done,
    createdAt: row.created_at.slice(0, 10),
  };
}

export function storeActionToDB(
  item: ActionItem,
  userId: string,
  partnerId: string | null,
  householdId: string
): Omit<ActionRow, "created_at" | "completed_at"> {
  return {
    id: item.id,
    household_id: householdId,
    meeting_id: null,
    text: item.text,
    assignee: mapOwnerToDB(item.assignee, userId, partnerId),
    done: item.done,
  };
}

export function dbLaborToStore(row: LaborRow, userId: string, partnerId: string | null): LaborTask {
  return {
    id: row.id,
    domain: row.domain as LaborTask["domain"],
    text: row.text,
    owner: mapLaborOwnerFromDB(row.owner, userId, partnerId),
    custom: row.custom,
  };
}

export function storeLaborToDB(
  task: LaborTask,
  userId: string,
  partnerId: string | null,
  householdId: string
): Omit<LaborRow, "created_at"> {
  return {
    id: task.id,
    household_id: householdId,
    domain: task.domain,
    text: task.text,
    owner: mapLaborOwnerToDB(task.owner, userId, partnerId),
    custom: task.custom,
  };
}

export function dbSettingsToStore(row: SettingsRow) {
  return {
    meetingDay: row.meeting_day,
    meetingTime: row.meeting_time,
    timeboxDefault: row.timebox_default,
    repeatingCategories: row.repeating_categories as Category[],
    notificationEnabled: row.notification_enabled,
    notificationMinutesBefore: row.notification_minutes_before,
  };
}

export { mapLaborOwnerToDB };
