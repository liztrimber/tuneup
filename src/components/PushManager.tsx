"use client";

import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { scheduleLocalNotification } from "@/lib/push/schedule-local";

export default function PushManager() {
  const meetingDay = useStore((s) => s.meetingDay);
  const meetingTime = useStore((s) => s.meetingTime);
  const notificationEnabled = useStore((s) => s.notificationEnabled);
  const notificationMinutesBefore = useStore((s) => s.notificationMinutesBefore);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);

  useEffect(() => {
    if (!notificationEnabled) return;
    const cleanup = scheduleLocalNotification(meetingDay, meetingTime, notificationMinutesBefore);
    return () => { cleanup?.(); };
  }, [meetingDay, meetingTime, notificationEnabled, notificationMinutesBefore]);

  return null;
}
