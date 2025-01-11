import { User } from '@supabase/supabase-js';

export interface UserMetadata {
    first_name?: string;
    last_name?: string;
    tenant_id: string;
    avatar_url?: string;
    roles: string[];
    preferences?: {
        theme?: 'light' | 'dark';
        notifications?: boolean;
        language?: string;
    };
}

export interface AuthUser extends User {
    user_metadata: UserMetadata;
}

export interface AuthResponse {
    user: AuthUser | null;
    session: any | null;
    error?: string;
}

export type AuthProvider = 'google' | 'github' | 'azure';

export interface SignUpData {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    tenant_id: string;
}

export interface UpdateProfileData {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    preferences?: UserMetadata['preferences'];
} 