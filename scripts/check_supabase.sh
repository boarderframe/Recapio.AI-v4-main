#!/bin/bash

# Export Supabase connection details
export PGHOST=db.fspqwmtossmgfgkwuuzf.supabase.co
export PGPORT=5432
export PGDATABASE=postgres
export PGUSER=postgres
export PGPASSWORD=Anker5425$
export PGSSLMODE=require

# Function to run a query
run_query() {
    echo "Running query: $1"
    psql -c "$1"
}

# Check tables
echo "Checking tables..."
run_query "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' AND table_name LIKE 'transcript%';"

# Check types
echo -e "\nChecking types..."
run_query "SELECT t.typname FROM pg_type t WHERE t.typname IN ('transcript_status', 'source_type', 'output_type', 'processing_status');"

# Check policies
echo -e "\nChecking policies..."
run_query "SELECT tablename, policyname FROM pg_policies WHERE tablename LIKE 'transcript%';" 