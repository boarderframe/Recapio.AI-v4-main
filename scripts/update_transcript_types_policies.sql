-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admins can insert transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admins can update transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admins can delete transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Users can view transcript types" ON transcript_types;

-- Create index for better performance if it doesn't exist
CREATE INDEX IF NOT EXISTS idx_transcript_types_tenant_id
    ON transcript_types
    USING btree (tenant_id);

-- Create policies for admin access
CREATE POLICY "Admins can view all transcript types"
    ON transcript_types FOR SELECT
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );

CREATE POLICY "Admins can insert transcript types"
    ON transcript_types FOR INSERT
    TO authenticated
    WITH CHECK (
        (auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
        AND (
            tenant_id = '00000000-0000-0000-0000-000000000000' OR
            tenant_id = auth.uid()
        )
    );

CREATE POLICY "Admins can update transcript types"
    ON transcript_types FOR UPDATE
    TO authenticated
    USING (
        (auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
        AND (
            tenant_id = '00000000-0000-0000-0000-000000000000' OR
            tenant_id = auth.uid()
        )
    )
    WITH CHECK (
        (auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
        AND (
            tenant_id = '00000000-0000-0000-0000-000000000000' OR
            tenant_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete transcript types"
    ON transcript_types FOR DELETE
    TO authenticated
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );

-- Create policies for regular user access
CREATE POLICY "Users can view transcript types"
    ON transcript_types FOR SELECT
    TO authenticated
    USING (
        tenant_id = auth.uid() OR
        tenant_id = '00000000-0000-0000-0000-000000000000'
    ); 