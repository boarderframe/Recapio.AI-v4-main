# Database Setup Guide

## Overview
This guide explains how to set up and maintain the local development database for Recapio.AI.

## Prerequisites
- Docker installed and running
- Supabase CLI installed
- Git

## Quick Start
To initialize a fresh local database:
```bash
./scripts/reset-local-db.sh
```

## Git Workflow for Database Changes

### Branch Structure
```
main
├── core/db-setup     # Base database setup
├── core/db-features  # New database features
└── core/db-fixes     # Database fixes and patches
```

### Making Database Changes
1. Create a feature branch from core/db-setup:
```bash
git checkout core/db-setup
git checkout -b core/db-features/your-feature
```

2. Make your changes in:
- `supabase/migrations/` for schema changes
- `supabase/seed.sql` for seed data changes

3. Test your changes:
```bash
./scripts/reset-local-db.sh
```

4. Commit and merge back to core/db-setup

### Version Tagging
- Use semantic versioning for database releases
- Tag format: `v4.x.x-db`
- Example: `v4.4.0-db` for a major database update

## Database Schema

### Core Tables
1. **users**
   - Authentication and user management
   - Roles and permissions

2. **transcripts**
   - Main transcript storage
   - Metadata and content

3. **transcript_types**
   - Transcript categorization
   - Analysis configurations

4. **output_types**
   - Output format definitions
   - Component configurations

5. **output_files**
   - Generated output storage
   - File metadata

### Supporting Tables
1. **ai_providers**
   - AI service providers
   - API configurations

2. **ai_models**
   - Available AI models
   - Model capabilities

3. **playlists**
   - User playlists
   - Transcript organization

4. **playlist_items**
   - Playlist contents
   - Ordering system

## Maintenance

### Regular Tasks
1. Check for database updates:
```bash
git checkout core/db-setup
git pull
./scripts/reset-local-db.sh
```

2. Backup local data:
```bash
supabase db dump
```

### Troubleshooting
If you encounter issues:
1. Stop all Supabase containers
2. Remove Supabase volumes
3. Run reset script
4. Check logs: `supabase logs`

## Security Notes
- Never commit sensitive data to seed files
- Use environment variables for credentials
- Follow least privilege principle for roles 