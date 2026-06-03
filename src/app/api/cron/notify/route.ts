import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import type { NextRequest } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

  const { data: households } = await supabase
    .from("meeting_settings")
    .select("household_id, meeting_time")
    .eq("meeting_day", today)
    .eq("notification_enabled", true);

  if (!households?.length) {
    return Response.json({ sent: 0 });
  }

  const householdIds = households.map((h) => h.household_id);

  const { data: profiles } = await supabase
    .from("profiles")
    .select("id, household_id")
    .in("household_id", householdIds);

  const userIds = (profiles ?? []).map((p) => p.id);

  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("*")
    .in("user_id", userIds);

  let sent = 0;
  for (const sub of subscriptions ?? []) {
    const profile = profiles?.find((p) => p.id === sub.user_id);
    const household = households.find(
      (h) => h.household_id === profile?.household_id
    );

    const payload = JSON.stringify({
      title: "Tuneup Today!",
      body: `Your weekly tuneup is at ${household?.meeting_time ?? "the usual time"}. See you there!`,
      url: "/",
    });

    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        payload
      );
      sent++;
    } catch (err: unknown) {
      const status = (err as { statusCode?: number }).statusCode;
      if (status === 410 || status === 404) {
        await supabase.from("push_subscriptions").delete().eq("id", sub.id);
      }
    }
  }

  return Response.json({ sent });
}
