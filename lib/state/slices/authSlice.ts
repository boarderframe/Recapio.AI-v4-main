import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabase';
import type { AuthProvider, AuthResponse, AuthState, AuthUser, SignUpData, UpdateProfileData } from '@/types/auth';
import { Provider } from '@supabase/supabase-js';

const initialState: AuthState = {
  user: null,
  tenantId: null,
  error: null,
  isLoading: false,
  isAuthenticated: false,
};

export const signIn = createAsyncThunk<AuthResponse, { email: string; password: string }>(
  'auth/signIn',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      return { user: data.user as AuthUser, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
);

export const signUp = createAsyncThunk<AuthResponse, SignUpData>(
  'auth/signUp',
  async (userData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            first_name: userData.first_name,
            last_name: userData.last_name,
            tenant_id: userData.tenant_id,
          },
        },
      });

      if (error) {
        return { user: null, error };
      }

      return { user: data.user as AuthUser, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
);

export const signInWithProvider = createAsyncThunk<AuthResponse, AuthProvider>(
  'auth/signInWithProvider',
  async (provider, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: provider as Provider,
      });

      if (error) {
        return { user: null, error };
      }

      return { user: null, error: null, redirectUrl: data.url };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
);

export const signOut = createAsyncThunk<AuthResponse>(
  'auth/signOut',
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        return { user: null, error };
      }

      return { user: null, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
);

export const updateProfile = createAsyncThunk<AuthResponse, UpdateProfileData>(
  'auth/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.updateUser({
        email: profileData.email,
        password: profileData.password,
        data: profileData.metadata,
      });

      if (error) {
        return { user: null, error };
      }

      return { user: data.user as AuthUser, error: null };
    } catch (error) {
      return { user: null, error: error as Error };
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<AuthUser | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.tenantId = action.payload?.tenantId || null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = !!action.payload.user;
        state.tenantId = action.payload.user?.tenantId || null;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = !!action.payload.user;
        state.tenantId = action.payload.user?.tenantId || null;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })
      // Sign In with Provider
      .addCase(signInWithProvider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signInWithProvider.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
        state.isAuthenticated = !!action.payload.user;
        state.tenantId = action.payload.user?.tenantId || null;
      })
      .addCase(signInWithProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.error = null;
        state.isAuthenticated = false;
        state.tenantId = null;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as Error;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;

export default authSlice.reducer; 