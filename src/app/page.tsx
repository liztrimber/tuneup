import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { fetchHouseholdData } from "@/lib/data/queries";
import { HouseholdProvider } from "@/lib/household-context";
import AppShell from "@/components/AppShell";

export default async function Page() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, household_id")
    .eq("id", user.id)
    .single();

  if (!profile?.display_name || !profile?.household_id) {
    redirect("/setup");
  }

  const initialData = await fetchHouseholdData(supabase, profile.household_id, user.id);

  return (
    <div className="h-full max-w-lg mx-auto">
      <HouseholdProvider
        userId={user.id}
        householdId={profile.household_id}
        displayName={profile.display_name}
        partnerId={initialData.partnerId}
        initialData={initialData}
      >
        <AppShell />
      </HouseholdProvider>
    </div>
  );
}
