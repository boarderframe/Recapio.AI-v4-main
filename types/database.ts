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
          tenant_id: string
          category: string
          subcategory?: string | null
          analysis_instructions?: string | null
          is_global: boolean
          created_by: string
        }
        Update: Partial<{
          tenant_id: string
          category: string
          subcategory?: string | null
          analysis_instructions?: string | null
          is_global: boolean
          created_by: string
        }>
      }
      summaries: {
        Row: {
          id: string
          transcript_id: string
          content: Json
          format: 'stream' | 'cards' | 'summary'
          tenant_id: string
          user_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          transcript_id: string
          content: Json
          format: 'stream' | 'cards' | 'summary'
          tenant_id: string
          user_id: string
        }
        Update: Partial<{
          transcript_id: string
          content: Json
          format: 'stream' | 'cards' | 'summary'
          tenant_id: string
          user_id: string
        }>
      }
      users: {
        Row: {
          id: string
          tenant_id: string
          email: string
          password_hash: string
          name?: string
          roles: string[]
          created_at: string
          updated_at: string
          deleted_at?: string
        }
        Insert: {
          tenant_id: string
          email: string
          password_hash: string
          name?: string
          roles: string[]
        }
        Update: Partial<{
          tenant_id: string
          email: string
          password_hash: string
          name?: string
          roles: string[]
        }>
      }
      transcripts: {
        Row: {
          id: string
          tenant_id: string
          user_id: string
          type_id: string
          content: string
          status: string
          created_at: string
          updated_at: string
          deleted_at?: string
        }
        Insert: {
          tenant_id: string
          user_id: string
          type_id: string
          content: string
          status: string
        }
        Update: Partial<{
          tenant_id: string
          user_id: string
          type_id: string
          content: string
          status: string
        }>
      }
      teams: {
        Row: {
          id: string
          tenant_id: string
          name: string
          created_at: string
          updated_at: string
          deleted_at?: string
        }
        Insert: {
          tenant_id: string
          name: string
        }
        Update: Partial<{
          tenant_id: string
          name: string
        }>
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: string
          created_at: string
          updated_at: string
          deleted_at?: string
        }
        Insert: {
          team_id: string
          user_id: string
          role: string
        }
        Update: Partial<{
          team_id: string
          user_id: string
          role: string
        }>
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      user_role: 'admin' | 'user' | 'tester'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T] 