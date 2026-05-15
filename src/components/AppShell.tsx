"use client";

import { useState } from "react";
import { Home, ClipboardList, CheckSquare, Settings } from "lucide-react";
import { useStore } from "@/lib/store";
import HomeTab from "./HomeTab";
import AgendaTab from "./AgendaTab";
import ActionItemsTab from "./ActionItemsTab";
import SettingsTab from "./SettingsTab";
import MeetingFlow from "./MeetingFlow";

const TABS = [
  { id: "home", label: "Home", icon: Home },
  { id: "agenda", label: "Agenda", icon: ClipboardList },
  { id: "actions", label: "To-dos", icon: CheckSquare },
  { id: "settings", label: "Settings", icon: Settings },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function AppShell() {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const meeting = useStore((s) => s.meeting);

  if (meeting) {
    return <MeetingFlow />;
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        {activeTab === "home" && <HomeTab />}
        {activeTab === "agenda" && <AgendaTab />}
        {activeTab === "actions" && <ActionItemsTab />}
        {activeTab === "settings" && <SettingsTab />}
      </div>

      <nav className="bg-surface border-t border-border flex items-center justify-around py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1 rounded-lg transition-colors ${
                isActive
                  ? "text-primary"
                  : "text-muted hover:text-foreground"
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.2 : 1.8} />
              <span className="text-[11px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}
