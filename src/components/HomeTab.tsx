"use client";

import { useStore, CATEGORY_META } from "@/lib/store";
import {
  Play,
  Plus,
  ChevronRight,
  Calendar,
  Clock,
  X,
} from "lucide-react";
import { useState } from "react";
import AddAgendaSheet from "./AddAgendaSheet";

export default function HomeTab() {
  const {
    agendaItems,
    actionItems,
    meetingDay,
    meetingTime,
    startMeeting,
    removeAgendaItem,
  } = useStore();
  const [showAdd, setShowAdd] = useState(false);

  const undiscussed = agendaItems.filter((i) => !i.discussed);
  const pendingActions = actionItems.filter((i) => !i.done);

  return (
    <div className="px-5 pt-14 pb-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Tuneup</h1>
        <p className="text-muted text-sm mt-1">
          Keep your household running smoothly.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-5 mb-5">
        <div className="flex items-center gap-2 text-sage-dark text-sm mb-3">
          <Calendar size={15} />
          <span className="font-medium">Next tuneup</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-lg font-semibold">{meetingDay}</p>
            <p className="text-muted text-sm flex items-center gap-1">
              <Clock size={13} />
              {meetingTime}
            </p>
          </div>
          <button
            onClick={startMeeting}
            className="bg-primary text-white rounded-full px-5 py-2.5 text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors active:scale-95"
          >
            <Play size={16} fill="white" />
            Start now
          </button>
        </div>
        {undiscussed.length > 0 && (
          <p className="text-sm text-muted">
            {undiscussed.length} agenda item{undiscussed.length !== 1 && "s"}{" "}
            queued
          </p>
        )}
      </div>

      <button
        onClick={() => setShowAdd(true)}
        className="w-full bg-sage text-white rounded-2xl p-4 flex items-center gap-3 text-left hover:bg-sage-dark transition-colors mb-5 active:scale-[0.98] shadow-sm"
      >
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <Plus size={22} className="text-white" />
        </div>
        <div>
          <p className="text-sm font-semibold">Add to agenda</p>
          <p className="text-xs text-white/80">
            Note something to discuss this week
          </p>
        </div>
      </button>

      {undiscussed.length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            This week&apos;s agenda
          </h2>
          <div className="bg-surface rounded-2xl border border-border divide-y divide-border">
            {undiscussed.slice(0, 4).map((item) => {
              const meta = CATEGORY_META[item.category];
              return (
                <div key={item.id} className="flex items-center gap-3 p-4">
                  <div
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{item.text}</p>
                    <p className="text-xs text-muted">{meta.label}</p>
                  </div>
                  <button
                    onClick={() => removeAgendaItem(item.id)}
                    className="text-muted hover:text-danger transition-colors p-1 shrink-0"
                  >
                    <X size={15} />
                  </button>
                </div>
              );
            })}
            {undiscussed.length > 4 && (
              <div className="p-3 text-center">
                <span className="text-xs text-primary font-medium">
                  +{undiscussed.length - 4} more
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {pendingActions.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-muted uppercase tracking-wider">
              Open to-dos
            </h2>
            <ChevronRight size={14} className="text-muted" />
          </div>
          <div className="bg-surface rounded-2xl border border-border divide-y divide-border">
            {pendingActions.slice(0, 3).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <div className="w-5 h-5 rounded border-2 border-border shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{item.text}</p>
                </div>
                <span className="text-xs text-muted bg-muted-light rounded-full px-2 py-0.5 capitalize">
                  {item.assignee}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && <AddAgendaSheet onClose={() => setShowAdd(false)} />}
    </div>
  );
}
