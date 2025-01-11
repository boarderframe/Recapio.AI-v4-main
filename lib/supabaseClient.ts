import { createClient } from '@supabase/supabase-js';
import { Database } from './database/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
    auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storageKey: 'app-auth',
        storage: typeof window !== 'undefined' ? window.localStorage : undefined,
    },
    realtime: {
        params: {
            eventsPerSecond: 10,
        },
    },
    db: {
        schema: 'public',
    },
}); 