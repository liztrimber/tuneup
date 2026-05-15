"use client";

import { useState } from "react";
import { ArrowRight, Calendar, MessageCircle, CheckSquare, Heart } from "lucide-react";

interface Props {
  onComplete: () => void;
}

const SLIDES = [
  {
    icon: Calendar,
    color: "#1E3A5F",
    title: "Welcome to Tuneup",
    body: "A weekly conversation for busy parents to keep the household running — and stay connected while doing it.",
  },
  {
    icon: MessageCircle,
    color: "#1E3A5F",
    title: "Structured, not scripted",
    body: "Build a shared agenda through the week. When it's time to meet, the app walks you through each topic — starting with appreciation, then working through logistics, division of labor, and anything else on your mind.",
  },
  {
    icon: Heart,
    color: "#F87171",
    title: "Help when you need it",
    body: "Not sure how to bring something up? Tap \"Need help with this one?\" during any topic for coaching on how to frame it constructively — without blame.",
  },
  {
    icon: CheckSquare,
    color: "#1E3A5F",
    title: "Capture what matters",
    body: "After each conversation, capture to-dos in a shared list. No reminders, no nagging — just a reference you can both check anytime.",
  },
];

export default function OnboardingScreen({ onComplete }: Props) {
  const [slide, setSlide] = useState(0);
  const current = SLIDES[slide];
  const Icon = current.icon;
  const isLast = slide === SLIDES.length - 1;

  return (
    <div className="h-full flex flex-col bg-background">
      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mb-8"
          style={{ backgroundColor: `${current.color}15` }}
        >
          <Icon size={36} style={{ color: current.color }} />
        </div>

        <h1 className="text-2xl font-bold mb-3">{current.title}</h1>
        <p className="text-muted text-sm leading-relaxed max-w-xs">
          {current.body}
        </p>
      </div>

      <div className="px-8 pb-[max(2rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-center gap-2 mb-6">
          {SLIDES.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === slide
                  ? "w-6 bg-primary"
                  : "w-1.5 bg-border"
              }`}
            />
          ))}
        </div>

        <div className="flex gap-3">
          {slide > 0 && (
            <button
              onClick={() => setSlide(slide - 1)}
              className="px-5 py-3.5 rounded-xl border border-border text-sm font-medium hover:bg-muted-light transition-colors"
            >
              Back
            </button>
          )}
          <button
            onClick={() => (isLast ? onComplete() : setSlide(slide + 1))}
            className="flex-1 bg-primary text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98]"
          >
            {isLast ? "Get started" : "Next"}
            <ArrowRight size={16} />
          </button>
        </div>

        {!isLast && (
          <button
            onClick={onComplete}
            className="w-full mt-3 text-sm text-muted py-2 hover:text-foreground transition-colors"
          >
            Skip intro
          </button>
        )}
      </div>
    </div>
  );
}
