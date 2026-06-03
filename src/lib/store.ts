import { create } from "zustand";
import {
  persistNewAgendaItem,
  persistDeleteAgendaItem,
  persistToggleAgendaRepeating,
  persistMarkDiscussed,
  persistNewActionItem,
  persistToggleActionItem,
  persistDeleteActionItem,
  persistLaborOwner,
  persistNewLaborTask,
  persistDeleteLaborTask,
  persistMeetingSettings,
} from "@/lib/data/persist";

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

export type LaborOwner = "you" | "partner" | "shared" | "unassigned";

export type LaborDomain =
  | "meals"
  | "cleaning"
  | "kids-daily"
  | "kids-logistics"
  | "finances"
  | "maintenance"
  | "social-family"
  | "health-medical"
  | "pets"
  | "yard-outdoor"
  | "mental-load";

export interface LaborTask {
  id: string;
  domain: LaborDomain;
  text: string;
  owner: LaborOwner;
  custom: boolean;
}

export const LABOR_DOMAINS: Record<LaborDomain, { label: string; icon: string; color: string }> = {
  meals: { label: "Meals & Groceries", icon: "UtensilsCrossed", color: "#F59E0B" },
  cleaning: { label: "Cleaning & Laundry", icon: "Sparkles", color: "#6366F1" },
  "kids-daily": { label: "Kids — Daily Care", icon: "Baby", color: "#EC4899" },
  "kids-logistics": { label: "Kids — Logistics", icon: "CalendarDays", color: "#E11D48" },
  finances: { label: "Finances & Bills", icon: "Wallet", color: "#EF4444" },
  maintenance: { label: "Home Maintenance", icon: "Wrench", color: "#F97316" },
  "social-family": { label: "Social & Family", icon: "Users", color: "#8B5CF6" },
  "health-medical": { label: "Health & Medical", icon: "Heart", color: "#10B981" },
  pets: { label: "Pets", icon: "PawPrint", color: "#14B8A6" },
  "yard-outdoor": { label: "Yard & Outdoor", icon: "TreePine", color: "#6B8F71" },
  "mental-load": { label: "Mental Load", icon: "Brain", color: "#0EA5E9" },
};

export type NewbornLeaveStatus = "on-leave" | "working" | "both-home";

export interface NewbornSettings {
  enabled: boolean;
  babyName: string;
  yourLeave: "on-leave" | "working";
  partnerLeave: "on-leave" | "working";
  startedAt: string;
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

interface AppState {
  // Internal (not rendered directly)
  _userId: string;
  _partnerId: string | null;
  _householdId: string;

  // Persistent data (from Supabase)
  agendaItems: AgendaItem[];
  actionItems: ActionItem[];
  laborTasks: LaborTask[];
  repeatingCategories: Category[];
  meetingDay: string;
  meetingTime: string;
  timeboxDefault: number;
  notificationEnabled: boolean;
  notificationMinutesBefore: number;
  partnerName: string | null;
  newborn: NewbornSettings | null;

  // Ephemeral meeting session
  meeting: MeetingState | null;

  // Hydration
  _hydrate: (data: {
    agendaItems: AgendaItem[];
    actionItems: ActionItem[];
    laborTasks: LaborTask[];
    repeatingCategories: Category[];
    meetingDay: string;
    meetingTime: string;
    timeboxDefault: number;
    notificationEnabled: boolean;
    notificationMinutesBefore: number;
    partnerName: string | null;
    _userId: string;
    _partnerId: string | null;
    _householdId: string;
  }) => void;

  // Agenda actions
  addAgendaItem: (text: string, category: Category, addedBy: "you" | "partner") => void;
  removeAgendaItem: (id: string) => void;
  toggleAgendaItemRepeating: (id: string) => void;
  markDiscussed: (id: string) => void;

  // Action item actions
  addActionItem: (text: string, assignee: "you" | "partner") => void;
  toggleActionItem: (id: string) => void;
  removeActionItem: (id: string) => void;

  // Labor actions
  setLaborOwner: (taskId: string, owner: LaborOwner) => void;
  addLaborTask: (domain: LaborDomain, text: string) => void;
  removeLaborTask: (taskId: string) => void;

  // Settings actions
  toggleRepeatingCategory: (category: Category) => void;
  setMeetingDay: (day: string) => void;
  setMeetingTime: (time: string) => void;
  setTimebox: (minutes: number) => void;
  setNotificationEnabled: (enabled: boolean) => void;
  setNotificationMinutesBefore: (minutes: number) => void;
  setPartnerName: (name: string | null) => void;
  setNewborn: (settings: NewbornSettings | null) => void;

