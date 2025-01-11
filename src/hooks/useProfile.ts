import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { supabase } from '@/lib/supabaseClient';
import { AuthUser, UpdateProfileData, UserMetadata } from '@/types/auth';

export function useProfile() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const dispatch = useDispatch();

    const updateProfile = async (data: UpdateProfileData): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const { data: userData, error: userError } = await supabase.auth.updateUser({
                data: data as Partial<UserMetadata>
            });

            if (userError) throw userError;

            // Update local state if needed
            dispatch({ type: 'auth/updateProfile', payload: userData.user });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const getProfile = async (): Promise<AuthUser | null> => {
        try {
            setIsLoading(true);
            setError(null);

            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            return user as AuthUser;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to get profile');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updatePreferences = async (preferences: UserMetadata['preferences']): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            const { data: { user }, error: userError } = await supabase.auth.getUser();
            if (userError) throw userError;

            const currentMetadata = (user as AuthUser).user_metadata;
            await updateProfile({
                ...currentMetadata,
                preferences: {
                    ...currentMetadata.preferences,
                    ...preferences
                }
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update preferences');
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const updateAvatar = async (avatarUrl: string): Promise<void> => {
        return updateProfile({ avatar_url: avatarUrl });
    };

    return {
        updateProfile,
        getProfile,
        updatePreferences,
        updateAvatar,
        isLoading,
        error
    };
} 