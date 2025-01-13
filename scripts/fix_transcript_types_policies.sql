-- Drop existing policies
DROP POLICY IF EXISTS "Admin full access to transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admins can manage all transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Users can view transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Users can modify own transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Users can delete own transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Users can insert own transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admin can view all transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admin can insert transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admin can update transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admin can delete transcript types" ON transcript_types;

-- Enable RLS
ALTER TABLE transcript_types FORCE ROW LEVEL SECURITY;

-- Create new policies

-- 1. Combined view policy (admins see all, users see own + global)
CREATE POLICY "View transcript types"
ON transcript_types
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
    OR tenant_id = '00000000-0000-0000-0000-000000000000'::uuid
);

-- 2. Combined insert policy
CREATE POLICY "Insert transcript types"
ON transcript_types
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    (
        EXISTS (
            SELECT 1 FROM users
            WHERE users.id = auth.uid()
            AND 'admin' = ANY(users.roles)
        )
    ) OR (
        tenant_id = auth.uid()
    )
);

-- 3. Combined update policy
CREATE POLICY "Update transcript types"
ON transcript_types
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
);

-- 4. Combined delete policy
CREATE POLICY "Delete transcript types"
ON transcript_types
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
);

-- Verify policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'transcript_types'
ORDER BY policyname; 