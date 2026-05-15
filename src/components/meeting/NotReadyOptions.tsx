"use client";

import { useStore } from "@/lib/store";
import { Clock, CalendarX, Zap } from "lucide-react";

const MAX_RESCHEDULES = 3;

export default function NotReadyOptions() {
  const { meeting, setMeetingStep, setFiveMinMode, incrementReschedule, endMeeting } = useStore();

  const reschedules = meeting?.rescheduleCount ?? 0;
  const canReschedule = reschedules < MAX_RESCHEDULES;

  function handleFiveMin() {
    setFiveMinMode(true);
    setMeetingStep("build-agenda");
  }

  function handleReschedule() {
    if (!canReschedule) return;
    incrementReschedule();
    endMeeting();
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-6">
        <Clock size={28} className="text-warning" />
      </div>

      <h1 className="text-xl font-bold mb-2">That&apos;s okay</h1>
      <p className="text-muted text-sm mb-8 max-w-xs">
        Not every moment is the right moment. Here are your options:
      </p>

      <div className="w-full max-w-xs space-y-3">
        <button
          onClick={handleFiveMin}
          className="w-full bg-surface border border-border rounded-xl p-4 text-left hover:border-primary transition-colors active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <Zap size={20} className="text-primary shrink-0" />
            <div>
              <p className="text-sm font-semibold">5-minute version</p>
              <p className="text-xs text-muted mt-0.5">
                Cover the essentials, skip the deep dive
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={handleReschedule}
          disabled={!canReschedule}
          className="w-full bg-surface border border-border rounded-xl p-4 text-left hover:border-primary transition-colors active:scale-[0.98] disabled:opacity-50 disabled:hover:border-border"
        >
          <div className="flex items-center gap-3">
            <CalendarX size={20} className="text-muted shrink-0" />
            <div>
              <p className="text-sm font-semibold">Reschedule</p>
              <p className="text-xs text-muted mt-0.5">
                {canReschedule
                  ? `Come back when you're both ready (${MAX_RESCHEDULES - reschedules} left)`
                  : "You've rescheduled a few times — try the 5-minute version instead"}
              </p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setMeetingStep("headspace-you")}
          className="w-full text-sm text-muted py-2 hover:text-foreground transition-colors"
        >
          Go back
        </button>
      </div>
    </div>
  );
}
