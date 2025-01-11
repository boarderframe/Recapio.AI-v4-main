-- Create function to add columns
CREATE OR REPLACE FUNCTION add_transcript_type_columns()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Add columns if they don't exist
    BEGIN
        ALTER TABLE transcript_types
        ADD COLUMN IF NOT EXISTS analysis_instructions TEXT,
        ADD COLUMN IF NOT EXISTS json_schema JSONB,
        ADD COLUMN IF NOT EXISTS api_parameters JSONB;
    EXCEPTION WHEN duplicate_column THEN
        NULL;
    END;

    -- Create indexes
    BEGIN
        CREATE INDEX IF NOT EXISTS idx_transcript_types_analysis 
        ON transcript_types USING gin(to_tsvector('english', analysis_instructions));
    EXCEPTION WHEN duplicate_table THEN
        NULL;
    END;

    BEGIN
        CREATE INDEX IF NOT EXISTS idx_transcript_types_json 
        ON transcript_types USING gin(json_schema);
    EXCEPTION WHEN duplicate_table THEN
        NULL;
    END;

    BEGIN
        CREATE INDEX IF NOT EXISTS idx_transcript_types_api 
        ON transcript_types USING gin(api_parameters);
    EXCEPTION WHEN duplicate_table THEN
        NULL;
    END;
END;
$$; 