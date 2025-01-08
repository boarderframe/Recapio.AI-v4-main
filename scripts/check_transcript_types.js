import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkTranscriptTypes() {
  const { data: transcriptTypes, error } = await supabase
    .from('transcript_types')
    .select('*')
    .eq('category', 'Webinars & Events')
    .order('type', { ascending: true });

  if (error) {
    console.error('Error fetching transcript types:', error);
    return;
  }

  console.log('Found Webinars & Events transcript types:');
  const groupedByType = {};
  transcriptTypes.forEach(tt => {
    if (!groupedByType[tt.type]) {
      groupedByType[tt.type] = [];
    }
    groupedByType[tt.type].push(tt.sub_type);
  });

  for (const [type, subTypes] of Object.entries(groupedByType)) {
    console.log(`\nType: ${type}`);
    subTypes.forEach(subType => {
      console.log(`  - ${subType}`);
    });
  }
}

checkTranscriptTypes(); 