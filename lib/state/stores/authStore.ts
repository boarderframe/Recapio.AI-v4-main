import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { AuthChangeEvent, Session, User } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import { log } from '@/lib/utils/logger';

interface AuthState {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  error: string | null;
  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      isLoading: true,
      isAdmin: false,
      error: null,

      initialize: async () => {
        try {
          // Get initial session
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (session?.user) {
            const isAdmin = session.user.app_metadata?.role === 'admin' || 
                          session.user.user_metadata?.role === 'admin';
            
            set({ 
              user: session.user,
              session,
              isAdmin,
              isLoading: false 
            });

            log.auth.info('Session initialized', { 
              userId: session.user.id,
              isAdmin
            });
          } else {
            set({ 
              user: null,
              session: null,
              isAdmin: false,
              isLoading: false 
            });
            log.auth.info('No session found during initialization');
          }

          // Set up auth state change listener
          supabase.auth.onAuthStateChange(
            async (event, session) => {
              log.auth.info('Auth state changed', { event, userId: session?.user?.id });

              if (session?.user) {
                const isAdmin = session.user.app_metadata?.role === 'admin' || 
                              session.user.user_metadata?.role === 'admin';
                
                set({ 
                  user: session.user,
                  session,
                  isAdmin,
                  error: null 
                });
              } else {
                set({ 
                  user: null,
                  session: null,
                  isAdmin: false,
                  error: null 
                });
              }
            }
          );
        } catch (error) {
          log.auth.error('Failed to initialize auth:', error);
          set({ 
            user: null,
            session: null,
            isAdmin: false,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to initialize auth'
          });
        }
      },

      signIn: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          });

          if (error) throw error;

          if (!data.session) {
            throw new Error('No session returned from sign in');
          }

          const isAdmin = data.user?.app_metadata?.role === 'admin' || 
                         data.user?.user_metadata?.role === 'admin';

          // Set auth state immediately
          set({ 
            user: data.user,
            session: data.session,
            isAdmin,
            isLoading: false,
            error: null
          });

          log.auth.info('Sign in successful', { 
            userId: data.user?.id,
            email: data.user?.email,
            isAdmin
          });

        } catch (error) {
          log.auth.error('Sign in failed:', error);
          set({ 
            user: null,
            session: null,
            isAdmin: false,
            error: error instanceof Error ? error.message : 'Failed to sign in',
            isLoading: false 
          });
          throw error;
        }
      },

      signOut: async () => {
        set({ isLoading: true, error: null });
        
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;
          
          // Clear auth state immediately
          set({ 
            user: null,
            session: null,
            isAdmin: false,
            isLoading: false,
            error: null
          });
          
          log.auth.info('Sign out successful');

        } catch (error) {
          log.auth.error('Sign out failed:', error);
          set({ 
            error: error instanceof Error ? error.message : 'Failed to sign out',
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null })
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ 
        user: state.user,
        session: state.session,
        isAdmin: state.isAdmin
      })
    }
  )
); 