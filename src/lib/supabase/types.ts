export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      households: {
        Row: {
          id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          display_name: string;
          household_id: string | null;
          role: "owner" | "member";
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string;
          household_id?: string | null;
          role?: "owner" | "member";
          created_at?: string;
        };
        Update: {
          id?: string;
          display_name?: string;
          household_id?: string | null;
          role?: "owner" | "member";
          created_at?: string;
        };
        Relationships: [];
      };
      invites: {
        Row: {
          id: string;
          household_id: string;
          invited_by: string;
          code: string;
          accepted_by: string | null;
          accepted_at: string | null;
          expires_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          invited_by: string;
          code?: string;
          accepted_by?: string | null;
          accepted_at?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          invited_by?: string;
          code?: string;
          accepted_by?: string | null;
          accepted_at?: string | null;
          expires_at?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      meeting_settings: {
        Row: {
          household_id: string;
          meeting_day: string;
          meeting_time: string;
          timebox_default: number;
          repeating_categories: string[];
          notification_enabled: boolean;
          notification_minutes_before: number;
        };
        Insert: {
          household_id: string;
          meeting_day?: string;
          meeting_time?: string;
          timebox_default?: number;
          repeating_categories?: string[];
          notification_enabled?: boolean;
          notification_minutes_before?: number;
        };
        Update: {
          household_id?: string;
          meeting_day?: string;
          meeting_time?: string;
          timebox_default?: number;
          repeating_categories?: string[];
          notification_enabled?: boolean;
          notification_minutes_before?: number;
        };
        Relationships: [];
      };
      agenda_items: {
        Row: {
          id: string;
          household_id: string;
          text: string;
          category: string;
          added_by: string;
          repeating: boolean;
          discussed: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          text: string;
          category: string;
          added_by: string;
          repeating?: boolean;
          discussed?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          text?: string;
          category?: string;
          added_by?: string;
          repeating?: boolean;
          discussed?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      meetings: {
        Row: {
          id: string;
          household_id: string;
          started_at: string;
          ended_at: string | null;
          mode: "standard" | "five-min";
          current_step: string;
          current_topic_index: number;
          completed: boolean;
        };
        Insert: {
          id?: string;
          household_id: string;
          started_at?: string;
          ended_at?: string | null;
          mode?: "standard" | "five-min";
          current_step?: string;
          current_topic_index?: number;
          completed?: boolean;
        };
        Update: {
          id?: string;
          household_id?: string;
          started_at?: string;
          ended_at?: string | null;
          mode?: "standard" | "five-min";
          current_step?: string;
          current_topic_index?: number;
          completed?: boolean;
        };
        Relationships: [];
      };
      meeting_agenda_snapshots: {
        Row: {
          id: string;
          meeting_id: string;
          agenda_item_id: string;
          discussed: boolean;
        };
        Insert: {
          id?: string;
          meeting_id: string;
          agenda_item_id: string;
          discussed?: boolean;
        };
        Update: {
          id?: string;
          meeting_id?: string;
          agenda_item_id?: string;
          discussed?: boolean;
        };
        Relationships: [];
      };
      action_items: {
        Row: {
          id: string;
          household_id: string;
          meeting_id: string | null;
          text: string;
          assignee: string;
          done: boolean;
          created_at: string;
          completed_at: string | null;
        };
        Insert: {
          id?: string;
          household_id: string;
          meeting_id?: string | null;
          text: string;
          assignee: string;
          done?: boolean;
          created_at?: string;
          completed_at?: string | null;
        };
        Update: {
          id?: string;
          household_id?: string;
          meeting_id?: string | null;
          text?: string;
          assignee?: string;
          done?: boolean;
          created_at?: string;
          completed_at?: string | null;
        };
        Relationships: [];
      };
      labor_tasks: {
        Row: {
          id: string;
          household_id: string;
          domain: string;
          text: string;
          owner: string;
          custom: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          household_id: string;
          domain: string;
          text: string;
          owner?: string;
          custom?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          household_id?: string;
          domain?: string;
          text?: string;
          owner?: string;
          custom?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
      push_subscriptions: {
        Row: {
          id: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          endpoint: string;
          p256dh: string;
          auth: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          endpoint?: string;
          p256dh?: string;
          auth?: string;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      accept_invite: {
        Args: { invite_code: string };
        Returns: string;
      };
    };
  };
};
