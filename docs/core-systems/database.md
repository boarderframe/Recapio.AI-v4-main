# Recapio Database System Documentation

## Overview
This document details the complete database system implementation for Recapio, including Supabase database configuration, table structures, relationships, and data access patterns.

## Local Development Setup

### Prerequisites
- Supabase CLI
- Docker
- For M1/M2 Macs: Colima instead of Docker Desktop

### Installation Steps
1. Install required tools:
   ```bash
   # Install Supabase CLI
   brew install supabase/tap/supabase

   # For M1/M2 Macs
   brew install colima docker docker-compose
   ```

2. Start Docker environment:
   ```bash
   # For M1/M2 Macs
   colima start

   # Verify Docker is running
   docker ps
   ```

3. Initialize local development:
   ```bash
   # Initialize Supabase project
   supabase init

   # Link to your Supabase project
   supabase link --project-ref your-project-ref

   # Start local development
   supabase start
   ```

4. Database migrations:
   ```bash
   # Create a new migration
   supabase migration new my_migration_name

   # Apply migrations
   supabase db reset

   # Check migration status
   supabase migration list
   ```

## File Structure
```
├── supabase/
│   ├── migrations/           # Database migrations
│   │   ├── [timestamp]_*.sql
│   │   └── backup/          # Backup of migrations
│   └── config.toml          # Supabase configuration
├── lib/
│   ├── database/
│   │   ├── client.ts        # Database client configuration
│   │   ├── types.ts         # Database types and schemas
│   │   └── operations/      # Database operations
│   │       ├── transcripts.ts
│   │       └── users.ts
└── types/
    └── database.ts          # Type definitions
```

## Dependencies
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "@supabase/auth-helpers-nextjs": "^0.8.x",
  "postgres": "^3.x.x",
  "@types/pg": "^8.x.x",
  "zod": "^3.x.x"
}
```

## Database Schema

### Core Tables

#### 1. users
```sql
CREATE TABLE public.users (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    roles text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- RLS Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT TO public
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE TO public
    USING (auth.uid() = id);
```

#### 2. transcript_types
```sql
CREATE TABLE public.transcript_types (
    id integer NOT NULL,
    tenant_id uuid NOT NULL REFERENCES public.users(id),
    name text NOT NULL,
    description text,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    deleted_at timestamp with time zone,
    UNIQUE(tenant_id, name)
);

-- RLS Policies
ALTER TABLE public.transcript_types ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access to transcript types" ON public.transcript_types
    AS PERMISSIVE FOR ALL
    TO public
    USING (EXISTS (
        SELECT 1 
        FROM users 
        WHERE users.id = auth.uid() 
        AND 'admin' = ANY(users.roles)
    ));
```

#### 3. transcripts
```sql
CREATE TABLE public.transcripts (
    id uuid DEFAULT uuid_generate_v4(),
    tenant_id uuid NOT NULL REFERENCES public.users(id),
    title text,
    content text,
    metadata jsonb DEFAULT '{}'::jsonb,
    status text DEFAULT 'pending'::text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    deleted_at timestamp with time zone
);

-- RLS Policies
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own transcripts" ON public.transcripts
    AS PERMISSIVE FOR ALL
    TO public
    USING (
        tenant_id = auth.uid() 
        OR EXISTS (
            SELECT 1 
            FROM users 
            WHERE users.id = auth.uid() 
            AND 'admin' = ANY(users.roles)
        )
    );
```

## Security Implementation

### 1. Row Level Security (RLS)
All tables have RLS enabled with specific policies:
- Users can only access their own data
- Admins have full access to all data
- Tenant-based access control

### 2. Admin Access Function
```sql
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.users 
        WHERE id = auth.uid() 
        AND 'admin' = ANY(roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
```

### 3. Statistics Function
```sql
CREATE OR REPLACE FUNCTION public.get_transcript_stats(p_tenant_id uuid)
RETURNS TABLE (
    total_count bigint,
    completed_count bigint,
    processing_count bigint,
    failed_count bigint,
    avg_processing_time numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- Check if user has access to the tenant
    IF NOT EXISTS (
        SELECT 1 
        FROM users 
        WHERE id = auth.uid() 
        AND (
            id = p_tenant_id 
            OR 'admin' = ANY(roles)
            OR p_tenant_id = '00000000-0000-0000-0000-000000000000'
        )
    ) THEN
        RAISE EXCEPTION 'Access denied to tenant data';
    END IF;

    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::BIGINT as completed_count,
        COUNT(CASE WHEN status = 'processing' THEN 1 END)::BIGINT as processing_count,
        COUNT(CASE WHEN status = 'failed' THEN 1 END)::BIGINT as failed_count,
        AVG(
            CASE 
                WHEN status = 'completed' 
                THEN EXTRACT(EPOCH FROM (updated_at - created_at)) 
            END
        )::NUMERIC as avg_processing_time
    FROM transcripts
    WHERE tenant_id = p_tenant_id
    AND deleted_at IS NULL;
END;
$$;
```

## Type Definitions (types/database.ts)
```typescript
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          roles: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Users['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Users['Insert']>;
      };
      transcript_types: {
        Row: {
          id: number;
          tenant_id: string;
          name: string;
          description: string | null;
          settings: Record<string, any>;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<TranscriptTypes['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<TranscriptTypes['Insert']>;
      };
      transcripts: {
        Row: {
          id: string;
          tenant_id: string;
          title: string | null;
          content: string | null;
          metadata: Record<string, any>;
          status: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: Omit<Transcripts['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Transcripts['Insert']>;
      };
    };
    Functions: {
      get_transcript_stats: {
        Args: { p_tenant_id: string };
        Returns: {
          total_count: number;
          completed_count: number;
          processing_count: number;
          failed_count: number;
          avg_processing_time: number;
        };
      };
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
  };
}
```

## Best Practices

### 1. Migration Management
- Always create new migrations for schema changes
- Back up migrations before major changes
- Use `supabase db reset` for local development
- Test migrations locally before applying to production

### 2. Security
- Always enable RLS on new tables
- Use security definer functions for privileged operations
- Implement proper tenant isolation
- Regular security audits

### 3. Performance
- Use appropriate indexes
- Implement soft deletes using `deleted_at`
- Regular database maintenance
- Monitor query performance

## Troubleshooting

### Common Issues
1. Docker/Colima Setup
   ```bash
   # Check Docker status
   docker ps
   
   # Restart Colima
   colima stop
   colima start
   ```

2. Migration Issues
   ```bash
   # Reset migration state
   supabase migration repair --status reverted <migration_id>
   
   # Pull fresh schema
   supabase db pull
   ```

3. Permission Issues
   ```bash
   # Reset permissions
   supabase db reset
   
   # Check RLS policies
   supabase db dump --schema public
   ``` 