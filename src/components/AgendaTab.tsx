"use client";

import { useState } from "react";
import { Plus, X, MessageCircle } from "lucide-react";
import { useStore, CATEGORY_META, type Category, type AgendaItem } from "@/lib/store";
import AddAgendaSheet from "./AddAgendaSheet";
import AgendaPrepSheet from "./AgendaPrepSheet";

export default function AgendaTab() {
  const { agendaItems, repeatingCategories, removeAgendaItem } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [prepItem, setPrepItem] = useState<AgendaItem | null>(null);

  const undiscussed = agendaItems.filter((i) => !i.discussed);

  const grouped = repeatingCategories.map((cat) => ({
    category: cat,
    meta: CATEGORY_META[cat],
    items: undiscussed.filter((i) => i.category === cat),
  }));

  const oneOffs = undiscussed.filter(
    (i) => !repeatingCategories.includes(i.category)
  );

  const oneOffCategories = [
    ...new Set(oneOffs.map((i) => i.category)),
  ] as Category[];

  function renderItem(item: AgendaItem) {
    return (
      <div key={item.id} className="flex items-center gap-3 p-3.5">
        <div className="flex-1 min-w-0">
          <p className="text-sm">{item.text}</p>
          <p className="text-xs text-muted capitalize">
            Added by {item.addedBy}
          </p>
        </div>
        <button
          onClick={() => setPrepItem(item)}
          className="text-primary/60 hover:text-primary transition-colors p-1 shrink-0"
          title="Prep for this topic"
        >
          <MessageCircle size={15} />
        </button>
        <button
          onClick={() => removeAgendaItem(item.id)}
          className="text-muted hover:text-danger transition-colors p-1 shrink-0"
        >
          <X size={15} />
        </button>
      </div>
    );
  }

  return (
    <div className="px-5 pt-14 pb-6">
      <div className="mb-5">
        <h1 className="text-2xl font-bold">Agenda</h1>
        <p className="text-muted text-sm mt-0.5 mb-4">
          {undiscussed.length} item{undiscussed.length !== 1 && "s"} for this
          week
        </p>
        <button
          onClick={() => setShowAdd(true)}
          className="w-full bg-coral text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-coral-dark transition-colors active:scale-[0.98] shadow-sm"
        >
          <Plus size={18} />
          Add to agenda
        </button>
      </div>

      {undiscussed.length > 0 ? (
        <div className="bg-coral-light/40 rounded-xl p-3.5 mb-5 flex items-start gap-3">
          <MessageCircle size={16} className="text-coral shrink-0 mt-0.5" />
          <p className="text-xs text-coral-dark leading-relaxed">
            Tap the <span className="font-semibold">chat icon</span> on any item
            to prep how you want to bring it up — before the meeting even starts.
          </p>
        </div>
      ) : (
        <div className="bg-surface rounded-2xl border border-dashed border-border p-6 text-center mb-5">
          <p className="text-sm text-muted mb-1">No agenda items yet</p>
          <p className="text-xs text-muted">
            Add something you want to discuss — it&apos;ll show up here and in your next tuneup.
          </p>
        </div>
      )}

      {grouped.map(({ category, meta, items }) => (
        <div key={category} className="mb-5">
          <div className="flex items-center gap-2 mb-2">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: meta.color }}
            />
            <h2 className="text-sm font-semibold">{meta.label}</h2>
            <span className="text-xs text-muted bg-muted-light rounded-full px-2 py-0.5">
              Repeating
            </span>
          </div>
          {items.length > 0 ? (
            <div className="bg-surface rounded-xl border border-border divide-y divide-border">
              {items.map(renderItem)}
            </div>
          ) : (
            <div className="bg-surface rounded-xl border border-dashed border-border p-4">
              <p className="text-sm text-muted">No items yet</p>
            </div>
          )}
        </div>
      ))}

      {oneOffCategories.length > 0 && (
        <>
          <div className="border-t border-border my-5" />
          <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
            One-off topics
          </h2>
          {oneOffCategories.map((cat) => {
            const meta = CATEGORY_META[cat];
            const items = oneOffs.filter((i) => i.category === cat);
            return (
              <div key={cat} className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: meta.color }}
                  />
                  <h3 className="text-sm font-semibold">{meta.label}</h3>
                </div>
                <div className="bg-surface rounded-xl border border-border divide-y divide-border">
                  {items.map(renderItem)}
                </div>
              </div>
            );
          })}
        </>
      )}

      {showAdd && <AddAgendaSheet onClose={() => setShowAdd(false)} />}
      {prepItem && (
        <AgendaPrepSheet
          itemText={prepItem.text}
          category={prepItem.category}
          onClose={() => setPrepItem(null)}
        />
      )}
    </div>
  );
}
