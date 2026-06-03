import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";
import type { AgendaItem, ActionItem, LaborTask, Category } from "@/lib/store";
import { dbAgendaToStore, dbActionToStore, dbLaborToStore, dbSettingsToStore } from "./mappers";

export interface HouseholdData {
  agendaItems: AgendaItem[];
  actionItems: ActionItem[];
  laborTasks: LaborTask[];
  meetingDay: string;
  meetingTime: string;
  timeboxDefault: number;
  repeatingCategories: Category[];
  notificationEnabled: boolean;
  notificationMinutesBefore: number;
  partnerName: string | null;
  partnerId: string | null;
}

export async function fetchHouseholdData(
  supabase: SupabaseClient<Database>,
  householdId: string,
  userId: string
): Promise<HouseholdData> {
  const [agendaRes, actionsRes, laborRes, settingsRes, partnerRes] = await Promise.all([
    supabase
      .from("agenda_items")
      .select("*")
      .eq("household_id", householdId)
      .eq("discussed", false),
    supabase
      .from("action_items")
      .select("*")
      .eq("household_id", householdId),
    supabase
      .from("labor_tasks")
      .select("*")
      .eq("household_id", householdId),
    supabase
      .from("meeting_settings")
      .select("*")
      .eq("household_id", householdId)
      .single(),
    supabase
      .from("profiles")
      .select("id, display_name")
      .eq("household_id", householdId)
      .neq("id", userId)
      .maybeSingle(),
  ]);

  const partnerId = partnerRes.data?.id ?? null;
  const partnerName = partnerRes.data?.display_name ?? null;

  const agendaItems = (agendaRes.data ?? []).map((r) => dbAgendaToStore(r, userId, partnerId));
  const actionItems = (actionsRes.data ?? []).map((r) => dbActionToStore(r, userId, partnerId));
  const laborTasks = (laborRes.data ?? []).map((r) => dbLaborToStore(r, userId, partnerId));

  const settings = settingsRes.data
    ? dbSettingsToStore(settingsRes.data)
    : { meetingDay: "Sunday", meetingTime: "8:00 PM", timeboxDefault: 20, repeatingCategories: ["appreciation", "logistics", "division-of-labor", "kids"] as Category[], notificationEnabled: true, notificationMinutesBefore: 30 };

  return {
    agendaItems,
    actionItems,
    laborTasks,
    ...settings,
    partnerName,
    partnerId,
  };
}
