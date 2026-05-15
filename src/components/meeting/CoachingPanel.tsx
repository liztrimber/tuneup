"use client";

import { useState } from "react";
import { getCoaching, COACHING_STEPS } from "@/lib/coaching";
import type { Category } from "@/lib/store";
import {
  ChevronDown,
  ChevronUp,
  Eye,
  Heart,
  Hand,
  MessageCircle,
  Shield,
  ArrowRight,
  ArrowLeft,
} from "lucide-react";

interface Props {
  category: Category;
}

type Panel = "framework" | "before-after" | "turn-taking" | "deescalation";

export default function CoachingPanel({ category }: Props) {
  const [expanded, setExpanded] = useState(false);
  const [activePanel, setActivePanel] = useState<Panel>("framework");
  const [frameworkStep, setFrameworkStep] = useState(0);
  const coaching = getCoaching(category);

  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        className="w-full bg-primary-light/50 border border-primary/10 rounded-xl p-4 flex items-center gap-3 text-left hover:bg-primary-light transition-colors active:scale-[0.98]"
      >
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
          <MessageCircle size={16} className="text-primary" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-semibold text-primary-dark">
            Need help with this one?
          </p>
          <p className="text-xs text-primary-dark/70">
            Tap for coaching on how to frame this conversation
          </p>
        </div>
        <ChevronDown size={16} className="text-primary shrink-0" />
      </button>
    );
  }

  const frameworkContent = [coaching.observation, coaching.feeling, coaching.need];
  const stepIcons = [Eye, Heart, Hand];
  const CurrentStepIcon = stepIcons[frameworkStep];

  return (
    <div className="bg-primary-light/30 border border-primary/15 rounded-2xl overflow-hidden">
      <button
        onClick={() => setExpanded(false)}
        className="w-full px-4 py-3 flex items-center gap-2 text-left border-b border-primary/10"
      >
        <MessageCircle size={16} className="text-primary" />
        <span className="text-sm font-semibold text-primary-dark flex-1">
          Conversation coaching
        </span>
        <ChevronUp size={16} className="text-primary" />
      </button>

      <div className="flex border-b border-primary/10">
        {([
          { key: "framework" as Panel, label: "Framework" },
          { key: "before-after" as Panel, label: "Reframe" },
          { key: "turn-taking" as Panel, label: "Turns" },
          { key: "deescalation" as Panel, label: "Cool down" },
        ]).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActivePanel(tab.key)}
            className={`flex-1 py-2 text-xs font-medium transition-colors ${
              activePanel === tab.key
                ? "text-primary-dark border-b-2 border-primary"
                : "text-primary-dark/50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-4">
        {activePanel === "framework" && (
          <div>
            <div className="flex items-center gap-1.5 mb-3">
              {COACHING_STEPS.map((step, i) => (
                <div key={step.key} className="flex items-center gap-1.5">
                  <button
                    onClick={() => setFrameworkStep(i)}
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      i === frameworkStep
                        ? "bg-primary text-white"
                        : i < frameworkStep
                        ? "bg-primary/20 text-primary-dark"
                        : "bg-white/50 text-primary-dark/40"
                    }`}
                  >
                    {i + 1}
                  </button>
                  {i < COACHING_STEPS.length - 1 && (
                    <div
                      className={`w-6 h-0.5 rounded ${
                        i < frameworkStep ? "bg-primary/30" : "bg-white/50"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            <div className="bg-white/60 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 mb-2">
                <CurrentStepIcon size={14} className="text-primary" />
                <p className="text-xs font-semibold text-primary-dark uppercase tracking-wider">
                  {COACHING_STEPS[frameworkStep].label} —{" "}
                  {COACHING_STEPS[frameworkStep].description}
                </p>
              </div>
              <p className="text-sm text-foreground leading-relaxed">
                {frameworkContent[frameworkStep]}
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setFrameworkStep(Math.max(0, frameworkStep - 1))}
                disabled={frameworkStep === 0}
                className="px-3 py-1.5 rounded-lg text-xs font-medium text-primary-dark/60 hover:bg-white/40 transition-colors disabled:opacity-30 flex items-center gap-1"
              >
                <ArrowLeft size={12} />
                Back
              </button>
              <button
                onClick={() =>
                  setFrameworkStep(
                    Math.min(COACHING_STEPS.length - 1, frameworkStep + 1)
                  )
                }
                disabled={frameworkStep === COACHING_STEPS.length - 1}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-primary/10 text-primary-dark hover:bg-primary/20 transition-colors disabled:opacity-30 flex items-center gap-1"
              >
                Next
                <ArrowRight size={12} />
              </button>
            </div>
          </div>
        )}

        {activePanel === "before-after" && (
          <div className="space-y-3">
            <div className="bg-danger/5 border border-danger/10 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-danger uppercase tracking-wider mb-1.5">
                Instead of this
              </p>
              <p className="text-sm text-foreground/80 italic">
                &ldquo;{coaching.beforeAfter.before}&rdquo;
              </p>
            </div>
            <div className="bg-success/5 border border-success/10 rounded-xl p-3.5">
              <p className="text-xs font-semibold text-success uppercase tracking-wider mb-1.5">
                Try this
              </p>
              <p className="text-sm text-foreground leading-relaxed">
                &ldquo;{coaching.beforeAfter.after}&rdquo;
              </p>
            </div>
          </div>
        )}

        {activePanel === "turn-taking" && (
          <div className="space-y-2">
            {coaching.turnTaking.map((step, i) => (
              <div key={i} className="flex gap-3 bg-white/60 rounded-xl p-3.5">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-primary-dark">
                    {i + 1}
                  </span>
                </div>
                <p className="text-sm text-foreground leading-relaxed flex-1">
                  {step}
                </p>
              </div>
            ))}
          </div>
        )}

        {activePanel === "deescalation" && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 mb-1">
              <Shield size={14} className="text-warning" />
              <p className="text-xs font-semibold text-foreground/70">
                If things get heated, try one of these:
              </p>
            </div>
            {coaching.deescalation.map((tip, i) => (
              <div key={i} className="bg-white/60 rounded-xl p-3.5">
                <p className="text-sm text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
