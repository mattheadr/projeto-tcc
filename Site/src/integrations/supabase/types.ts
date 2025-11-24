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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      appointment_history: {
        Row: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          attended: boolean
          booking_lead_time_days: number | null
          created_at: string | null
          doctor_id: string
          id: string
          patient_age_group: string | null
          patient_id: string
          preferred_channel: string | null
          reminder_count: number | null
          reminder_responded: boolean | null
          scheduled_at: string | null
          time_of_day: string | null
        }
        Insert: {
          appointment_date: string
          appointment_time: string
          appointment_type: string
          attended: boolean
          booking_lead_time_days?: number | null
          created_at?: string | null
          doctor_id: string
          id?: string
          patient_age_group?: string | null
          patient_id: string
          preferred_channel?: string | null
          reminder_count?: number | null
          reminder_responded?: boolean | null
          scheduled_at?: string | null
          time_of_day?: string | null
        }
        Update: {
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          attended?: boolean
          booking_lead_time_days?: number | null
          created_at?: string | null
          doctor_id?: string
          id?: string
          patient_age_group?: string | null
          patient_id?: string
          preferred_channel?: string | null
          reminder_count?: number | null
          reminder_responded?: boolean | null
          scheduled_at?: string | null
          time_of_day?: string | null
        }
        Relationships: []
      }
      appointment_reminders: {
        Row: {
          appointment_id: string
          channel: string
          created_at: string | null
          id: string
          responded: boolean | null
          responded_at: string | null
          sent_at: string | null
        }
        Insert: {
          appointment_id: string
          channel: string
          created_at?: string | null
          id?: string
          responded?: boolean | null
          responded_at?: string | null
          sent_at?: string | null
        }
        Update: {
          appointment_id?: string
          channel?: string
          created_at?: string | null
          id?: string
          responded?: boolean | null
          responded_at?: string | null
          sent_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointment_reminders_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
      appointments: {
        Row: {
          actual_status: string | null
          appointment_date: string
          appointment_time: string
          appointment_type: string
          booking_lead_time_days: number | null
          created_at: string | null
          doctor_id: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          patient_id: string
          reminder_count: number | null
          reminder_responded: boolean | null
          status: string | null
          time_of_day: string | null
        }
        Insert: {
          actual_status?: string | null
          appointment_date: string
          appointment_time: string
          appointment_type: string
          booking_lead_time_days?: number | null
          created_at?: string | null
          doctor_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          patient_id: string
          reminder_count?: number | null
          reminder_responded?: boolean | null
          status?: string | null
          time_of_day?: string | null
        }
        Update: {
          actual_status?: string | null
          appointment_date?: string
          appointment_time?: string
          appointment_type?: string
          booking_lead_time_days?: number | null
          created_at?: string | null
          doctor_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          patient_id?: string
          reminder_count?: number | null
          reminder_responded?: boolean | null
          status?: string | null
          time_of_day?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "patient_ml_features"
            referencedColumns: ["patient_id"]
          },
          {
            foreignKeyName: "appointments_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "patient_ml_features"
            referencedColumns: ["patient_id"]
          },
          {
            foreignKeyName: "appointments_patient_id_fkey"
            columns: ["patient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      doctor_availability: {
        Row: {
          created_at: string | null
          day_of_week: number
          doctor_id: string
          end_time: string
          id: string
          start_time: string
        }
        Insert: {
          created_at?: string | null
          day_of_week: number
          doctor_id: string
          end_time: string
          id?: string
          start_time: string
        }
        Update: {
          created_at?: string | null
          day_of_week?: number
          doctor_id?: string
          end_time?: string
          id?: string
          start_time?: string
        }
        Relationships: [
          {
            foreignKeyName: "doctor_availability_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "patient_ml_features"
            referencedColumns: ["patient_id"]
          },
          {
            foreignKeyName: "doctor_availability_doctor_id_fkey"
            columns: ["doctor_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          crm: string | null
          date_of_birth: string | null
          full_name: string
          id: string
          is_frequent_no_show: boolean | null
          latitude: number | null
          longitude: number | null
          no_show_count: number | null
          phone: string | null
          preferred_channel: string | null
          role: string
          specialty: string | null
          total_appointments: number | null
        }
        Insert: {
          created_at?: string | null
          crm?: string | null
          date_of_birth?: string | null
          full_name: string
          id: string
          is_frequent_no_show?: boolean | null
          latitude?: number | null
          longitude?: number | null
          no_show_count?: number | null
          phone?: string | null
          preferred_channel?: string | null
          role: string
          specialty?: string | null
          total_appointments?: number | null
        }
        Update: {
          created_at?: string | null
          crm?: string | null
          date_of_birth?: string | null
          full_name?: string
          id?: string
          is_frequent_no_show?: boolean | null
          latitude?: number | null
          longitude?: number | null
          no_show_count?: number | null
          phone?: string | null
          preferred_channel?: string | null
          role?: string
          specialty?: string | null
          total_appointments?: number | null
        }
        Relationships: []
      }
      ratings: {
        Row: {
          appointment_id: string
          comment: string | null
          created_at: string
          id: string
          rated_id: string
          rater_id: string
          rating: number
        }
        Insert: {
          appointment_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rated_id: string
          rater_id: string
          rating: number
        }
        Update: {
          appointment_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rated_id?: string
          rater_id?: string
          rating?: number
        }
        Relationships: [
          {
            foreignKeyName: "ratings_appointment_id_fkey"
            columns: ["appointment_id"]
            isOneToOne: false
            referencedRelation: "appointments"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      patient_ml_features: {
        Row: {
          age: number | null
          avg_booking_lead_time: number | null
          avg_reminders_sent: number | null
          full_name: string | null
          historical_appointments: number | null
          historical_no_shows: number | null
          is_frequent_no_show: boolean | null
          no_show_count: number | null
          patient_id: string | null
          preferred_channel: string | null
          reminder_response_rate: number | null
          total_appointments: number | null
        }
        Relationships: []
      }
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
