import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from .env.local
const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

async function getWebinarTypes() {
    try {
        const { data, error } = await supabase
            .from('transcript_types')
            .select('*')
            .eq('category', 'Webinars & Events')
            .order('type')
            .order('sub_type');
        
        if (error) {
            console.error('Error:', error);
            return;
        }

        console.log('Webinar & Event Types:');
        console.log(JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Error:', error);
    }
}

getWebinarTypes(); 