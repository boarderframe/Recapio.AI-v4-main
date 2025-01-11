import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { createTranscriptType } from '../lib/database/operations/transcript_type.js';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Missing Supabase environment variables');
    process.exit(1);
}

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Make supabase client available globally for database operations
global.supabase = supabase;

async function insertTranscriptType() {
    try {
        const data = {
            category: 'Webinars & Events',
            type: 'Industry',
            sub_type: 'Best Practices',
            category_color: '#F57C00',
            category_icon: 'cast'
        };

        const result = await createTranscriptType(data);
        console.log('Successfully inserted transcript type:', result);
        return result;
    } catch (error) {
        if (error.message === 'Transcript type already exists') {
            console.log('Transcript type already exists');
        } else {
            console.error('Error in insertTranscriptType:', error);
        }
        return null;
    }
}

// Execute the insert
insertTranscriptType(); 