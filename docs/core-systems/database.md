# Recapio Database System Documentation

## Overview
This document details the complete database system implementation for Recapio, including Supabase database configuration, table structures, relationships, and data access patterns.

## File Structure
```
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Supabase client configuration
│   │   ├── types.ts           # Database types and schemas
│   │   └── queries/           # Database queries and mutations
│   │       ├── transcripts.ts
│   │       ├── users.ts
│   │       └── settings.ts
├── migrations/                # Database migrations
│   └── [timestamp]_*.sql
├── types/
│   └── database.ts           # Type definitions for database entities
└── utils/
    └── db-helpers.ts         # Database utility functions
```

## Dependencies
```json
{
  "@supabase/supabase-js": "^2.x.x",
  "postgres": "^3.x.x",
  "@types/pg": "^8.x.x",
  "zod": "^3.x.x"  // For runtime type validation
}
```

## Database Schema

### Tables Structure

#### 1. users
```sql
create table public.users (
  id uuid references auth.users on delete cascade,
  email text unique not null,
  display_name text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- RLS Policies
alter table public.users enable row level security;

create policy "Users can view their own data" on users
  for select using (auth.uid() = id);

create policy "Users can update their own data" on users
  for update using (auth.uid() = id);
```

#### 2. transcripts
```sql
create table public.transcripts (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade,
  title text not null,
  content text,
  audio_url text,
  duration integer,
  status text default 'pending',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.transcripts enable row level security;

create policy "Users can view own transcripts" on transcripts
  for select using (auth.uid() = user_id);

create policy "Users can create own transcripts" on transcripts
  for insert with check (auth.uid() = user_id);

create policy "Users can update own transcripts" on transcripts
  for update using (auth.uid() = user_id);

create policy "Users can delete own transcripts" on transcripts
  for delete using (auth.uid() = user_id);
```

#### 3. user_settings
```sql
create table public.user_settings (
  user_id uuid references public.users(id) on delete cascade primary key,
  theme text default 'light',
  notifications boolean default true,
  language text default 'en',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table public.user_settings enable row level security;

create policy "Users can view own settings" on user_settings
  for select using (auth.uid() = user_id);

create policy "Users can update own settings" on user_settings
  for update using (auth.uid() = user_id);
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
          display_name: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Users['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Users['Insert']>;
      };
      transcripts: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          content: string | null;
          audio_url: string | null;
          duration: number | null;
          status: 'pending' | 'processing' | 'completed' | 'error';
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Transcripts['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Transcripts['Insert']>;
      };
      user_settings: {
        Row: {
          user_id: string;
          theme: 'light' | 'dark';
          notifications: boolean;
          language: string;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<UserSettings['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<UserSettings['Insert']>;
      };
    };
  };
}
```

## Database Access Implementation

### 1. Supabase Client Configuration (lib/supabase/client.ts)
```typescript
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  db: {
    schema: 'public',
  },
});
```

### 2. Query Implementation Examples

#### Transcripts Queries (lib/supabase/queries/transcripts.ts)
```typescript
export const transcriptQueries = {
  async getTranscripts(userId: string) {
    const { data, error } = await supabase
      .from('transcripts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async createTranscript(transcript: Database['public']['Tables']['transcripts']['Insert']) {
    const { data, error } = await supabase
      .from('transcripts')
      .insert(transcript)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateTranscript(
    id: string,
    updates: Database['public']['Tables']['transcripts']['Update']
  ) {
    const { data, error } = await supabase
      .from('transcripts')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
```

## Security Implementation

### 1. Row Level Security (RLS)
- Enabled on all tables
- User-specific policies
- Role-based access control

### 2. Data Validation
```typescript
const transcriptSchema = z.object({
  title: z.string().min(1).max(255),
  content: z.string().optional(),
  audio_url: z.string().url().optional(),
  duration: z.number().positive().optional(),
  status: z.enum(['pending', 'processing', 'completed', 'error'])
});
```

### 3. Query Security
- Parameterized queries
- Input sanitization
- Error handling

## Performance Optimization

### 1. Indexing Strategy
```sql
-- Transcript search optimization
create index transcripts_title_idx on transcripts using gin(to_tsvector('english', title));
create index transcripts_user_id_idx on transcripts(user_id);
create index transcripts_created_at_idx on transcripts(created_at desc);
```

### 2. Query Optimization
- Efficient joins
- Pagination implementation
- Selective column fetching

### 3. Caching Strategy
- Redis integration (optional)
- Client-side caching
- Query result caching

## Error Handling

### 1. Database Errors
```typescript
const handleDatabaseError = (error: PostgrestError) => {
  switch (error.code) {
    case '23505': // unique violation
      return 'This record already exists';
    case '23503': // foreign key violation
      return 'Referenced record does not exist';
    default:
      return 'Database error occurred';
  }
};
```

### 2. Connection Errors
- Retry mechanisms
- Fallback strategies
- Error logging

## Maintenance Guidelines

### 1. Database Migrations
- Version control
- Rollback procedures
- Testing strategy

### 2. Backup Strategy
- Regular backups
- Point-in-time recovery
- Disaster recovery plan

### 3. Monitoring
- Performance metrics
- Error tracking
- Usage statistics

## Testing Guidelines

### 1. Unit Tests
- Query functions
- Data validation
- Error handling

### 2. Integration Tests
- Database operations
- Transaction handling
- RLS policies

### 3. Performance Tests
- Load testing
- Query optimization
- Connection pooling

## Troubleshooting Guide

### 1. Common Issues
- Connection timeouts
- Query performance
- Data consistency
- RLS policy issues

### 2. Solutions
- Connection pool management
- Query optimization
- Index maintenance
- Policy verification

## Future Improvements

### 1. Performance
- Advanced indexing
- Materialized views
- Query optimization

### 2. Features
- Full-text search
- Real-time subscriptions
- Audit logging

### 3. Security
- Enhanced RLS policies
- Audit trails
- Data encryption

## Backup and Recovery

### 1. Backup Strategy
- Daily full backups
- Continuous WAL archiving
- Retention policy

### 2. Recovery Procedures
- Point-in-time recovery
- Disaster recovery
- Data verification

## Monitoring and Alerts

### 1. Metrics
- Query performance
- Connection pool status
- Storage usage
- Error rates

### 2. Alerts
- Performance degradation
- Storage thresholds
- Error spikes
- Connection issues 