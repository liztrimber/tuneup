import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Category =
  | "appreciation"
  | "logistics"
  | "division-of-labor"
  | "money"
  | "kids"
  | "something-on-my-mind"
  | "personal-needs"
  | "household"
  | "us"
  | "coming-up";

export interface AgendaItem {
  id: string;
  text: string;
  category: Category;
  addedBy: "you" | "partner";
  repeating: boolean;
  discussed: boolean;
}

export interface ActionItem {
  id: string;
  text: string;
  assignee: "you" | "partner";
  done: boolean;
  createdAt: string;
}

export interface MeetingState {
  step:
    | "headspace-you"
    | "headspace-partner"
    | "not-ready-options"
    | "build-agenda"
    | "appreciation"
    | "topics"
    | "action-items"
    | "close";
  currentTopicIndex: number;
  timeboxMinutes: number;
  timeboxActive: boolean;
  timeboxStartedAt: number | null;
  timeboxPaused: boolean;
  timeboxPausedElapsed: number;
  rescheduleCount: number;
  fiveMinMode: boolean;
}

export const CATEGORY_META: Record<
  Category,
  { label: string; icon: string; color: string }
> = {
  appreciation: { label: "Appreciation", icon: "Heart", color: "#10B981" },
  logistics: { label: "Logistics", icon: "CalendarDays", color: "#6366F1" },
  "division-of-labor": {
    label: "Division of Labor",
    icon: "Scale",
    color: "#F59E0B",
  },
  money: { label: "Money", icon: "Wallet", color: "#EF4444" },
  kids: { label: "Kids", icon: "Baby", color: "#EC4899" },
  "something-on-my-mind": {
    label: "Something on My Mind",
    icon: "MessageCircle",
    color: "#8B5CF6",
  },
  "personal-needs": {
    label: "Personal Needs",
    icon: "User",
    color: "#14B8A6",
  },
  household: { label: "Household", icon: "Home", color: "#F97316" },
  us: { label: "Us", icon: "HeartHandshake", color: "#E11D48" },
  "coming-up": { label: "Coming Up", icon: "ArrowRight", color: "#0EA5E9" },
};

const DEFAULT_REPEATING: Category[] = [
  "appreciation",
  "logistics",
  "division-of-labor",
  "kids",
];

interface AppState {
  agendaItems: AgendaItem[];
  actionItems: ActionItem[];
  repeatingCategories: Category[];
  meeting: MeetingState | null;
  meetingDay: string;
  meetingTime: string;
  timeboxDefault: number;
  partnerName: string | null;

  addAgendaItem: (
    text: string,
    category: Category,
    addedBy: "you" | "partner"
  ) => void;
  removeAgendaItem: (id: string) => void;
  toggleAgendaItemRepeating: (id: string) => void;
  markDiscussed: (id: string) => void;
  addActionItem: (text: string, assignee: "you" | "partner") => void;
  toggleActionItem: (id: string) => void;
  removeActionItem: (id: string) => void;
  toggleRepeatingCategory: (category: Category) => void;
  startMeeting: () => void;
  setMeetingStep: (step: MeetingState["step"]) => void;
  nextTopic: () => void;
  prevTopic: () => void;
  setFiveMinMode: (on: boolean) => void;
  incrementReschedule: () => void;
  endMeeting: () => void;
  setTimebox: (minutes: number) => void;
  startTimebox: () => void;
  pauseTimebox: () => void;
  resumeTimebox: () => void;
  setMeetingDay: (day: string) => void;
  setMeetingTime: (time: string) => void;
  setPartnerName: (name: string | null) => void;
}

