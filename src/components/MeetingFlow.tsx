"use client";

import { useStore } from "@/lib/store";
import HeadspaceCheck from "./meeting/HeadspaceCheck";
import NotReadyOptions from "./meeting/NotReadyOptions";
import BuildAgenda from "./meeting/BuildAgenda";
import AppreciationStep from "./meeting/AppreciationStep";
import TopicWalkthrough from "./meeting/TopicWalkthrough";
import ActionItemsStep from "./meeting/ActionItemsStep";
import CloseStep from "./meeting/CloseStep";
import MeetingTimer from "./meeting/MeetingTimer";

export default function MeetingFlow() {
  const meeting = useStore((s) => s.meeting);
  if (!meeting) return null;

  const showTimer =
    meeting.timeboxActive &&
    !["headspace-you", "headspace-partner", "not-ready-options", "close"].includes(
      meeting.step
    );

  return (
    <div className="h-full flex flex-col bg-background">
      {showTimer && <MeetingTimer />}
      <div className="flex-1 overflow-y-auto">
        {meeting.step === "headspace-you" && <HeadspaceCheck who="you" />}
        {meeting.step === "headspace-partner" && (
          <HeadspaceCheck who="partner" />
        )}
        {meeting.step === "not-ready-options" && <NotReadyOptions />}
        {meeting.step === "build-agenda" && <BuildAgenda />}
        {meeting.step === "appreciation" && <AppreciationStep />}
        {meeting.step === "topics" && <TopicWalkthrough />}
        {meeting.step === "action-items" && <ActionItemsStep />}
        {meeting.step === "close" && <CloseStep />}
      </div>
    </div>
  );
}
