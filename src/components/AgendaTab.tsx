"use client";

import { useState } from "react";
import { Plus, X, MessageCircle, Repeat } from "lucide-react";
import { useStore, CATEGORY_META, type Category, type AgendaItem } from "@/lib/store";
import AddAgendaSheet from "./AddAgendaSheet";
import AgendaPrepSheet from "./AgendaPrepSheet";
import CategoryIcon from "./CategoryIcon";

export default function AgendaTab() {
  const { agendaItems, repeatingCategories, removeAgendaItem, toggleAgendaItemRepeating, addAgendaItem, partnerName } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [prepItem, setPrepItem] = useState<AgendaItem | null>(null);
  const [quickAddCat, setQuickAddCat] = useState<Category | null>(null);
  const [quickAddText, setQuickAddText] = useState("");

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
          <p className="text-xs text-muted">
            Added by {item.addedBy === "you" ? "me" : partnerName ?? "partner"}
            {item.repeating && <span className="text-sage"> · Repeating</span>}
          </p>
        </div>
        <button
          onClick={() => toggleAgendaItemRepeating(item.id)}
          className={`p-1 shrink-0 transition-colors ${
            item.repeating
              ? "text-sage hover:text-sage-dark"
              : "text-muted/40 hover:text-muted"
          }`}
          title={item.repeating ? "Remove from repeating" : "Repeat every week"}
        >
          <Repeat size={15} />
        </button>
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
          className="w-full bg-primary text-white rounded-xl py-3 text-sm font-semibold flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors active:scale-[0.98] shadow-sm"
        >
          <Plus size={18} />
          Add to agenda
        </button>
      </div>

      {undiscussed.length > 0 ? (
        <div className="bg-sage-light/60 rounded-xl p-3.5 mb-5 flex items-start gap-3">
          <MessageCircle size={16} className="text-sage-dark shrink-0 mt-0.5" />
          <p className="text-xs text-sage-dark leading-relaxed">
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
            <CategoryIcon name={meta.icon} size={16} className="shrink-0" style={{ color: meta.color }} />
            <h2 className="text-sm font-semibold">{meta.label}</h2>
            <span className="text-xs text-muted bg-muted-light rounded-full px-2 py-0.5">
              Repeating
            </span>
          </div>
          <div className="bg-surface rounded-xl border border-border divide-y divide-border">
            {items.map(renderItem)}
            {quickAddCat === category ? (
              <div className="flex items-center gap-2 p-3">
                <input
                  autoFocus
                  value={quickAddText}
                  onChange={(e) => setQuickAddText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && quickAddText.trim()) {
                      addAgendaItem(quickAddText.trim(), category, "you");
                      setQuickAddText("");
                      setQuickAddCat(null);
                    }
                    if (e.key === "Escape") {
                      setQuickAddText("");
                      setQuickAddCat(null);
                    }
                  }}
                  onBlur={() => {
                    if (!quickAddText.trim()) {
                      setQuickAddCat(null);
                      setQuickAddText("");
                    }
                  }}
                  placeholder={`Add to ${meta.label.toLowerCase()}...`}
                  className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-muted"
                />
                <button
                  onClick={() => {
                    if (quickAddText.trim()) {
                      addAgendaItem(quickAddText.trim(), category, "you");
                      setQuickAddText("");
                      setQuickAddCat(null);
                    }
                  }}
                  disabled={!quickAddText.trim()}
                  className="w-7 h-7 rounded-full bg-primary flex items-center justify-center disabled:opacity-30 shrink-0"
                >
                  <Plus size={14} className="text-white" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => { setQuickAddCat(category); setQuickAddText(""); }}
                className="flex items-center gap-2 p-3 w-full text-sm text-muted hover:text-foreground transition-colors"
              >
                <Plus size={14} />
                <span>Add item</span>
              </button>
            )}
          </div>
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
                  <CategoryIcon name={meta.icon} size={16} className="shrink-0" style={{ color: meta.color }} />
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
