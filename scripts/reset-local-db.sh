#!/bin/bash

echo "Stopping Supabase containers..."
supabase stop

echo "Removing Supabase volumes..."
docker volume rm $(docker volume ls -q | grep supabase) 2>/dev/null || true

echo "Starting Supabase..."
supabase start

# Check if Supabase started successfully
if [ $? -eq 0 ]; then
    echo "✅ Database initialized successfully!"
    echo "🔗 Studio URL: http://127.0.0.1:54323"
    echo "📝 Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres"

    echo "🔑 Admin credentials:"
    echo "Email: cosburn@yahoo.com"
    echo "Password: Anker5425$a"

    echo "🔑 Test user credentials:"
    echo "Email: user1@recapio.ai"
    echo "Password: User123!"
else
    echo "❌ Failed to initialize database"
    exit 1
fi 