"use client";

import { useStore } from "@/lib/store";
import { ThumbsUp, Pause } from "lucide-react";

interface Props {
  who: "you" | "partner";
}

export default function HeadspaceCheck({ who }: Props) {
  const { setMeetingStep } = useStore();
  const isYou = who === "you";
  const label = isYou ? "your" : "your partner's";

  function handleReady() {
    if (isYou) {
      setMeetingStep("headspace-partner");
    } else {
      setMeetingStep("build-agenda");
    }
  }

  function handleNotReady() {
    setMeetingStep("not-ready-options");
  }

  return (
    <div className="flex flex-col items-center justify-center h-full px-8 text-center">
      <div className="w-16 h-16 rounded-full bg-sage-light flex items-center justify-center mb-6">
        <span className="text-3xl">{isYou ? "👋" : "🤝"}</span>
      </div>

      <h1 className="text-xl font-bold mb-2">
        {isYou ? "Before we start" : "Check in with your partner"}
      </h1>
      <p className="text-muted text-sm mb-10 max-w-xs">
        Quick check — is {isYou ? "this" : "now"} a good time for{" "}
        {label} tuneup? Being in the right headspace makes the conversation
        more productive.
      </p>

      <div className="flex gap-3 w-full max-w-xs">
        <button
          onClick={handleReady}
          className="flex-1 bg-primary text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          <ThumbsUp size={16} />
          {isYou ? "I'm ready" : "They're ready"}
        </button>
        <button
          onClick={handleNotReady}
          className="flex-1 bg-muted-light text-foreground rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-border transition-colors active:scale-[0.98]"
        >
          <Pause size={16} />
          Not yet
        </button>
      </div>
    </div>
  );
}
