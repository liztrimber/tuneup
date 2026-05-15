"use client";

import { useState, useEffect } from "react";
import { Home, ClipboardList, CheckSquare, Settings, Play } from "lucide-react";
import { useStore } from "@/lib/store";
import HomeTab from "./HomeTab";
import AgendaTab from "./AgendaTab";
import ActionItemsTab from "./ActionItemsTab";
import SettingsTab from "./SettingsTab";
import MeetingFlow from "./MeetingFlow";
import OnboardingScreen from "./OnboardingScreen";

const LEFT_TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "agenda", label: "Agenda", icon: ClipboardList },
] as const;

const RIGHT_TABS = [
  { id: "actions", label: "To-dos", icon: CheckSquare },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = "home" | "agenda" | "actions" | "settings";

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mounted, setMounted] = useState(false);
  const meeting = useStore((s) => s.meeting);
  const startMeeting = useStore((s) => s.startMeeting);

  useEffect(() => {
    const seen = localStorage.getItem("tuneup-onboarding-seen");
    if (!seen) {
      setShowOnboarding(true);
    }
    setMounted(true);
  }, []);

  function completeOnboarding() {
    localStorage.setItem("tuneup-onboarding-seen", "true");
    setShowOnboarding(false);
  }

  if (!mounted) return null;

  if (showOnboarding) {
    return <OnboardingScreen onComplete={completeOnboarding} />;
  }

  if (meeting) {
    return <MeetingFlow />;
  }

  function renderTab(tab: { id: TabId; label: string; icon: typeof Home }) {
    const Icon = tab.icon;
    const isActive = activeTab === tab.id;
    return (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex flex-col items-center gap-0.5 px-4 py-2 min-h-[44px] min-w-[44px] rounded-lg transition-colors ${
          isActive
            ? "text-primary"
            : "text-muted hover:text-foreground"
        }`}
      >
        <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
        <span className="text-[11px] font-medium">{tab.label}</span>
      </button>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "agenda" && <AgendaTab />}
        {activeTab === "actions" && <ActionItemsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      <nav className="bg-surface border-t border-border flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] relative">
        {LEFT_TABS.map(renderTab)}

        <button
          onClick={startMeeting}
          className="w-14 h-14 rounded-full bg-sage flex items-center justify-center -mt-8 shadow-lg hover:bg-sage-dark transition-colors active:scale-95"
        >
          <Play size={22} fill="white" className="text-white ml-0.5" />
        </button>

        {RIGHT_TABS.map(renderTab)}
      </nav>
    </div>
  );
}
