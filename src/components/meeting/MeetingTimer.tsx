"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Clock } from "lucide-react";

export default function MeetingTimer() {
  const meeting = useStore((s) => s.meeting);
  const [elapsed, setElapsed] = useState(0);

  const startedAt = meeting?.timeboxStartedAt;
  const totalMs = (meeting?.timeboxMinutes ?? 20) * 60 * 1000;

  useEffect(() => {
    if (!startedAt) return;
    const interval = setInterval(() => {
      setElapsed(Date.now() - startedAt);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt]);

  const remaining = Math.max(0, totalMs - elapsed);
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const progress = Math.min(1, elapsed / totalMs);
  const isOvertime = remaining === 0;

  return (
    <div
      className={`px-4 py-2 flex items-center gap-2 text-xs font-medium ${
        isOvertime
          ? "bg-danger/10 text-danger"
          : "bg-primary-light text-primary-dark"
      }`}
    >
      <Clock size={12} />
      <div className="flex-1 h-1 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isOvertime ? "bg-danger" : "bg-primary"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="tabular-nums w-12 text-right">
        {isOvertime
          ? "Over"
          : `${minutes}:${seconds.toString().padStart(2, "0")}`}
      </span>
    </div>
  );
}
