"use client";

import { useState } from "react";
import { useStore, CATEGORY_META, type Category } from "@/lib/store";
import { Plus, ArrowRight } from "lucide-react";
import AddAgendaSheet from "../AddAgendaSheet";
import CategoryIcon from "../CategoryIcon";

export default function BuildAgenda() {
  const { agendaItems, meeting, setMeetingStep, startTimebox, partnerName } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const undiscussed = agendaItems.filter((i) => !i.discussed);
  const fiveMin = meeting?.fiveMinMode;

  function handleContinue() {
    startTimebox();
    setMeetingStep("appreciation");
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <div className="mb-6">
        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
          {fiveMin ? "Quick tuneup" : "Getting started"}
        </p>
        <h1 className="text-xl font-bold">
          {fiveMin ? "Pick the essentials" : "Review your agenda"}
        </h1>
        <p className="text-muted text-sm mt-1">
          {fiveMin
            ? "You have 5 minutes — focus on what's most important."
            : "Here's what's queued up. Add anything else before we start."}
        </p>
      </div>

      {undiscussed.length > 0 ? (
        <div className="bg-surface rounded-xl border border-border divide-y divide-border mb-4">
          {undiscussed.map((item) => {
            const meta = CATEGORY_META[item.category];
            return (
              <div key={item.id} className="flex items-center gap-3 p-4">
                <CategoryIcon name={meta.icon} size={16} className="shrink-0" style={{ color: meta.color }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.text}</p>
                  <p className="text-xs text-muted">{meta.label}</p>
                </div>
                <span className="text-xs text-muted">
                  {item.addedBy === "you" ? "Me" : partnerName ?? "Partner"}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-dashed border-border p-6 text-center mb-4">
          <p className="text-sm text-muted">
            No items yet — add something to discuss.
          </p>
        </div>
      )}

      <button
        onClick={() => setShowAdd(true)}
        className="w-full bg-surface border border-dashed border-border rounded-xl p-3.5 flex items-center justify-center gap-2 text-sm font-medium text-muted hover:text-primary hover:border-primary transition-colors mb-6"
      >
        <Plus size={16} />
        Add another item
      </button>

      <button
        onClick={handleContinue}
        className="w-full bg-sage text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-sage-dark transition-colors active:scale-[0.98]"
      >
        Start the tuneup
        <ArrowRight size={16} />
      </button>

      {showAdd && <AddAgendaSheet onClose={() => setShowAdd(false)} />}
    </div>
  );
}