  // Meeting session actions (ephemeral, not persisted)
  startMeeting: () => void;
  setMeetingStep: (step: MeetingState["step"]) => void;
  nextTopic: () => void;
  prevTopic: () => void;
  setFiveMinMode: (on: boolean) => void;
  incrementReschedule: () => void;
  endMeeting: () => void;
  startTimebox: () => void;
  pauseTimebox: () => void;
  resumeTimebox: () => void;
}

function uid(): string {
  return crypto.randomUUID();
}

export const useStore = create<AppState>()((set, get) => ({
  _userId: "",
  _partnerId: null,
  _householdId: "",

  agendaItems: [],
  actionItems: [],
  laborTasks: [],
  repeatingCategories: [],
  meetingDay: "Sunday",
  meetingTime: "8:00 PM",
  timeboxDefault: 20,
  notificationEnabled: true,
  notificationMinutesBefore: 30,
  partnerName: null,
  newborn: null,
  meeting: null,

  _hydrate: (data) =>
    set({
      agendaItems: data.agendaItems,
      actionItems: data.actionItems,
      laborTasks: data.laborTasks,
      repeatingCategories: data.repeatingCategories,
      meetingDay: data.meetingDay,
      meetingTime: data.meetingTime,
      timeboxDefault: data.timeboxDefault,
      notificationEnabled: data.notificationEnabled,
      notificationMinutesBefore: data.notificationMinutesBefore,
      partnerName: data.partnerName,
      _userId: data._userId,
      _partnerId: data._partnerId,
      _householdId: data._householdId,
    }),

  addAgendaItem: (text, category, addedBy) => {
    const item: AgendaItem = { id: uid(), text, category, addedBy, repeating: false, discussed: false };
    set((s) => ({ agendaItems: [...s.agendaItems, item] }));
    const { _householdId, _userId, _partnerId } = get();
    persistNewAgendaItem(item, _householdId, _userId, _partnerId);
  },

  removeAgendaItem: (itemId) => {
    set((s) => ({ agendaItems: s.agendaItems.filter((i) => i.id !== itemId) }));
    persistDeleteAgendaItem(itemId);
  },

  toggleAgendaItemRepeating: (itemId) => {
    let newVal = false;
    set((s) => ({
      agendaItems: s.agendaItems.map((i) => {
        if (i.id === itemId) {
          newVal = !i.repeating;
          return { ...i, repeating: newVal };
        }
        return i;
      }),
    }));
    persistToggleAgendaRepeating(itemId, newVal);
  },

  markDiscussed: (itemId) => {
    set((s) => ({
      agendaItems: s.agendaItems.map((i) =>
        i.id === itemId ? { ...i, discussed: true } : i
      ),
    }));
    persistMarkDiscussed(itemId);
  },

  addActionItem: (text, assignee) => {
    const item: ActionItem = {
      id: uid(),
      text,
      assignee,
      done: false,
      createdAt: new Date().toISOString().slice(0, 10),
    };
    set((s) => ({ actionItems: [...s.actionItems, item] }));
    const { _householdId, _userId, _partnerId } = get();
    persistNewActionItem(item, _householdId, _userId, _partnerId);
  },

  toggleActionItem: (itemId) => {
    let newDone = false;
    set((s) => ({
      actionItems: s.actionItems.map((i) => {
        if (i.id === itemId) {
          newDone = !i.done;
          return { ...i, done: newDone };
        }
        return i;
      }),
    }));
    persistToggleActionItem(itemId, newDone);
  },

  removeActionItem: (itemId) => {
    set((s) => ({ actionItems: s.actionItems.filter((i) => i.id !== itemId) }));
    persistDeleteActionItem(itemId);
  },

  setLaborOwner: (taskId, owner) => {
    set((s) => ({
      laborTasks: s.laborTasks.map((t) =>
        t.id === taskId ? { ...t, owner } : t
      ),
    }));
    const { _userId, _partnerId } = get();
    persistLaborOwner(taskId, owner, _userId, _partnerId);
  },

  addLaborTask: (domain, text) => {
    const task: LaborTask = { id: uid(), domain, text, owner: "unassigned", custom: true };
    set((s) => ({ laborTasks: [...s.laborTasks, task] }));
    const { _householdId, _userId, _partnerId } = get();
    persistNewLaborTask(task, _householdId, _userId, _partnerId);
  },

  removeLaborTask: (taskId) => {
    set((s) => ({ laborTasks: s.laborTasks.filter((t) => t.id !== taskId) }));
    persistDeleteLaborTask(taskId);
  },

  toggleRepeatingCategory: (category) => {
    let newCategories: Category[] = [];
    set((s) => {
      newCategories = s.repeatingCategories.includes(category)
        ? s.repeatingCategories.filter((c) => c !== category)
        : [...s.repeatingCategories, category];
      return { repeatingCategories: newCategories };
    });
    const { _householdId } = get();
    persistMeetingSettings(_householdId, { repeatingCategories: newCategories });
  },

  setMeetingDay: (day) => {
    set({ meetingDay: day });
    const { _householdId } = get();
    persistMeetingSettings(_householdId, { meetingDay: day });
  },

  setMeetingTime: (time) => {
    set({ meetingTime: time });
    const { _householdId } = get();
    persistMeetingSettings(_householdId, { meetingTime: time });
  },

  setTimebox: (minutes) => {
    set((s) => ({
      meeting: s.meeting ? { ...s.meeting, timeboxMinutes: minutes } : null,
      timeboxDefault: minutes,
    }));
    const { _householdId } = get();
    persistMeetingSettings(_householdId, { timeboxDefault: minutes });
  },

  setNotificationEnabled: (enabled) => {
    set({ notificationEnabled: enabled });
    const { _householdId } = get();
    persistMeetingSettings(_householdId, { notificationEnabled: enabled });
  },

  setNotificationMinutesBefore: (minutes) => {
    set({ notificationMinutesBefore: minutes });
    const { _householdId } = get();
    persistMeetingSettings(_householdId, { notificationMinutesBefore: minutes });
  },

  setPartnerName: (name) => set({ partnerName: name }),

  setNewborn: (settings) => set({ newborn: settings }),

  // --- Meeting session (ephemeral, not persisted to Supabase) ---

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
        ? { ...s.meeting, currentTopicIndex: Math.max(0, s.meeting.currentTopicIndex - 1) }
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
}));
