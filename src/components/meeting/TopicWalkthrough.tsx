"use client";

import { useStore, CATEGORY_META } from "@/lib/store";
import {
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import CoachingPanel from "./CoachingPanel";

export default function TopicWalkthrough() {
  const {
    agendaItems,
    meeting,
    repeatingCategories,
    nextTopic,
    prevTopic,
    markDiscussed,
    setMeetingStep,
  } = useStore();

  const undiscussed = agendaItems.filter((i) => !i.discussed);
  const currentIndex = meeting?.currentTopicIndex ?? 0;

  if (undiscussed.length === 0 || currentIndex >= undiscussed.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full px-8 text-center">
        <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center mb-6">
          <CheckCircle2 size={28} className="text-primary" />
        </div>
        <h1 className="text-xl font-bold mb-2">All topics covered</h1>
        <p className="text-muted text-sm mb-8">
          Nice work. Time to capture any action items.
        </p>
        <button
          onClick={() => setMeetingStep("action-items")}
          className="bg-primary text-white rounded-xl px-8 py-3.5 text-sm font-semibold flex items-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          Capture to-dos
          <ArrowRight size={16} />
        </button>
      </div>
    );
  }

  const item = undiscussed[currentIndex];
  const meta = CATEGORY_META[item.category];
  const isRepeating = repeatingCategories.includes(item.category);

  function handleDone() {
    markDiscussed(item.id);
    if (currentIndex >= undiscussed.length - 1) {
      setMeetingStep("action-items");
    }
  }

  function handleSkip() {
    if (currentIndex >= undiscussed.length - 1) {
      setMeetingStep("action-items");
    } else {
      nextTopic();
    }
  }

  return (
    <div className="px-6 pt-14 pb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
            Topic {currentIndex + 1} of {undiscussed.length}
          </p>
          <div className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            <span className="text-xs font-medium text-muted">
              {meta.label}
              {isRepeating && " · Repeating"}
            </span>
          </div>
        </div>
        <span className="text-xs text-muted capitalize bg-muted-light rounded-full px-2 py-0.5">
          {item.addedBy}
        </span>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-6 mb-5">
        <p className="text-lg font-semibold leading-snug">{item.text}</p>
      </div>

      <div className="mb-5">
        <CoachingPanel category={item.category} />
      </div>

      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 h-1.5 bg-muted-light rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{
              width: `${((currentIndex + 1) / undiscussed.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <div className="flex gap-3">
        {currentIndex > 0 && (
          <button
            onClick={prevTopic}
            className="px-4 py-3 rounded-xl border border-border text-sm font-medium flex items-center gap-1 hover:bg-muted-light transition-colors"
          >
            <ArrowLeft size={14} />
            Back
          </button>
        )}
        <button
          onClick={handleSkip}
          className="flex-1 py-3 rounded-xl border border-border text-sm font-medium hover:bg-muted-light transition-colors"
        >
          Skip
        </button>
        <button
          onClick={handleDone}
          className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          <CheckCircle2 size={14} />
          Discussed
        </button>
      </div>
    </div>
  );
}
