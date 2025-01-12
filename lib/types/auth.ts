export interface User {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
}

export interface AuthState {
    user: User | null;
    isLoading: boolean;
    error: Error | null;
}

export interface AuthContextType extends AuthState {
    signIn: (email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
    signUp: (email: string, password: string, name?: string) => Promise<void>;
    resetPassword: (email: string) => Promise<void>;
    updateProfile: (data: Partial<User>) => Promise<void>;
} 