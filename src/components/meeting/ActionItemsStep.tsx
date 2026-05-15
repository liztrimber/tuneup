"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { Plus, ArrowRight, X } from "lucide-react";

export default function ActionItemsStep() {
  const { actionItems, addActionItem, removeActionItem, setMeetingStep } =
    useStore();
  const [text, setText] = useState("");
  const [assignee, setAssignee] = useState<"you" | "partner">("you");

  const pending = actionItems.filter((i) => !i.done);

  function handleAdd() {
    if (!text.trim()) return;
    addActionItem(text.trim(), assignee);
    setText("");
  }

  return (
    <div className="px-6 pt-6 pb-8">
      <div className="mb-6">
        <p className="text-xs font-semibold text-sage-dark uppercase tracking-wider mb-1">
          Capture to-dos
        </p>
        <h1 className="text-xl font-bold">What needs to happen?</h1>
        <p className="text-muted text-sm mt-1">
          Add any action items from your conversation. They&apos;ll live in your
          shared to-do list.
        </p>
      </div>

      <div className="bg-surface rounded-xl border border-border p-4 mb-4">
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="e.g., Schedule dentist appointment"
          className="w-full text-sm bg-transparent focus:outline-none placeholder:text-muted"
        />
        <div className="flex items-center gap-2 mt-3">
          <div className="flex gap-1.5 flex-1">
            {(["you", "partner"] as const).map((a) => (
              <button
                key={a}
                onClick={() => setAssignee(a)}
                className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors capitalize ${
                  assignee === a
                    ? "border-primary bg-primary-light text-primary-dark"
                    : "border-border text-muted"
                }`}
              >
                {a === "you" ? "Me" : "Partner"}
              </button>
            ))}
          </div>
          <button
            onClick={handleAdd}
            disabled={!text.trim()}
            className="w-10 h-10 min-w-[40px] rounded-full bg-primary flex items-center justify-center disabled:opacity-30 hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} className="text-white" />
          </button>
        </div>
      </div>

      {pending.length > 0 ? (
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            All open to-dos
          </h2>
          <div className="bg-surface rounded-xl border border-border divide-y divide-border">
            {pending.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-3 p-3.5"
              >
                <div className="w-5 h-5 rounded border-2 border-border shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.text}</p>
                </div>
                <span className="text-xs text-muted capitalize bg-muted-light rounded-full px-2 py-0.5">
                  {item.assignee}
                </span>
                <button
                  onClick={() => removeActionItem(item.id)}
                  className="text-muted hover:text-danger transition-colors p-1 shrink-0"
                >
                  <X size={15} />
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-xl border border-dashed border-border p-5 text-center mb-6">
          <p className="text-sm text-muted">
            No to-dos yet — add any from your conversation above, or skip ahead.
          </p>
        </div>
      )}

      <button
        onClick={() => setMeetingStep("close")}
        className="w-full bg-primary text-white rounded-xl py-3.5 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98]"
      >
        Wrap up
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
