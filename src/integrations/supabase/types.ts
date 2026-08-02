export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      gratitude_entries: {
        Row: {
          body: string
          category: string | null
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          category?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          category?: string | null
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      journal_entries: {
        Row: {
          body: string
          created_at: string
          id: string
          scripture: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          scripture?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          scripture?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      memory_suggestion_dismissals: {
        Row: {
          created_at: string
          id: string
          suggestion_key: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          suggestion_key: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          suggestion_key?: string
          user_id?: string
        }
        Relationships: []
      }
      saved_scriptures: {
        Row: {
          created_at: string
          favourite: boolean
          id: string
          journal_entry_id: string | null
          prayer_id: string | null
          reference: string
          reflection: string | null
          theme: string | null
          translation: string
          updated_at: string
          user_id: string
          verse_text: string
        }
        Insert: {
          created_at?: string
          favourite?: boolean
          id?: string
          journal_entry_id?: string | null
          prayer_id?: string | null
          reference: string
          reflection?: string | null
          theme?: string | null
          translation?: string
          updated_at?: string
          user_id: string
          verse_text: string
        }
        Update: {
          created_at?: string
          favourite?: boolean
          id?: string
          journal_entry_id?: string | null
          prayer_id?: string | null
          reference?: string
          reflection?: string | null
          theme?: string | null
          translation?: string
          updated_at?: string
          user_id?: string
          verse_text?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_scriptures_journal_entry_id_fkey"
            columns: ["journal_entry_id"]
            isOneToOne: false
            referencedRelation: "journal_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saved_scriptures_prayer_id_fkey"
            columns: ["prayer_id"]
            isOneToOne: false
            referencedRelation: "user_prayers"
            referencedColumns: ["id"]
          },
        ]
      }
      shamar_messages: {
        Row: {
          created_at: string
          id: string
          parts: Json
          role: string
          thread_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          parts: Json
          role: string
          thread_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          parts?: Json
          role?: string
          thread_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "shamar_messages_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "shamar_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      shamar_threads: {
        Row: {
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_dreams: {
        Row: {
          created_at: string
          id: string
          note: string | null
          promise: string | null
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          note?: string | null
          promise?: string | null
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          note?: string | null
          promise?: string | null
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_letters: {
        Row: {
          body: string
          created_at: string
          id: string
          open_on: string | null
          recipient: string | null
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          open_on?: string | null
          recipient?: string | null
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          open_on?: string | null
          recipient?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      user_memories: {
        Row: {
          category: string | null
          created_at: string
          id: string
          location: string | null
          media_paths: string[]
          memory_date: string | null
          people: string[]
          story: string | null
          tags: string[]
          title: string
          updated_at: string
          user_id: string
          visibility: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          location?: string | null
          media_paths?: string[]
          memory_date?: string | null
          people?: string[]
          story?: string | null
          tags?: string[]
          title: string
          updated_at?: string
          user_id: string
          visibility?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          location?: string | null
          media_paths?: string[]
          memory_date?: string | null
          people?: string[]
          story?: string | null
          tags?: string[]
          title?: string
          updated_at?: string
          user_id?: string
          visibility?: string
        }
        Relationships: []
      }
      user_people: {
        Row: {
          bloom_color: string | null
          created_at: string
          id: string
          name: string
          note: string | null
          relation: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bloom_color?: string | null
          created_at?: string
          id?: string
          name: string
          note?: string | null
          relation?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bloom_color?: string | null
          created_at?: string
          id?: string
          name?: string
          note?: string | null
          relation?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_prayers: {
        Row: {
          answer_note: string | null
          answered: boolean
          answered_at: string | null
          created_at: string
          id: string
          note: string | null
          request: string | null
          title: string
          updated_at: string
          user_id: string
          waiting: boolean
        }
        Insert: {
          answer_note?: string | null
          answered?: boolean
          answered_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          request?: string | null
          title: string
          updated_at?: string
          user_id: string
          waiting?: boolean
        }
        Update: {
          answer_note?: string | null
          answered?: boolean
          answered_at?: string | null
          created_at?: string
          id?: string
          note?: string | null
          request?: string | null
          title?: string
          updated_at?: string
          user_id?: string
          waiting?: boolean
        }
        Relationships: []
      }
      user_preferences: {
        Row: {
          created_at: string
          daily_scripture_dismissed_on: string | null
          translation: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          daily_scripture_dismissed_on?: string | null
          translation?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          daily_scripture_dismissed_on?: string | null
          translation?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
