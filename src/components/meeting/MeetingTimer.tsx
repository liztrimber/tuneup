"use client";

import { useState, useEffect } from "react";
import { useStore } from "@/lib/store";
import { Clock, Pause, Play } from "lucide-react";

export default function MeetingTimer() {
  const meeting = useStore((s) => s.meeting);
  const pauseTimebox = useStore((s) => s.pauseTimebox);
  const resumeTimebox = useStore((s) => s.resumeTimebox);
  const [liveElapsed, setLiveElapsed] = useState(0);

  const startedAt = meeting?.timeboxStartedAt;
  const paused = meeting?.timeboxPaused ?? false;
  const pausedElapsed = meeting?.timeboxPausedElapsed ?? 0;
  const totalMs = (meeting?.timeboxMinutes ?? 20) * 60 * 1000;

  useEffect(() => {
    if (!startedAt || paused) return;
    const interval = setInterval(() => {
      setLiveElapsed(Date.now() - startedAt + pausedElapsed);
    }, 1000);
    return () => clearInterval(interval);
  }, [startedAt, paused, pausedElapsed]);

  const elapsed = paused ? pausedElapsed : liveElapsed;
  const remaining = Math.max(0, totalMs - elapsed);
  const minutes = Math.floor(remaining / 60000);
  const seconds = Math.floor((remaining % 60000) / 1000);
  const progress = Math.min(1, elapsed / totalMs);
  const isOvertime = remaining === 0;

  return (
    <div
      className={`px-4 py-2 pt-[max(0.5rem,env(safe-area-inset-top))] flex items-center gap-2 text-xs font-medium ${
        isOvertime
          ? "bg-danger/10 text-danger"
          : paused
          ? "bg-coral-light text-coral-dark"
          : "bg-primary-light text-primary-dark"
      }`}
    >
      <button
        onClick={paused ? resumeTimebox : pauseTimebox}
        className="p-0.5 hover:opacity-70 transition-opacity"
      >
        {paused ? <Play size={12} fill="currentColor" /> : <Pause size={12} />}
      </button>
      <div className="flex-1 h-1 bg-white/50 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ${
            isOvertime ? "bg-danger" : paused ? "bg-coral" : "bg-primary"
          }`}
          style={{ width: `${progress * 100}%` }}
        />
      </div>
      <span className="tabular-nums w-16 text-right">
        {isOvertime
          ? "Over"
          : paused
          ? `${minutes}:${seconds.toString().padStart(2, "0")} ⏸`
          : `${minutes}:${seconds.toString().padStart(2, "0")}`}
      </span>
    </div>
  );
}
