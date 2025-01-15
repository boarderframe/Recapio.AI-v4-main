#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to cleanup processes on script exit
cleanup() {
    echo -e "\n${YELLOW}Shutting down development environment...${NC}"
    
    # Stop Next.js development server
    if pgrep -f "next" > /dev/null; then
        echo -e "${YELLOW}Stopping Next.js...${NC}"
        pkill -f "next"
    fi
    
    # Stop Supabase if running
    if supabase status &> /dev/null; then
        echo -e "${YELLOW}Stopping Supabase...${NC}"
        supabase stop
    fi
    
    # Stop Colima if running
    if colima status &> /dev/null; then
        echo -e "${YELLOW}Stopping Colima...${NC}"
        colima stop
    fi
    
    echo -e "${GREEN}Development environment stopped!${NC}"
    exit 0
}

# Trap SIGINT (Ctrl+C) and SIGTERM
trap cleanup SIGINT SIGTERM

echo -e "${GREEN}Starting development environment...${NC}"

# Check and start Colima if not running
if ! colima status &> /dev/null; then
    echo -e "${YELLOW}Starting Colima...${NC}"
    colima start
    
    # Wait for Docker daemon to be ready
    echo -e "${YELLOW}Waiting for Docker daemon...${NC}"
    while ! docker info &> /dev/null; do
        echo "."
        sleep 2
    done
else
    echo -e "${GREEN}Colima is already running${NC}"
fi

# Check and start Supabase if not running
if ! supabase status &> /dev/null; then
    echo -e "${YELLOW}Starting Supabase...${NC}"
    supabase start
else
    echo -e "${GREEN}Supabase is already running${NC}"
fi

# Start Next.js development server if not running
if ! pgrep -f "next" > /dev/null; then
    echo -e "${YELLOW}Starting Next.js development server...${NC}"
    npm run dev
else
    echo -e "${GREEN}Next.js is already running${NC}"
    echo -e "${YELLOW}To restart Next.js, run: pkill -f 'next' && npm run dev${NC}"
fi 