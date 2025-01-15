import type { User, Session } from '@supabase/supabase-js';

export type AuthProvider = 'google' | 'github' | 'azure';

export interface AuthUser extends User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'tester';
  tenantId: string;
  user_metadata: UserMetadata;
}

export interface UserMetadata {
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  tenant_id: string;
  roles: string[];
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
  email?: string;
  password?: string;
  data?: {
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    tenant_id?: string;
    roles?: string[];
    preferences?: UserMetadata['preferences'];
  };
}

export interface AuthResponse {
  user: AuthUser | null;
  session: Session | null;
  error?: Error | null;
}

export interface AuthState {
  user: AuthUser | null;
  tenantId: string | null;
  error: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export type RouteGroup = 'marketing' | 'auth' | 'app' | 'user' | 'admin' | 'dashboard'; 