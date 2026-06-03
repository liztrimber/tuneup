"use client";

import { useState } from "react";
import { Plus, X, ChevronDown, ChevronRight, Lock } from "lucide-react";
import {
  useStore,
  LABOR_DOMAINS,
  type LaborDomain,
  type LaborOwner,
  type LaborTask,
} from "@/lib/store";
import CategoryIcon from "./CategoryIcon";

const OWNER_OPTIONS: { value: LaborOwner; label: string; shortLabel: string }[] = [
  { value: "you", label: "Me", shortLabel: "Me" },
  { value: "partner", label: "Partner", shortLabel: "P" },
  { value: "shared", label: "Shared", shortLabel: "Both" },
  { value: "unassigned", label: "Unassigned", shortLabel: "—" },
];

export default function LaborBoardTab() {
  const { laborTasks, setLaborOwner, addLaborTask, removeLaborTask, partnerName } = useStore();
  const [expandedDomain, setExpandedDomain] = useState<LaborDomain | null>(null);
  const [addingIn, setAddingIn] = useState<LaborDomain | null>(null);
  const [addText, setAddText] = useState("");

  const domains = Object.entries(LABOR_DOMAINS) as [LaborDomain, typeof LABOR_DOMAINS[LaborDomain]][];

  const youCount = laborTasks.filter((t) => t.owner === "you").length;
  const partnerCount = laborTasks.filter((t) => t.owner === "partner").length;
  const sharedCount = laborTasks.filter((t) => t.owner === "shared").length;
  const unassignedCount = laborTasks.filter((t) => t.owner === "unassigned").length;
  const total = laborTasks.length;
  const assigned = total - unassignedCount;

  function ownerLabel(owner: LaborOwner): string {
    if (owner === "you") return "Me";
    if (owner === "partner") return partnerName ?? "Partner";
    if (owner === "shared") return "Shared";
    return "Unassigned";
  }

  function ownerColor(owner: LaborOwner): string {
    if (owner === "you") return "bg-primary text-white";
    if (owner === "partner") return "bg-sage text-white";
    if (owner === "shared") return "bg-primary-light text-primary-dark";
    return "bg-muted-light text-muted";
  }

  function handleAdd(domain: LaborDomain) {
    if (!addText.trim()) return;
    addLaborTask(domain, addText.trim());
    setAddText("");
    setAddingIn(null);
  }

  return (
    <div className="px-5 pt-14 pb-6">
      <div className="mb-5">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="text-2xl font-bold">Labor Board</h1>
          <span className="text-xs bg-sage-light text-sage-dark rounded-full px-2 py-0.5 font-medium">
            Premium
          </span>
        </div>
        <p className="text-muted text-sm">
          See who owns what. Drag assignments around anytime.
        </p>
      </div>

      <div className="bg-surface rounded-2xl border border-border p-4 mb-5">
        <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Balance overview
        </p>
        <div className="flex gap-2 mb-3">
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-primary">{youCount}</p>
            <p className="text-xs text-muted">Me</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-sage">{partnerCount}</p>
            <p className="text-xs text-muted">{partnerName ?? "Partner"}</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-foreground">{sharedCount}</p>
            <p className="text-xs text-muted">Shared</p>
          </div>
          <div className="flex-1 text-center">
            <p className="text-2xl font-bold text-muted">{unassignedCount}</p>
            <p className="text-xs text-muted">Open</p>
          </div>
        </div>
        {total > 0 && (
          <div className="flex h-2 rounded-full overflow-hidden bg-muted-light">
            {youCount > 0 && (
              <div className="bg-primary" style={{ width: `${(youCount / total) * 100}%` }} />
            )}
            {partnerCount > 0 && (
              <div className="bg-sage" style={{ width: `${(partnerCount / total) * 100}%` }} />
            )}
            {sharedCount > 0 && (
              <div className="bg-primary-light" style={{ width: `${(sharedCount / total) * 100}%` }} />
            )}
          </div>
        )}
        {assigned > 0 && (
          <p className="text-xs text-muted mt-2 text-center">
            {assigned} of {total} tasks assigned
          </p>
        )}
      </div>

      {domains.map(([domain, meta]) => {
        const tasks = laborTasks.filter((t) => t.domain === domain);
        if (tasks.length === 0 && expandedDomain !== domain) return null;
        const isExpanded = expandedDomain === domain;

        return (
          <div key={domain} className="mb-3">
            <button
              onClick={() => setExpandedDomain(isExpanded ? null : domain)}
              className="w-full flex items-center gap-2.5 p-3 bg-surface rounded-xl border border-border hover:bg-muted-light/50 transition-colors"
            >
              <CategoryIcon name={meta.icon} size={18} style={{ color: meta.color }} />
              <span className="text-sm font-semibold flex-1 text-left">{meta.label}</span>
              <span className="text-xs text-muted">{tasks.length}</span>
              {isExpanded ? <ChevronDown size={16} className="text-muted" /> : <ChevronRight size={16} className="text-muted" />}
            </button>

            {isExpanded && (
              <div className="mt-1 bg-surface rounded-xl border border-border divide-y divide-border">
                {tasks.map((task) => (
                  <div key={task.id} className="p-3 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{task.text}</p>
                    </div>
                    <select
                      value={task.owner}
                      onChange={(e) => setLaborOwner(task.id, e.target.value as LaborOwner)}
                      className={`text-xs font-medium rounded-full px-2.5 py-1 border-0 appearance-none cursor-pointer focus:outline-none ${ownerColor(task.owner)}`}
                    >
                      <option value="unassigned">Unassigned</option>
                      <option value="you">Me</option>
                      <option value="partner">{partnerName ?? "Partner"}</option>
                      <option value="shared">Shared</option>
                    </select>
                    {task.custom && (
                      <button
                        onClick={() => removeLaborTask(task.id)}
                        className="text-muted hover:text-danger transition-colors p-0.5 shrink-0"
                      >
                        <X size={14} />
                      </button>
                    )}
                  </div>
                ))}
                {addingIn === domain ? (
                  <div className="p-3 flex items-center gap-2">
                    <input
                      autoFocus
                      value={addText}
                      onChange={(e) => setAddText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleAdd(domain);
                        if (e.key === "Escape") { setAddingIn(null); setAddText(""); }
                      }}
                      onBlur={() => { if (!addText.trim()) { setAddingIn(null); setAddText(""); } }}
                      placeholder="New task..."
                      className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-muted"
                    />
                    <button
                      onClick={() => handleAdd(domain)}
                      disabled={!addText.trim()}
                      className="w-7 h-7 rounded-full bg-primary flex items-center justify-center disabled:opacity-30 shrink-0"
                    >
                      <Plus size={14} className="text-white" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setAddingIn(domain); setAddText(""); }}
                    className="flex items-center gap-2 p-3 w-full text-sm text-muted hover:text-foreground transition-colors"
                  >
                    <Plus size={14} />
                    <span>Add task</span>
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
