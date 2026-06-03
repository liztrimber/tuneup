import { createClient } from "@/lib/supabase/client";
import type { Database } from "@/lib/supabase/types";
import type { AgendaItem, ActionItem, LaborTask, LaborOwner, Category } from "@/lib/store";
import { storeAgendaToDB, storeActionToDB, storeLaborToDB, mapLaborOwnerToDB } from "./mappers";

function supabase() {
  return createClient();
}

export function persistNewAgendaItem(
  item: AgendaItem,
  householdId: string,
  userId: string,
  partnerId: string | null
) {
  const row = storeAgendaToDB(item, userId, partnerId, householdId);
  supabase().from("agenda_items").insert(row).then(({ error }) => {
    if (error) console.error("persist agenda item:", error.message);
  });
}

export function persistDeleteAgendaItem(id: string) {
  supabase().from("agenda_items").delete().eq("id", id).then(({ error }) => {
    if (error) console.error("delete agenda item:", error.message);
  });
}

export function persistToggleAgendaRepeating(id: string, repeating: boolean) {
  supabase().from("agenda_items").update({ repeating }).eq("id", id).then(({ error }) => {
    if (error) console.error("toggle agenda repeating:", error.message);
  });
}

export function persistMarkDiscussed(id: string) {
  supabase().from("agenda_items").update({ discussed: true }).eq("id", id).then(({ error }) => {
    if (error) console.error("mark discussed:", error.message);
  });
}

export function persistNewActionItem(
  item: ActionItem,
  householdId: string,
  userId: string,
  partnerId: string | null
) {
  const row = storeActionToDB(item, userId, partnerId, householdId);
  supabase().from("action_items").insert(row).then(({ error }) => {
    if (error) console.error("persist action item:", error.message);
  });
}

export function persistToggleActionItem(id: string, done: boolean) {
  const completed_at = done ? new Date().toISOString() : null;
  supabase().from("action_items").update({ done, completed_at }).eq("id", id).then(({ error }) => {
    if (error) console.error("toggle action item:", error.message);
  });
}

export function persistDeleteActionItem(id: string) {
  supabase().from("action_items").delete().eq("id", id).then(({ error }) => {
    if (error) console.error("delete action item:", error.message);
  });
}

export function persistLaborOwner(
  taskId: string,
  owner: LaborOwner,
  userId: string,
  partnerId: string | null
) {
  const dbOwner = mapLaborOwnerToDB(owner, userId, partnerId);
  supabase().from("labor_tasks").update({ owner: dbOwner }).eq("id", taskId).then(({ error }) => {
    if (error) console.error("persist labor owner:", error.message);
  });
}

export function persistNewLaborTask(task: LaborTask, householdId: string, userId: string, partnerId: string | null) {
  const row = storeLaborToDB(task, userId, partnerId, householdId);
  supabase().from("labor_tasks").insert(row).then(({ error }) => {
    if (error) console.error("persist labor task:", error.message);
  });
}

export function persistDeleteLaborTask(id: string) {
  supabase().from("labor_tasks").delete().eq("id", id).then(({ error }) => {
    if (error) console.error("delete labor task:", error.message);
  });
}

export function persistMeetingSettings(
  householdId: string,
  settings: {
    meetingDay?: string;
    meetingTime?: string;
    timeboxDefault?: number;
    repeatingCategories?: Category[];
    notificationEnabled?: boolean;
    notificationMinutesBefore?: number;
  }
) {
  const row: Database["public"]["Tables"]["meeting_settings"]["Insert"] = {
    household_id: householdId,
    ...(settings.meetingDay !== undefined && { meeting_day: settings.meetingDay }),
    ...(settings.meetingTime !== undefined && { meeting_time: settings.meetingTime }),
    ...(settings.timeboxDefault !== undefined && { timebox_default: settings.timeboxDefault }),
    ...(settings.repeatingCategories !== undefined && { repeating_categories: settings.repeatingCategories }),
    ...(settings.notificationEnabled !== undefined && { notification_enabled: settings.notificationEnabled }),
    ...(settings.notificationMinutesBefore !== undefined && { notification_minutes_before: settings.notificationMinutesBefore }),
  };

  supabase()
    .from("meeting_settings")
    .upsert(row, { onConflict: "household_id" })
    .then(({ error }) => {
      if (error) console.error("persist meeting settings:", error.message);
    });
}
