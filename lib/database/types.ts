import { SupabaseClient } from '@supabase/supabase-js';

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
                Insert: Omit<Database['public']['Tables']['users']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Database['public']['Tables']['users']['Row'], 'id' | 'email' | 'created_at' | 'updated_at'>>;
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
                    type: 'audio' | 'video' | 'text';
                    content: string;
                    language: string;
                    metadata?: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                    deleted_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['transcripts']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Database['public']['Tables']['transcripts']['Row'], 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>;
                Relationships: [
                    {
                        foreignKeyName: "transcripts_tenant_id_fkey";
                        columns: ["tenant_id"];
                        referencedRelation: "tenants";
                        referencedColumns: ["id"];
                    }
                ];
            };
            transcript_types: {
                Row: {
                    id: number;
                    category: string;
                    category_color?: string;
                    category_icon?: string;
                    type: string;
                    sub_type: string;
                    created_at: string;
                    updated_at: string;
                };
                Insert: Omit<Database['public']['Tables']['transcript_types']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Database['public']['Tables']['transcript_types']['Row'], 'id' | 'created_at' | 'updated_at'>>;
                Relationships: [];
            };
            teams: {
                Row: {
                    id: string;
                    tenant_id: string;
                    name: string;
                    description?: string;
                    settings?: Record<string, any>;
                    created_at: string;
                    updated_at: string;
                    deleted_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Database['public']['Tables']['teams']['Row'], 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>;
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
                    tenant_id: string;
                    team_id: string;
                    user_id: string;
                    role: 'owner' | 'admin' | 'member';
                    created_at: string;
                    updated_at: string;
                    deleted_at?: string;
                };
                Insert: Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'created_at' | 'updated_at'>;
                Update: Partial<Omit<Database['public']['Tables']['team_members']['Row'], 'id' | 'tenant_id' | 'created_at' | 'updated_at'>>;
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
    };
}

export type DatabaseClient = SupabaseClient<Database>;
export type TableNames = keyof Database['public']['Tables']; 