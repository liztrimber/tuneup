"use client";

import { useStore } from "@/lib/store";
import { ArrowRight, Heart } from "lucide-react";

const PROMPTS = [
  "What's something your partner did this week that made things easier?",
  "What moment this week made you grateful for your partner?",
  "What's something small your partner did that you noticed and appreciated?",
];

export default function AppreciationStep() {
  const { meeting, setMeetingStep } = useStore();
  const fiveMin = meeting?.fiveMinMode;
  const prompt = PROMPTS[Math.floor(Date.now() / 86400000) % PROMPTS.length];

  function handleNext() {
    setMeetingStep("topics");
  }

  return (
    <div className="px-6 pt-14 pb-8">
      <div className="mb-8">
        <p className="text-xs font-semibold text-coral uppercase tracking-wider mb-1">
          Step 1
        </p>
        <h1 className="text-xl font-bold">Appreciation</h1>
        <p className="text-muted text-sm mt-1">
          Start with what&apos;s going well. Take turns sharing.
        </p>
      </div>

      <div className="bg-coral-light/50 border border-coral/20 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-coral-light flex items-center justify-center shrink-0">
            <Heart size={18} className="text-coral" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">
              Conversation prompt
            </p>
            <p className="text-sm text-muted leading-relaxed">{prompt}</p>
          </div>
        </div>
      </div>

      {!fiveMin && (
        <div className="bg-surface rounded-xl border border-border p-4 mb-6">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Tips
          </p>
          <ul className="text-sm text-muted space-y-2">
            <li>Be specific — &quot;thanks for handling bedtime Tuesday&quot; lands better than &quot;thanks for helping&quot;</li>
            <li>Listen fully before responding</li>
            <li>This sets the tone for everything that follows</li>
          </ul>
        </div>
      )}

      <button
        onClick={handleNext}
        className="w-full bg-primary text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98]"
      >
        Continue to topics
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
