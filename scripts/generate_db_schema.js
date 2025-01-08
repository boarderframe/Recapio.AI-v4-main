import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://fspqwmtossmgfgkwuuzf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZzcHF3bXRvc3NtZ2Zna3d1dXpmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MTc0MTQsImV4cCI6MjA0OTk5MzQxNH0.gPhpPd7qN7EwtdeOnI1yVrEVu9wI0rEADhSmvyFFIco';

const supabase = createClient(supabaseUrl, supabaseKey);

async function getTableInfo() {
  const { data: tables, error: tablesError } = await supabase
    .rpc('get_schema_info');

  if (tablesError) {
    console.error('Error fetching tables:', tablesError);
    return;
  }

  // Write the schema info to a JSON file
  const fs = await import('fs');
  fs.writeFileSync(
    'db_schema.json',
    JSON.stringify(tables, null, 2),
    'utf8'
  );

  console.log('Database schema has been written to db_schema.json');
}

getTableInfo(); 