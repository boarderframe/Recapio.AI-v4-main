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

-- Create enhanced logging function
CREATE OR REPLACE FUNCTION log_rls_check()
RETURNS TRIGGER AS $$
BEGIN    
    RAISE NOTICE 'RLS Check Details:';
    RAISE NOTICE '  Operation: %', TG_OP;
    RAISE NOTICE '  Role: %', request.jwt.claim('role');
    RAISE NOTICE '  App Metadata Role: %', request.jwt.claim('app_metadata')->>'role';
    RAISE NOTICE '  User ID: %', auth.uid();
    RAISE NOTICE '  Tenant ID: %', NEW.tenant_id;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for logging
DROP TRIGGER IF EXISTS log_rls_check_trigger ON transcript_types;
CREATE TRIGGER log_rls_check_trigger
  BEFORE INSERT OR UPDATE OR DELETE ON transcript_types
  FOR EACH ROW
  EXECUTE FUNCTION log_rls_check();

-- Create exactly one policy per action type
CREATE POLICY "Admins can view transcript types"
ON transcript_types FOR SELECT
TO authenticated
USING (
    request.jwt.claim('app_metadata')->>'role' = 'admin'
);

CREATE POLICY "Admins can insert transcript types"
ON transcript_types FOR INSERT
TO authenticated
WITH CHECK (
    request.jwt.claim('app_metadata')->>'role' = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000'::uuid OR
        tenant_id = auth.uid()::uuid
    )
);

CREATE POLICY "Admins can update transcript types"
ON transcript_types FOR UPDATE
TO authenticated
USING (
    request.jwt.claim('app_metadata')->>'role' = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000'::uuid OR
        tenant_id = auth.uid()::uuid
    )
)
WITH CHECK (
    request.jwt.claim('app_metadata')->>'role' = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000'::uuid OR
        tenant_id = auth.uid()::uuid
    )
);

CREATE POLICY "Admins can delete transcript types"
ON transcript_types FOR DELETE
TO authenticated
USING (
    request.jwt.claim('app_metadata')->>'role' = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000'::uuid OR
        tenant_id = auth.uid()::uuid
    )
);

CREATE POLICY "Users can view transcript types"
ON transcript_types FOR SELECT
TO authenticated
USING (
    tenant_id = auth.uid()::uuid OR
    tenant_id = '00000000-0000-0000-0000-000000000000'::uuid
); 