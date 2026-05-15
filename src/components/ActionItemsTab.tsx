"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { useStore } from "@/lib/store";

export default function ActionItemsTab() {
  const { actionItems, addActionItem, toggleActionItem, removeActionItem } =
    useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [newText, setNewText] = useState("");
  const [newAssignee, setNewAssignee] = useState<"you" | "partner">("you");
  const [filter, setFilter] = useState<"all" | "you" | "partner">("all");

  const pending = actionItems.filter((i) => !i.done);
  const completed = actionItems.filter((i) => i.done);

  const filtered = (items: typeof actionItems) =>
    filter === "all" ? items : items.filter((i) => i.assignee === filter);

  function handleAdd() {
    if (!newText.trim()) return;
    addActionItem(newText.trim(), newAssignee);
    setNewText("");
    setShowAdd(false);
  }

  return (
    <div className="px-5 pt-14 pb-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold">To-dos</h1>
          <p className="text-muted text-sm mt-0.5">
            {pending.length} open, {completed.length} done
          </p>
        </div>
        <button
          onClick={() => setShowAdd(true)}
          className="w-10 h-10 rounded-full bg-primary flex items-center justify-center hover:bg-primary-dark transition-colors active:scale-95"
        >
          <Plus size={20} className="text-white" />
        </button>
      </div>

      <div className="flex gap-2 mb-5">
        {(["all", "you", "partner"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors capitalize ${
              filter === f
                ? "border-primary bg-primary-light text-primary-dark"
                : "border-border text-muted"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
      </div>

      {filtered(pending).length > 0 && (
        <div className="mb-5">
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Open
          </h2>
          <div className="bg-surface rounded-xl border border-border divide-y divide-border">
            {filtered(pending).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4 group">
                <button
                  onClick={() => toggleActionItem(item.id)}
                  className="w-6 h-6 rounded border-2 border-border shrink-0 flex items-center justify-center hover:border-primary transition-colors"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm">{item.text}</p>
                </div>
                <span className="text-xs text-muted bg-muted-light rounded-full px-2 py-0.5 capitalize">
                  {item.assignee}
                </span>
                <button
                  onClick={() => removeActionItem(item.id)}
                  className="text-muted hover:text-danger transition-colors p-1 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {filtered(completed).length > 0 && (
        <div>
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            Done
          </h2>
          <div className="bg-surface rounded-xl border border-border divide-y divide-border">
            {filtered(completed).map((item) => (
              <div key={item.id} className="flex items-center gap-3 p-4 group">
                <button
                  onClick={() => toggleActionItem(item.id)}
                  className="w-6 h-6 rounded bg-primary shrink-0 flex items-center justify-center"
                >
                  <Check size={12} className="text-white" strokeWidth={3} />
                </button>
                <div className="flex-1 min-w-0">
                  <p className="text-sm line-through text-muted">
                    {item.text}
                  </p>
                </div>
                <span className="text-xs text-muted bg-muted-light rounded-full px-2 py-0.5 capitalize">
                  {item.assignee}
                </span>
                <button
                  onClick={() => removeActionItem(item.id)}
                  className="text-muted hover:text-danger transition-colors p-1 shrink-0"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showAdd && (
        <ActionItemSheet onClose={() => setShowAdd(false)} onAdd={handleAdd} newText={newText} setNewText={setNewText} newAssignee={newAssignee} setNewAssignee={setNewAssignee} />
      )}
    </div>
  );
}

function ActionItemSheet({ onClose, onAdd, newText, setNewText, newAssignee, setNewAssignee }: {
  onClose: () => void;
  onAdd: () => void;
  newText: string;
  setNewText: (v: string) => void;
  newAssignee: "you" | "partner";
  setNewAssignee: (v: "you" | "partner") => void;
}) {
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-surface rounded-t-3xl w-full max-w-lg p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-slide-up">
        <h2 className="text-lg font-semibold mb-4">Add to-do</h2>
        <input
          autoFocus
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onAdd()}
          placeholder="What needs to happen?"
          className="w-full bg-muted-light rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted"
        />
        <div className="flex gap-2 mt-3">
          {(["you", "partner"] as const).map((a) => (
            <button
              key={a}
              onClick={() => setNewAssignee(a)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-colors capitalize ${
                newAssignee === a
                  ? "border-primary bg-primary-light text-primary-dark"
                  : "border-border text-muted"
              }`}
            >
              {a === "you" ? "I'll do it" : "Partner"}
            </button>
          ))}
        </div>
        <button
          onClick={onAdd}
          disabled={!newText.trim()}
          className="w-full mt-4 bg-primary text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          Add to-do
        </button>
      </div>
    </div>
  );
}
