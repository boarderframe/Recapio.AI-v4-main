#!/bin/bash

# Stop any running Supabase containers
echo "Stopping Supabase containers..."
docker ps -a | grep 'supabase' | awk '{print $1}' | xargs -I {} docker rm -f {}

# Remove Supabase volumes
echo "Removing Supabase volumes..."
docker volume ls --filter label=com.supabase.cli.project=your-project-id | awk 'NR>1 {print $2}' | xargs -I {} docker volume rm {}

# Start Supabase
echo "Starting Supabase..."
supabase start

# Check if Supabase started successfully
if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully!"
    echo "🔗 Studio URL: http://127.0.0.1:54323"
    echo "📝 Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres"
    echo "🔑 anon key: $(supabase status | grep 'anon key:' | awk '{print $3}')"
    echo "🔑 service_role key: $(supabase status | grep 'service_role key:' | awk '{print $3}')"
else
    echo "❌ Failed to initialize database"
    exit 1
fi 