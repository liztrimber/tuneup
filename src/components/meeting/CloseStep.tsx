"use client";

import { useStore } from "@/lib/store";
import { CheckCircle2 } from "lucide-react";

export default function CloseStep() {
  const { endMeeting, meeting } = useStore();
  const fiveMin = meeting?.fiveMinMode;

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-primary-light flex items-center justify-center mb-6">
        <CheckCircle2 size={36} className="text-primary" />
      </div>

      <h1 className="text-2xl font-bold mb-2">
        {fiveMin ? "Quick tuneup done" : "Tuneup complete"}
      </h1>
      <p className="text-muted text-sm mb-3 max-w-xs">
        {fiveMin
          ? "You covered the essentials. Nice work staying connected even when time is short."
          : "Another week of keeping the engine running. Your to-dos are saved and ready to reference anytime."}
      </p>

      <div className="bg-surface rounded-xl border border-border p-4 mb-8 max-w-xs w-full">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
          Reminder
        </p>
        <p className="text-sm text-muted">
          Your to-do list is always available in the To-dos tab. No reminders,
          no pressure — just a shared reference.
        </p>
      </div>

      <button
        onClick={endMeeting}
        className="bg-primary text-white rounded-xl px-8 py-3.5 text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
      >
        Done
      </button>
    </div>
  );
}
