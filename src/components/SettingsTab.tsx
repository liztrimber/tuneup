"use client";

import { useStore, CATEGORY_META, type Category } from "@/lib/store";
import { Check } from "lucide-react";

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
  const {
    meetingDay,
    meetingTime,
    timeboxDefault,
    repeatingCategories,
    setMeetingDay,
    setMeetingTime,
    setTimebox,
    toggleRepeatingCategory,
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
          Repeating topics
        </h2>
        <p className="text-sm text-muted mb-3">
          These topics appear in every meeting automatically.
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
                  <div
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: meta.color }}
                  />
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
        <div className="bg-surface rounded-xl border border-border p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Alex</p>
              <p className="text-xs text-muted">Connected</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-primary-light flex items-center justify-center">
              <span className="text-sm font-semibold text-primary">A</span>
            </div>
          </div>
        </div>
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
