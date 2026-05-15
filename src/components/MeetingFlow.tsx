"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { X } from "lucide-react";
import HeadspaceCheck from "./meeting/HeadspaceCheck";
import NotReadyOptions from "./meeting/NotReadyOptions";
import BuildAgenda from "./meeting/BuildAgenda";
import AppreciationStep from "./meeting/AppreciationStep";
import TopicWalkthrough from "./meeting/TopicWalkthrough";
import ActionItemsStep from "./meeting/ActionItemsStep";
import CloseStep from "./meeting/CloseStep";
import MeetingTimer from "./meeting/MeetingTimer";

const STEP_LABELS: Record<string, string> = {
  "headspace-you": "Check-in",
  "headspace-partner": "Check-in",
  "not-ready-options": "Check-in",
  "build-agenda": "Agenda",
  appreciation: "Appreciation",
  topics: "Topics",
  "action-items": "To-dos",
  close: "Done",
};

export default function MeetingFlow() {
  const meeting = useStore((s) => s.meeting);
  const endMeeting = useStore((s) => s.endMeeting);
  const fiveMin = meeting?.fiveMinMode;
  const [showConfirm, setShowConfirm] = useState(false);

  if (!meeting) return null;

  const showTimer =
    meeting.timeboxActive &&
    !["headspace-you", "headspace-partner", "not-ready-options", "close"].includes(
      meeting.step
    );

  const isClose = meeting.step === "close";
  const stepLabel = STEP_LABELS[meeting.step] ?? "";

  function handleExit() {
    if (isClose) {
      endMeeting();
    } else {
      setShowConfirm(true);
    }
  }

  return (
    <div className="h-full flex flex-col bg-background">
      {!isClose && (
        <div className="bg-surface border-b border-border px-4 py-3 pt-[max(0.75rem,env(safe-area-inset-top))] flex items-center justify-between z-10">
          <button
            onClick={handleExit}
            className="flex items-center gap-1.5 text-sm text-muted hover:text-foreground transition-colors min-h-[44px] pr-2"
          >
            <X size={18} />
            <span>Exit</span>
          </button>
          <span className="text-xs font-semibold text-muted uppercase tracking-wider">
            {fiveMin ? "Quick tuneup" : "Tuneup"} · {stepLabel}
          </span>
          <div className="w-14" />
        </div>
      )}

      {showTimer && <MeetingTimer />}

      <div className="flex-1 overflow-y-auto">
        {meeting.step === "headspace-you" && <HeadspaceCheck who="you" />}
        {meeting.step === "headspace-partner" && (
          <HeadspaceCheck who="partner" />
        )}
        {meeting.step === "not-ready-options" && <NotReadyOptions />}
        {meeting.step === "build-agenda" && <BuildAgenda />}
        {meeting.step === "appreciation" && <AppreciationStep />}
        {meeting.step === "topics" && <TopicWalkthrough />}
        {meeting.step === "action-items" && <ActionItemsStep />}
        {meeting.step === "close" && <CloseStep />}
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowConfirm(false)} />
          <div className="relative bg-surface rounded-2xl w-[calc(100%-3rem)] max-w-sm p-6 text-center animate-slide-up">
            <h2 className="text-lg font-semibold mb-2">Leave this tuneup?</h2>
            <p className="text-sm text-muted mb-5">
              Your agenda items will be saved, but you&apos;ll lose your place in the conversation.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted-light transition-colors"
              >
                Stay
              </button>
              <button
                onClick={() => { setShowConfirm(false); endMeeting(); }}
                className="flex-1 py-3 rounded-xl bg-sage text-white text-sm font-semibold hover:bg-sage-dark transition-colors"
              >
                Leave
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
