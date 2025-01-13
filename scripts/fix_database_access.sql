-- Fix Database Access and RLS Policies

-- 1. Create admin access function
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    auth.jwt() ->> 'app_metadata'::text
  )::jsonb ->> 'role' = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Fix transcript_types table
-- First, disable RLS temporarily
ALTER TABLE transcript_types DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can manage transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can view all transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can view transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can insert transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can update transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can delete transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Users can view transcript types" ON transcript_types CASCADE;

-- Reset permissions
REVOKE ALL ON transcript_types FROM authenticated, anon;

-- Grant basic permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON transcript_types TO authenticated;
GRANT SELECT ON transcript_types TO anon;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE transcript_types_id_seq TO authenticated;

-- Enable RLS
ALTER TABLE transcript_types ENABLE ROW LEVEL SECURITY;

-- Create new simplified policies
CREATE POLICY "Admin full access"
ON transcript_types
TO authenticated
USING (auth.is_admin() = true)
WITH CHECK (auth.is_admin() = true);

CREATE POLICY "Users can view transcript types"
ON transcript_types
FOR SELECT
TO authenticated
USING (
    tenant_id = auth.uid() OR
    tenant_id = '00000000-0000-0000-0000-000000000000'
);

-- 3. Create audit schema and logging
CREATE SCHEMA IF NOT EXISTS audit;

CREATE TABLE IF NOT EXISTS audit.operation_log (
    id BIGSERIAL PRIMARY KEY,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL,
    user_id UUID REFERENCES auth.users(id),
    old_data JSONB,
    new_data JSONB,
    timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- Create audit trigger function
CREATE OR REPLACE FUNCTION audit.log_operation()
RETURNS trigger AS $$
BEGIN
    INSERT INTO audit.operation_log (
        table_name,
        operation,
        user_id,
        old_data,
        new_data
    ) VALUES (
        TG_TABLE_NAME,
        TG_OP,
        auth.uid(),
        CASE WHEN TG_OP = 'DELETE' THEN row_to_json(OLD)::jsonb ELSE NULL END,
        CASE WHEN TG_OP IN ('INSERT', 'UPDATE') THEN row_to_json(NEW)::jsonb ELSE NULL END
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add audit trigger to transcript_types
DROP TRIGGER IF EXISTS audit_transcript_types ON transcript_types;
CREATE TRIGGER audit_transcript_types
    AFTER INSERT OR UPDATE OR DELETE ON transcript_types
    FOR EACH ROW EXECUTE FUNCTION audit.log_operation();

-- 4. Create admin verification view
CREATE OR REPLACE VIEW admin_verification AS
SELECT 
    u.id,
    u.email,
    auth.is_admin() as is_admin,
    auth.jwt() ->> 'app_metadata' as app_metadata,
    current_timestamp as checked_at
FROM auth.users u
WHERE u.id = auth.uid();

-- 5. Create performance monitoring view
CREATE OR REPLACE VIEW performance_metrics AS
SELECT 
    schemaname,
    relname,
    seq_scan,
    seq_tup_read,
    idx_scan,
    idx_tup_fetch,
    n_tup_ins,
    n_tup_upd,
    n_tup_del
FROM pg_stat_user_tables
WHERE schemaname = 'public';

-- 6. Verification queries
-- Run these after applying the changes to verify the setup

/*
-- Verify admin access
SELECT * FROM admin_verification;

-- Check RLS policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'transcript_types'
ORDER BY policyname;

-- Check permissions
SELECT 
    grantee,
    table_schema,
    table_name,
    privilege_type
FROM information_schema.role_table_grants
WHERE table_name = 'transcript_types'
ORDER BY grantee;

-- Check audit log
SELECT * FROM audit.operation_log
ORDER BY timestamp DESC
LIMIT 5;
*/ 