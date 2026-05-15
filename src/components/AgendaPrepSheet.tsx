"use client";

import { useState, useEffect } from "react";
import { X, Eye, Heart, Hand, ArrowRight, ArrowLeft } from "lucide-react";
import { getCoaching, COACHING_STEPS } from "@/lib/coaching";
import { CATEGORY_META, type Category } from "@/lib/store";

interface Props {
  itemText: string;
  category: Category;
  onClose: () => void;
}

export default function AgendaPrepSheet({ itemText, category, onClose }: Props) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const [step, setStep] = useState(0);
  const [notes, setNotes] = useState(["", "", ""]);
  const coaching = getCoaching(category);
  const meta = CATEGORY_META[category];

  const stepIcons = [Eye, Heart, Hand];
  const Icon = stepIcons[step];
  const content = [coaching.observation, coaching.feeling, coaching.need];

  function updateNote(value: string) {
    const next = [...notes];
    next[step] = value;
    setNotes(next);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-surface rounded-t-3xl w-full max-w-lg max-h-[85vh] overflow-y-auto pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-slide-up">
        <div className="sticky top-0 bg-surface px-5 pt-5 pb-3 border-b border-border z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: meta.color }}
              />
              <span className="text-xs font-medium text-muted">
                {meta.label}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-muted-light flex items-center justify-center"
            >
              <X size={18} className="text-muted" />
            </button>
          </div>
          <h2 className="text-lg font-semibold">Prep for this topic</h2>
          <p className="text-sm text-muted mt-1 leading-snug">
            &ldquo;{itemText}&rdquo;
          </p>
        </div>

        <div className="px-5 pt-4">
          <div className="flex items-center gap-1.5 mb-4">
            {COACHING_STEPS.map((s, i) => (
              <div key={s.key} className="flex items-center gap-1.5">
                <button
                  onClick={() => setStep(i)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                    i === step
                      ? "bg-primary text-white"
                      : i < step
                      ? "bg-primary/20 text-primary-dark"
                      : "bg-muted-light text-muted"
                  }`}
                >
                  {i + 1}
                </button>
                {i < COACHING_STEPS.length - 1 && (
                  <div
                    className={`w-8 h-0.5 rounded ${
                      i < step ? "bg-primary/30" : "bg-muted-light"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          <div className="bg-primary-light/40 rounded-xl p-4 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Icon size={14} className="text-primary" />
              <p className="text-xs font-semibold text-primary-dark uppercase tracking-wider">
                {COACHING_STEPS[step].label} — {COACHING_STEPS[step].description}
              </p>
            </div>
            <p className="text-sm text-primary-dark/80 leading-relaxed">
              {content[step]}
            </p>
          </div>

          <div className="mb-4">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-2">
              Your notes
            </label>
            <textarea
              value={notes[step]}
              onChange={(e) => updateNote(e.target.value)}
              placeholder={
                step === 0
                  ? "What specifically have you noticed?"
                  : step === 1
                  ? "How does it make you feel?"
                  : "What would you like to ask for?"
              }
              className="w-full bg-muted-light rounded-xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted"
            />
          </div>

          {step === 2 && (
            <div className="mb-4">
              <div className="bg-success/5 border border-success/10 rounded-xl p-4">
                <p className="text-xs font-semibold text-success uppercase tracking-wider mb-2">
                  Putting it together
                </p>
                <p className="text-sm text-foreground leading-relaxed">
                  {notes[0] && notes[1] && notes[2] ? (
                    <>
                      &ldquo;{notes[0]}. {notes[1]}. {notes[2]}.&rdquo;
                    </>
                  ) : (
                    <span className="text-muted">
                      Fill in all three steps to see your full framing here.
                    </span>
                  )}
                </p>
              </div>
            </div>
          )}

          <div className="bg-surface rounded-xl border border-border p-4 mb-4">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
              Example reframe
            </p>
            <div className="space-y-2">
              <div>
                <p className="text-xs text-danger font-medium mb-0.5">Instead of:</p>
                <p className="text-sm text-foreground/70 italic">
                  &ldquo;{coaching.beforeAfter.before}&rdquo;
                </p>
              </div>
              <div>
                <p className="text-xs text-success font-medium mb-0.5">Try:</p>
                <p className="text-sm text-foreground leading-relaxed">
                  &ldquo;{coaching.beforeAfter.after}&rdquo;
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pb-2">
            <button
              onClick={() => setStep(Math.max(0, step - 1))}
              disabled={step === 0}
              className="px-4 py-3 rounded-xl border border-border text-sm font-medium flex items-center gap-1 hover:bg-muted-light transition-colors disabled:opacity-30"
            >
              <ArrowLeft size={14} />
              Back
            </button>
            {step < 2 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-1 hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                Next step
                <ArrowRight size={14} />
              </button>
            ) : (
              <button
                onClick={onClose}
                className="flex-1 bg-primary text-white rounded-xl py-3 text-sm font-semibold hover:bg-primary-dark transition-colors active:scale-[0.98]"
              >
                Done prepping
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
