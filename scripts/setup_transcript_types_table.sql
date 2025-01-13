-- Drop existing table if it exists
DROP TABLE IF EXISTS transcript_types CASCADE;

-- Create the transcript_types table
CREATE TABLE transcript_types (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    category_color VARCHAR(50),
    category_icon VARCHAR(50),
    type VARCHAR(100) NOT NULL,
    sub_type TEXT NOT NULL,
    tenant_id UUID DEFAULT '00000000-0000-0000-0000-000000000000',
    analysis_instructions TEXT,
    json_schema TEXT,
    json_structure TEXT,
    api_parameters TEXT,
    summary_prompt TEXT,
    schema_version INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_transcript_types_category ON transcript_types(category);
CREATE INDEX idx_transcript_types_type ON transcript_types(type);
CREATE INDEX idx_transcript_types_tenant ON transcript_types(tenant_id);

-- Add a unique constraint to prevent duplicates within the same tenant
ALTER TABLE transcript_types 
    ADD CONSTRAINT unique_category_type_subtype_tenant 
    UNIQUE (category, type, sub_type, tenant_id);

-- Enable RLS
ALTER TABLE transcript_types ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Admins can view all transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admins can insert transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admins can update transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Admins can delete transcript types" ON transcript_types;
DROP POLICY IF EXISTS "Users can view transcript types" ON transcript_types;

-- Create policies for admin access
CREATE POLICY "Admins can view all transcript types"
    ON transcript_types FOR SELECT
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );

CREATE POLICY "Admins can insert transcript types"
    ON transcript_types FOR INSERT
    WITH CHECK (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );

CREATE POLICY "Admins can update transcript types"
    ON transcript_types FOR UPDATE
    USING (
        (auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin')
        AND (
            tenant_id = '00000000-0000-0000-0000-000000000000' OR
            tenant_id = auth.uid()
        )
    );

CREATE POLICY "Admins can delete transcript types"
    ON transcript_types FOR DELETE
    USING (
        auth.jwt() ->> 'role' = 'admin' OR
        auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
    );

-- Create policies for regular user access
CREATE POLICY "Users can view transcript types"
    ON transcript_types FOR SELECT
    USING (
        tenant_id = auth.uid() OR
        tenant_id = '00000000-0000-0000-0000-000000000000'
    );

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON transcript_types TO authenticated;

-- Create trigger function for updating timestamps
CREATE OR REPLACE FUNCTION update_transcript_types_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for updating timestamps
CREATE TRIGGER update_transcript_types_timestamp
    BEFORE UPDATE ON transcript_types
    FOR EACH ROW
    EXECUTE FUNCTION update_transcript_types_updated_at(); 