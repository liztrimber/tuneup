import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const DEFAULT_LABOR_TASKS = [
  { domain: "meals", text: "Meal planning for the week" },
  { domain: "meals", text: "Grocery shopping" },
  { domain: "meals", text: "Weeknight cooking" },
  { domain: "meals", text: "Kids' lunches & snacks" },
  { domain: "meals", text: "Kitchen cleanup after dinner" },
  { domain: "cleaning", text: "Laundry (wash, fold, put away)" },
  { domain: "cleaning", text: "Bathroom cleaning" },
  { domain: "cleaning", text: "Vacuuming & floors" },
  { domain: "cleaning", text: "Tidying shared spaces" },
  { domain: "cleaning", text: "Trash & recycling out" },
  { domain: "kids-daily", text: "Morning routine (dress, breakfast)" },
  { domain: "kids-daily", text: "Bedtime routine" },
  { domain: "kids-daily", text: "Bath time" },
  { domain: "kids-daily", text: "Homework help" },
  { domain: "kids-daily", text: "Screen time & activity monitoring" },
  { domain: "kids-logistics", text: "School drop-off" },
  { domain: "kids-logistics", text: "School pick-up" },
  { domain: "kids-logistics", text: "Extracurricular scheduling & transport" },
  { domain: "kids-logistics", text: "Playdates & social coordination" },
  { domain: "kids-logistics", text: "School communication & forms" },
  { domain: "finances", text: "Bills & recurring payments" },
  { domain: "finances", text: "Budget tracking" },
  { domain: "finances", text: "Insurance & benefits management" },
  { domain: "maintenance", text: "Repairs & fix-its" },
  { domain: "maintenance", text: "Seasonal maintenance (filters, gutters)" },
  { domain: "maintenance", text: "Coordinating contractors/services" },
  { domain: "social-family", text: "Birthday gifts & cards" },
  { domain: "social-family", text: "Holiday planning & hosting" },
  { domain: "social-family", text: "Keeping in touch with extended family" },
  { domain: "health-medical", text: "Doctor & dentist appointments" },
  { domain: "health-medical", text: "Medications & prescriptions" },
  { domain: "health-medical", text: "Health insurance claims" },
  { domain: "pets", text: "Feeding & water" },
  { domain: "pets", text: "Walks & exercise" },
  { domain: "pets", text: "Vet appointments" },
  { domain: "yard-outdoor", text: "Lawn mowing & yard work" },
  { domain: "yard-outdoor", text: "Garden & plants" },
  { domain: "mental-load", text: "Remembering upcoming events & deadlines" },
  { domain: "mental-load", text: "Noticing what's running low & restocking" },
  { domain: "mental-load", text: "Researching decisions (camps, schools, gear)" },
  { domain: "mental-load", text: "Keeping the family calendar current" },
];

export async function seedHousehold(
  supabase: SupabaseClient<Database>,
  householdId: string
) {
  const laborRows = DEFAULT_LABOR_TASKS.map((t) => ({
    household_id: householdId,
    domain: t.domain,
    text: t.text,
    owner: "unassigned",
    custom: false,
  }));

  const settingsRow = {
    household_id: householdId,
    meeting_day: "Sunday",
    meeting_time: "8:00 PM",
    timebox_default: 20,
    repeating_categories: ["appreciation", "logistics", "division-of-labor", "kids"],
  };

  await Promise.all([
    supabase.from("labor_tasks").insert(laborRows),
    supabase.from("meeting_settings").insert(settingsRow),
  ]);
}
