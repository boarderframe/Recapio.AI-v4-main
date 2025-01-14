export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      transcript_types: {
        Row: {
          id: string
          tenant_id: string
          created_at: string
          updated_at: string
          category: string
          subcategory: string | null
          analysis_instructions: string | null
          is_global: boolean
          created_by: string
        }
        Insert: {
          id?: string
          tenant_id: string
          created_at?: string
          updated_at?: string
          category: string
          subcategory?: string | null
          analysis_instructions?: string | null
          is_global?: boolean
          created_by: string
        }
        Update: {
          id?: string
          tenant_id?: string
          created_at?: string
          updated_at?: string
          category?: string
          subcategory?: string | null
          analysis_instructions?: string | null
          is_global?: boolean
          created_by?: string
        }
      }
      users: {
        Row: {
          id: string
          email: string
          role: string
          tenant_id: string
          created_at: string
          updated_at: string
          metadata: Json | null
        }
        Insert: {
          id: string
          email: string
          role?: string
          tenant_id: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
        Update: {
          id?: string
          email?: string
          role?: string
          tenant_id?: string
          created_at?: string
          updated_at?: string
          metadata?: Json | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'admin' | 'user' | 'tester'
    }
  }
} 