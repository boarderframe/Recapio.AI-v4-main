import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { supabase } from '@/lib/supabaseClient';
import { AuthError } from '@supabase/supabase-js';
import { AuthUser, SignUpData, UpdateProfileData, AuthResponse, AuthProvider } from '@/types/auth';

interface AuthState {
  user: AuthUser | null;
  tenantId: string | null;
  isLoading: boolean;
  error: string | null;
  session: any | null;
}

const initialState: AuthState = {
  user: null,
  tenantId: null,
  isLoading: false,
  error: null,
  session: null,
};

// Login with email/password
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data as AuthResponse;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

// Sign up with email/password
export const signUpUser = createAsyncThunk(
  'auth/signUpUser',
  async ({ email, password, first_name, last_name, tenant_id }: SignUpData, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name,
            last_name,
            tenant_id,
            roles: ['user'],
          },
        },
      });
      if (error) throw error;
      return data as AuthResponse;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

// Login with OAuth provider
export const loginWithProvider = createAsyncThunk(
  'auth/loginWithProvider',
  async (provider: AuthProvider, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      return data as AuthResponse;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

// Reset password
export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async (email: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

// Update password
export const updatePassword = createAsyncThunk(
  'auth/updatePassword',
  async (newPassword: string, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      return true;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

// Update profile
export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (data: UpdateProfileData, { rejectWithValue }) => {
    try {
      const { data: userData, error } = await supabase.auth.updateUser({
        data,
      });
      if (error) throw error;
      return userData.user as AuthUser;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser', 
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

// Check current auth session
export const checkAuth = createAsyncThunk(
  'auth/checkAuth', 
  async (_, { rejectWithValue }) => {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error) throw error;
      return session;
    } catch (error) {
      const authError = error as AuthError;
      return rejectWithValue(authError.message);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setTenant: (state, action) => {
      state.tenantId = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.tenantId = action.payload.user?.user_metadata.tenant_id;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Sign Up
      .addCase(signUpUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(signUpUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.session = action.payload.session;
        state.tenantId = action.payload.user?.user_metadata.tenant_id;
      })
      .addCase(signUpUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // OAuth Login
      .addCase(loginWithProvider.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithProvider.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(loginWithProvider.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Password Reset
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Password
      .addCase(updatePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(updatePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.tenantId = action.payload.user_metadata.tenant_id;
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.tenantId = null;
        state.session = null;
      })
      // Check Auth
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.session = action.payload;
        state.user = action.payload?.user as AuthUser || null;
        state.tenantId = action.payload?.user?.user_metadata.tenant_id || null;
      });
  },
});

export const { setTenant, clearError } = authSlice.actions;
export default authSlice.reducer; 