function id(): string {
  return Math.random().toString(36).slice(2, 10);
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      agendaItems: [
        {
          id: id(),
          text: "Soccer practice moved to Thursday",
          category: "logistics",
          addedBy: "partner",
          repeating: false,
          discussed: false,
        },
        {
          id: id(),
          text: "Can we revisit who handles morning routine?",
          category: "division-of-labor",
          addedBy: "you",
          repeating: false,
          discussed: false,
        },
        {
          id: id(),
          text: "Need to talk about holiday budget",
          category: "money",
          addedBy: "partner",
          repeating: false,
          discussed: false,
        },
      ],
      actionItems: [
        {
          id: id(),
          text: "Schedule pediatrician appointment",
          assignee: "you",
          done: false,
          createdAt: "2025-05-10",
        },
        {
          id: id(),
          text: "Fix leaky faucet in bathroom",
          assignee: "partner",
          done: false,
          createdAt: "2025-05-08",
        },
        {
          id: id(),
          text: "Research summer camps",
          assignee: "you",
          done: true,
          createdAt: "2025-05-03",
        },
      ],
      repeatingCategories: DEFAULT_REPEATING,
      meeting: null,
      meetingDay: "Sunday",
      meetingTime: "8:00 PM",
      timeboxDefault: 20,
      partnerName: null,

      addAgendaItem: (text, category, addedBy) =>
        set((s) => ({
          agendaItems: [
            ...s.agendaItems,
            { id: id(), text, category, addedBy, repeating: false, discussed: false },
          ],
        })),

      removeAgendaItem: (itemId) =>
        set((s) => ({
          agendaItems: s.agendaItems.filter((i) => i.id !== itemId),
        })),

      toggleAgendaItemRepeating: (itemId) =>
        set((s) => ({
          agendaItems: s.agendaItems.map((i) =>
            i.id === itemId ? { ...i, repeating: !i.repeating } : i
          ),
        })),

      markDiscussed: (itemId) =>
        set((s) => ({
          agendaItems: s.agendaItems.map((i) =>
            i.id === itemId ? { ...i, discussed: true } : i
          ),
        })),

      addActionItem: (text, assignee) =>
        set((s) => ({
          actionItems: [
            ...s.actionItems,
            {
              id: id(),
              text,
              assignee,
              done: false,
              createdAt: new Date().toISOString().slice(0, 10),
            },
          ],
        })),

      toggleActionItem: (itemId) =>
        set((s) => ({
          actionItems: s.actionItems.map((i) =>
            i.id === itemId ? { ...i, done: !i.done } : i
          ),
        })),

      removeActionItem: (itemId) =>
        set((s) => ({
          actionItems: s.actionItems.filter((i) => i.id !== itemId),
        })),

      toggleRepeatingCategory: (category) =>
        set((s) => ({
          repeatingCategories: s.repeatingCategories.includes(category)
            ? s.repeatingCategories.filter((c) => c !== category)
            : [...s.repeatingCategories, category],
        })),

      startMeeting: () =>
        set({
          meeting: {
            step: "headspace-you",
            currentTopicIndex: 0,
            timeboxMinutes: get().timeboxDefault,
            timeboxActive: false,
            timeboxStartedAt: null,
            timeboxPaused: false,
            timeboxPausedElapsed: 0,
            rescheduleCount: 0,
            fiveMinMode: false,
          },
        }),

      setMeetingStep: (step) =>
        set((s) => ({
          meeting: s.meeting ? { ...s.meeting, step } : null,
        })),

      nextTopic: () =>
        set((s) => ({
          meeting: s.meeting
            ? { ...s.meeting, currentTopicIndex: s.meeting.currentTopicIndex + 1 }
            : null,
        })),

      prevTopic: () =>
        set((s) => ({
          meeting: s.meeting
            ? {
                ...s.meeting,
                currentTopicIndex: Math.max(0, s.meeting.currentTopicIndex - 1),
              }
            : null,
        })),

      setFiveMinMode: (on) =>
        set((s) => ({
          meeting: s.meeting ? { ...s.meeting, fiveMinMode: on } : null,
        })),

      incrementReschedule: () =>
        set((s) => ({
          meeting: s.meeting
            ? { ...s.meeting, rescheduleCount: s.meeting.rescheduleCount + 1 }
            : null,
        })),

      endMeeting: () =>
        set((s) => ({
          meeting: null,
          agendaItems: s.agendaItems
            .filter((i) => !i.discussed || i.repeating)
            .map((i) => (i.discussed && i.repeating ? { ...i, discussed: false } : i)),
        })),

      setTimebox: (minutes) =>
        set((s) => ({
          meeting: s.meeting ? { ...s.meeting, timeboxMinutes: minutes } : null,
          timeboxDefault: minutes,
        })),

      startTimebox: () =>
        set((s) => ({
          meeting: s.meeting
            ? { ...s.meeting, timeboxActive: true, timeboxStartedAt: Date.now(), timeboxPaused: false, timeboxPausedElapsed: 0 }
            : null,
        })),

      pauseTimebox: () =>
        set((s) => {
          if (!s.meeting || !s.meeting.timeboxStartedAt) return {};
          const elapsed = Date.now() - s.meeting.timeboxStartedAt + s.meeting.timeboxPausedElapsed;
          return {
            meeting: { ...s.meeting, timeboxPaused: true, timeboxPausedElapsed: elapsed, timeboxStartedAt: null },
          };
        }),

      resumeTimebox: () =>
        set((s) => {
          if (!s.meeting) return {};
          return {
            meeting: { ...s.meeting, timeboxPaused: false, timeboxStartedAt: Date.now() },
          };
        }),

      setMeetingDay: (day) => set({ meetingDay: day }),
      setMeetingTime: (time) => set({ meetingTime: time }),
      setPartnerName: (name) => set({ partnerName: name }),
    }),
    { name: "tuneup-store" }
  )
);
