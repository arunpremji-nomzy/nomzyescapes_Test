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
      inquiries: {
        Row: {
          created_at: string
          destination: string | null
          email: string
          end_date: string | null
          id: string
          message: string | null
          name: string
          party_size: string | null
          phone: string | null
          source: string
          start_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          destination?: string | null
          email: string
          end_date?: string | null
          id?: string
          message?: string | null
          name: string
          party_size?: string | null
          phone?: string | null
          source?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          destination?: string | null
          email?: string
          end_date?: string | null
          id?: string
          message?: string | null
          name?: string
          party_size?: string | null
          phone?: string | null
          source?: string
          start_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      properties: {
        Row: {
          amenities: string[] | null
          bedrooms: number | null
          created_at: string
          description: string | null
          destination: string | null
          gallery: Json
          guests: number | null
          id: string
          image_url: string | null
          images: string[]
          name: string
          price_per_night: number | null
          status: string
          updated_at: string
        }
        Insert: {
          amenities?: string[] | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          destination?: string | null
          gallery?: Json
          guests?: number | null
          id?: string
          image_url?: string | null
          images?: string[]
          name: string
          price_per_night?: number | null
          status?: string
          updated_at?: string
        }
        Update: {
          amenities?: string[] | null
          bedrooms?: number | null
          created_at?: string
          description?: string | null
          destination?: string | null
          gallery?: Json
          guests?: number | null
          id?: string
          image_url?: string | null
          images?: string[]
          name?: string
          price_per_night?: number | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      site_content: {
        Row: {
          created_at: string
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          created_at?: string
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          created_at?: string
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      site_destinations: {
        Row: {
          created_at: string
          cta_label: string | null
          cta_link: string | null
          id: string
          image_url: string | null
          name: string
          published: boolean
          region: string | null
          slug: string
          sort_order: number
          starting_price: number | null
          stays: number | null
          tagline: string | null
          updated_at: string
          wifi: string | null
        }
        Insert: {
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          id?: string
          image_url?: string | null
          name: string
          published?: boolean
          region?: string | null
          slug: string
          sort_order?: number
          starting_price?: number | null
          stays?: number | null
          tagline?: string | null
          updated_at?: string
          wifi?: string | null
        }
        Update: {
          created_at?: string
          cta_label?: string | null
          cta_link?: string | null
          id?: string
          image_url?: string | null
          name?: string
          published?: boolean
          region?: string | null
          slug?: string
          sort_order?: number
          starting_price?: number | null
          stays?: number | null
          tagline?: string | null
          updated_at?: string
          wifi?: string | null
        }
        Relationships: []
      }
      site_testimonials: {
        Row: {
          author: string
          country: string | null
          created_at: string
          destination_slug: string | null
          flag: string | null
          id: string
          image_url: string | null
          published: boolean
          quote: string
          role: string | null
          sort_order: number
          stay_length: string | null
          updated_at: string
        }
        Insert: {
          author: string
          country?: string | null
          created_at?: string
          destination_slug?: string | null
          flag?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          quote: string
          role?: string | null
          sort_order?: number
          stay_length?: string | null
          updated_at?: string
        }
        Update: {
          author?: string
          country?: string | null
          created_at?: string
          destination_slug?: string | null
          flag?: string | null
          id?: string
          image_url?: string | null
          published?: boolean
          quote?: string
          role?: string | null
          sort_order?: number
          stay_length?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_my_sessions: {
        Args: never
        Returns: {
          aal: string
          created_at: string
          id: string
          ip: unknown
          is_current: boolean
          not_after: string
          refreshed_at: string
          updated_at: string
          user_agent: string
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      revoke_my_session: { Args: { _session_id: string }; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "user"
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
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
