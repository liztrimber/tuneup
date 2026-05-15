"use client";

import { useState } from "react";
import { useStore, CATEGORY_META, type Category } from "@/lib/store";
import { Check, UserPlus, X } from "lucide-react";
import CategoryIcon from "./CategoryIcon";

const DAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

const TIMES = [
  "7:00 AM", "8:00 AM", "9:00 AM", "10:00 AM", "11:00 AM",
  "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM",
  "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM",
];

export default function SettingsTab() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteName, setInviteName] = useState("");
  const {
    meetingDay,
    meetingTime,
    timeboxDefault,
    repeatingCategories,
    partnerName,
    setMeetingDay,
    setMeetingTime,
    setTimebox,
    toggleRepeatingCategory,
    setPartnerName,
  } = useStore();

  const categories = Object.entries(CATEGORY_META) as [
    Category,
    (typeof CATEGORY_META)[Category]
  ][];

  return (
    <div className="px-5 pt-14 pb-6">
      <h1 className="text-2xl font-bold mb-6">Settings</h1>

      <section className="mb-6">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Meeting schedule
        </h2>
        <div className="bg-surface rounded-xl border border-border p-4 space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1.5">Day</label>
            <div className="flex flex-wrap gap-2">
              {DAYS.map((d) => (
                <button
                  key={d}
                  onClick={() => setMeetingDay(d)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                    meetingDay === d
                      ? "border-primary bg-primary-light text-primary-dark"
                      : "border-border text-muted"
                  }`}
                >
                  {d.slice(0, 3)}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="text-sm font-medium block mb-1.5">Time</label>
            <select
              value={meetingTime}
              onChange={(e) => setMeetingTime(e.target.value)}
              className="bg-muted-light rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              {TIMES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Timebox
        </h2>
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm mb-3">Default meeting length</p>
          <div className="flex gap-2">
            {[15, 20, 30, 45].map((m) => (
              <button
                key={m}
                onClick={() => setTimebox(m)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                  timeboxDefault === m
                    ? "border-primary bg-primary-light text-primary-dark"
                    : "border-border text-muted"
                }`}
              >
                {m} min
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-6">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Repeating categories
        </h2>
        <p className="text-sm text-muted mb-3">
          These categories appear in every meeting automatically.
        </p>
        <div className="bg-surface rounded-xl border border-border divide-y divide-border">
          {categories
            .filter(([key]) => key !== "appreciation")
            .map(([key, meta]) => {
              const active = repeatingCategories.includes(key);
              return (
                <button
                  key={key}
                  onClick={() => toggleRepeatingCategory(key)}
                  className="flex items-center gap-3 p-3.5 w-full text-left"
                >
                  <CategoryIcon name={meta.icon} size={16} className="shrink-0" style={{ color: meta.color }} />
                  <span className="text-sm flex-1">{meta.label}</span>
                  <div
                    className={`w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      active ? "bg-primary" : "border-2 border-border"
                    }`}
                  >
                    {active && (
                      <Check size={12} className="text-white" strokeWidth={3} />
                    )}
                  </div>
                </button>
              );
            })}
        </div>
        <p className="text-xs text-muted mt-2">
          Appreciation is always included and opens every meeting.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Partner
        </h2>
        {partnerName ? (
          <div className="bg-surface rounded-xl border border-border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{partnerName}</p>
                <p className="text-xs text-success">Connected</p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center">
                  <span className="text-sm font-semibold text-sage-dark">
                    {partnerName[0].toUpperCase()}
                  </span>
                </div>
                <button
                  onClick={() => setPartnerName(null)}
                  className="text-muted hover:text-danger transition-colors p-1"
                >
                  <X size={14} />
                </button>
              </div>
            </div>
          </div>
        ) : showInvite ? (
          <div className="bg-surface rounded-xl border border-border p-4">
            <p className="text-sm font-medium mb-3">Add your partner</p>
            <input
              autoFocus
              value={inviteName}
              onChange={(e) => setInviteName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && inviteName.trim()) {
                  setPartnerName(inviteName.trim());
                  setInviteName("");
                  setShowInvite(false);
                }
              }}
              placeholder="Partner's name"
              className="w-full bg-muted-light rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 placeholder:text-muted mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowInvite(false)}
                className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border text-muted hover:bg-muted-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (inviteName.trim()) {
                    setPartnerName(inviteName.trim());
                    setInviteName("");
                    setShowInvite(false);
                  }
                }}
                disabled={!inviteName.trim()}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white disabled:opacity-40 hover:bg-primary-dark transition-colors"
              >
                Add
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowInvite(true)}
            className="w-full bg-surface rounded-xl border border-dashed border-border p-4 flex items-center gap-3 hover:border-sage transition-colors active:scale-[0.98]"
          >
            <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
              <UserPlus size={18} className="text-sage" />
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold">Add your partner</p>
              <p className="text-xs text-muted">
                Tuneup works best as a team
              </p>
            </div>
          </button>
        )}
      </section>

      <section>
        <h2 className="text-xs font-semibold text-muted uppercase tracking-wider mb-3">
          Coming soon
        </h2>
        <div className="bg-surface rounded-xl border border-border p-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Newborn Mode</span>
            <span className="text-xs bg-muted-light text-muted rounded-full px-2 py-0.5">
              Premium
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Conversation Coaching</span>
            <span className="text-xs bg-muted-light text-muted rounded-full px-2 py-0.5">
              Premium
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted">Meeting History</span>
            <span className="text-xs bg-muted-light text-muted rounded-full px-2 py-0.5">
              Premium
            </span>
          </div>
        </div>
      </section>
    </div>
  );
}
