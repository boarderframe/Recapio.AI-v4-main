import type { User } from '@supabase/supabase-js';

export type AuthProvider = 'google' | 'github' | 'email';

export interface AuthUser extends User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'tester';
  tenantId: string;
}

export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  preferences?: {
    notifications?: {
      email: boolean;
      push: boolean;
    };
    theme?: 'light' | 'dark';
    language?: string;
  };
}

export interface SignUpData {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  tenant_id?: string;
}

export interface UpdateProfileData {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  metadata?: UserMetadata;
}

export interface AuthResponse {
  user: AuthUser | null;
  error: Error | null;
}

export interface AuthState {
  user: AuthUser | null;
  tenantId: string | null;
  error: Error | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type RouteGroup = 'marketing' | 'auth' | 'app' | 'user' | 'admin' | 'dashboard'; 