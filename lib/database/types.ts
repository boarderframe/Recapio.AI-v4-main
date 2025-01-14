import { SupabaseClient } from '@supabase/supabase-js';

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
            users: {
                Row: {
                    id: string;
                    tenant_id: string;
                    email: string;
                    password_hash: string;
                    name?: string;
                    roles: string[];
                    created_at: string;
                    updated_at: string;
                    deleted_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
                Update: Partial<Database['public']['Tables']['users']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "users_tenant_id_fkey";
                        columns: ["tenant_id"];
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            transcripts: {
                Row: {
                    id: string;
                    tenant_id: string;
                    user_id: string;
                    type_id: string;
                    content: string;
                    status: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['transcripts']['Row'], 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
                Update: Partial<Database['public']['Tables']['transcripts']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "transcripts_tenant_id_fkey";
                        columns: ["tenant_id"];
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "transcripts_type_id_fkey";
                        columns: ["type_id"];
                        referencedRelation: "transcript_types";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "transcripts_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            transcript_types: {
                Row: {
                    id: string;
                    tenant_id: string;
                    created_at: string;
                    updated_at: string;
                    category: string;
                    subcategory: string | null;
                    analysis_instructions: string | null;
                    is_global: boolean;
                    created_by: string;
                };
                Insert: Omit<Database['public']['Tables']['transcript_types']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['transcript_types']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "transcript_types_tenant_id_fkey";
                        columns: ["tenant_id"];
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "transcript_types_created_by_fkey";
                        columns: ["created_by"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            summaries: {
                Row: {
                    id: string;
                    transcript_id: string;
                    content: Json;
                    format: 'stream' | 'cards' | 'summary';
                    tenant_id: string;
                    user_id: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['summaries']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Database['public']['Tables']['summaries']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "summaries_tenant_id_fkey";
                        columns: ["tenant_id"];
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "summaries_transcript_id_fkey";
                        columns: ["transcript_id"];
                        referencedRelation: "transcripts";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "summaries_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
            teams: {
                Row: {
                    id: string;
                    tenant_id: string;
                    name: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
                Update: Partial<Database['public']['Tables']['teams']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "teams_tenant_id_fkey";
                        columns: ["tenant_id"];
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            team_members: {
                Row: {
                    id: string;
                    team_id: string;
                    user_id: string;
                    role: string;
                    created_at: string;
                    updated_at: string;
                    deleted_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at' | 'updated_at' | 'deleted_at'>;
                Update: Partial<Database['public']['Tables']['team_members']['Insert']>;
                Relationships: [
                    {
                        foreignKeyName: "team_members_team_id_fkey";
                        columns: ["team_id"];
                        referencedRelation: "teams";
                        referencedColumns: ["id"];
                    },
                    {
                        foreignKeyName: "team_members_user_id_fkey";
                        columns: ["user_id"];
                        referencedRelation: "users";
                        referencedColumns: ["id"];
                    }
                ];
            };
        };
        Views: Record<string, never>;
        Functions: Record<string, never>;
        Enums: {
            user_role: 'admin' | 'user' | 'tester';
        };
    };
}

export type DatabaseClient = SupabaseClient<Database>;
export type TableNames = keyof Database['public']['Tables']; 