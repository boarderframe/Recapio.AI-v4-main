# RLS Policy Troubleshooting Guide

## Issue: Permission Denied for Transcript Types Table

### Problem Description
Users with admin role were unable to insert/update records in the `transcript_types` table despite having the correct permissions and RLS policies in place.

### Root Cause
The issue was related to Row Level Security (RLS) policies and permission configuration:
1. Conflicting policies (especially with the "manage" policy)
2. Permission issues with the sequence for ID generation
3. Tenant ID validation in policies

### Solution
The following SQL script fixes the issues by:
1. Revoking and recreating all permissions
2. Dropping all existing policies
3. Creating specific policies for each operation
4. Granting sequence permissions

```sql
-- First, revoke all privileges and drop all policies
REVOKE ALL ON transcript_types FROM authenticated;
REVOKE ALL ON transcript_types FROM anon;
REVOKE ALL ON transcript_types FROM service_role;

DROP POLICY IF EXISTS "Admins can manage transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can view all transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can view transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can insert transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can update transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can delete transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Users can view transcript types" ON transcript_types CASCADE;

-- Disable RLS temporarily
ALTER TABLE transcript_types DISABLE ROW LEVEL SECURITY;

-- Drop and recreate the index
DROP INDEX IF EXISTS idx_transcript_types_tenant_id;
CREATE INDEX idx_transcript_types_tenant_id
ON transcript_types USING btree (tenant_id);

-- Reset ownership and permissions
ALTER TABLE transcript_types OWNER TO postgres;
REVOKE ALL ON transcript_types FROM PUBLIC;

-- Grant specific permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON transcript_types TO authenticated;
GRANT SELECT ON transcript_types TO anon;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE transcript_types_id_seq TO authenticated;

-- Enable RLS
ALTER TABLE transcript_types ENABLE ROW LEVEL SECURITY;

-- Create specific policies without the general manage policy
CREATE POLICY "Admins can view all transcript types"
ON transcript_types FOR SELECT
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admins can insert transcript types"
ON transcript_types FOR INSERT
TO authenticated
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
);

CREATE POLICY "Admins can update transcript types"
ON transcript_types FOR UPDATE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
);

CREATE POLICY "Admins can delete transcript types"
ON transcript_types FOR DELETE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
);

CREATE POLICY "Users can view transcript types"
ON transcript_types FOR SELECT
TO authenticated
USING (
    tenant_id = auth.uid() OR
    tenant_id = '00000000-0000-0000-0000-000000000000'
);
```

### Verification Steps
1. Run the SQL script in Supabase SQL editor
2. Sign out and sign back in to refresh JWT token
3. Verify policies are correctly set:
```sql
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
```

### Known Limitations
- The solution assumes admin role is stored in `app_metadata.role`
- Tenant ID must match either the user's ID or the default tenant
- Users must sign out and back in after policy changes

### Future Improvements
1. Add better error handling and logging
2. Consider adding policy for service role access
3. Add automated tests for policy verification 