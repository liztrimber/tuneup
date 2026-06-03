"use client";

import { useState } from "react";
import { Bell, BellOff, Loader2 } from "lucide-react";
import { useStore } from "@/lib/store";
import { registerAndSubscribe, unsubscribePush } from "@/lib/push/subscribe";

const MINUTE_OPTIONS = [15, 30, 45, 60];

export default function NotificationSettings() {
  const notificationEnabled = useStore((s) => s.notificationEnabled);
  const notificationMinutesBefore = useStore((s) => s.notificationMinutesBefore);
  const setNotificationEnabled = useStore((s) => s.setNotificationEnabled);
  const setNotificationMinutesBefore = useStore((s) => s.setNotificationMinutesBefore);
  const [loading, setLoading] = useState(false);

  async function handleToggle() {
    setLoading(true);
    if (!notificationEnabled) {
      const success = await registerAndSubscribe();
      if (success) {
        setNotificationEnabled(true);
      }
    } else {
      await unsubscribePush();
      setNotificationEnabled(false);
    }
    setLoading(false);
  }

  return (
    <section className="mb-6">
      <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
        Notifications
      </h2>
      <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
        <button
          onClick={handleToggle}
          disabled={loading}
          className="flex items-center justify-between w-full"
        >
          <div className="flex items-center gap-3">
            {notificationEnabled ? (
              <Bell size={18} className="text-sage" />
            ) : (
              <BellOff size={18} className="text-muted" />
            )}
            <span className="text-sm font-medium">
              Meeting reminders
            </span>
          </div>
          {loading ? (
            <Loader2 size={16} className="animate-spin text-muted" />
          ) : (
            <div
              className={`w-10 h-6 rounded-full relative transition-colors ${
                notificationEnabled ? "bg-sage" : "bg-border"
              }`}
            >
              <div
                className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-transform ${
                  notificationEnabled ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </div>
          )}
        </button>

        {notificationEnabled && (
          <div>
            <label className="text-xs text-muted block mb-2">
              Remind me before meeting
            </label>
            <div className="flex gap-2">
              {MINUTE_OPTIONS.map((m) => (
                <button
                  key={m}
                  onClick={() => setNotificationMinutesBefore(m)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    notificationMinutesBefore === m
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border text-muted"
                  }`}
                >
                  {m} min
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
