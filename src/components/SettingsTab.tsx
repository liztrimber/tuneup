"use client";

import { useState } from "react";
import { useStore, CATEGORY_META, type Category } from "@/lib/store";
import { useHousehold } from "@/lib/household-context";
import { createClient } from "@/lib/supabase/client";
import { Check, UserPlus, Copy, Share2, Loader2 } from "lucide-react";
import CategoryIcon from "./CategoryIcon";
import NotificationSettings from "./NotificationSettings";

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
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [copied, setCopied] = useState(false);
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

      <NotificationSettings />

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

      <PartnerSection
        partnerName={partnerName}
        showInvite={showInvite}
        setShowInvite={setShowInvite}
        inviteLink={inviteLink}
        setInviteLink={setInviteLink}
        inviteLoading={inviteLoading}
        setInviteLoading={setInviteLoading}
        copied={copied}
        setCopied={setCopied}
      />

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

function PartnerSection({
  partnerName,
  showInvite,
  setShowInvite,
  inviteLink,
  setInviteLink,
  inviteLoading,
  setInviteLoading,
  copied,
  setCopied,
}: {
  partnerName: string | null;
  showInvite: boolean;
  setShowInvite: (v: boolean) => void;
  inviteLink: string | null;
  setInviteLink: (v: string | null) => void;
  inviteLoading: boolean;
  setInviteLoading: (v: boolean) => void;
  copied: boolean;
  setCopied: (v: boolean) => void;
}) {
  const { userId, householdId } = useHousehold();

  async function generateInvite() {
    setInviteLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("invites")
      .insert({ household_id: householdId, invited_by: userId })
      .select("code")
      .single();

    setInviteLoading(false);
    if (error) {
      console.error("create invite:", error.message);
      return;
    }
    const link = `${window.location.origin}/invite?code=${data.code}`;
    setInviteLink(link);
    setShowInvite(true);
  }

  async function copyLink() {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function shareLink() {
    if (!inviteLink) return;
    if (navigator.share) {
      await navigator.share({ title: "Join me on Tuneup", url: inviteLink });
    } else {
      copyLink();
    }
  }

  return (
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
            <div className="w-8 h-8 rounded-full bg-sage-light flex items-center justify-center">
              <span className="text-sm font-semibold text-sage-dark">
                {partnerName[0].toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      ) : showInvite && inviteLink ? (
        <div className="bg-surface rounded-xl border border-border p-4">
          <p className="text-sm font-medium mb-2">Share this link with your partner</p>
          <div className="bg-muted-light rounded-lg p-3 text-xs text-muted break-all mb-3 font-mono">
            {inviteLink}
          </div>
          <div className="flex gap-2">
            <button
              onClick={copyLink}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium border border-border flex items-center justify-center gap-2 hover:bg-muted-light transition-colors"
            >
              <Copy size={14} />
              {copied ? "Copied!" : "Copy"}
            </button>
            <button
              onClick={shareLink}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-primary text-white flex items-center justify-center gap-2 hover:bg-primary-dark transition-colors"
            >
              <Share2 size={14} />
              Share
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={generateInvite}
          disabled={inviteLoading}
          className="w-full bg-surface rounded-xl border border-dashed border-border p-4 flex items-center gap-3 hover:border-sage transition-colors active:scale-[0.98] disabled:opacity-50"
        >
          {inviteLoading ? (
            <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
              <Loader2 size={18} className="text-sage animate-spin" />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-sage-light flex items-center justify-center">
              <UserPlus size={18} className="text-sage" />
            </div>
          )}
          <div className="text-left">
            <p className="text-sm font-semibold">Invite your partner</p>
            <p className="text-xs text-muted">
              They&apos;ll get a link to join your household
            </p>
          </div>
        </button>
      )}
    </section>
  );
}
