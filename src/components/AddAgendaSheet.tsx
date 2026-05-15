"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useStore, CATEGORY_META, type Category } from "@/lib/store";

interface Props {
  onClose: () => void;
  defaultCategory?: Category;
}

export default function AddAgendaSheet({ onClose, defaultCategory }: Props) {
  const addAgendaItem = useStore((s) => s.addAgendaItem);
  const [text, setText] = useState("");
  const [category, setCategory] = useState<Category>(
    defaultCategory ?? "logistics"
  );

  const categories = Object.entries(CATEGORY_META) as [
    Category,
    (typeof CATEGORY_META)[Category]
  ][];

  function handleSubmit() {
    if (!text.trim()) return;
    addAgendaItem(text.trim(), category, "you");
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-surface rounded-t-3xl w-full max-w-lg p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] animate-slide-up">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold">Add to agenda</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-muted-light flex items-center justify-center"
          >
            <X size={18} className="text-muted" />
          </button>
        </div>

        <textarea
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="What do you want to discuss?"
          className="w-full bg-muted-light rounded-xl p-4 text-sm resize-none h-24 focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted"
        />

        <div className="mt-4">
          <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">
            Category
          </p>
          <div className="flex flex-wrap gap-2">
            {categories.map(([key, meta]) => (
              <button
                key={key}
                onClick={() => setCategory(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  category === key
                    ? "border-primary bg-primary-light text-primary-dark"
                    : "border-border text-muted hover:border-muted"
                }`}
              >
                {meta.label}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full mt-5 bg-primary text-white rounded-xl py-3 text-sm font-semibold disabled:opacity-40 hover:bg-primary-dark transition-colors active:scale-[0.98]"
        >
          Add item
        </button>
      </div>
    </div>
  );
}
