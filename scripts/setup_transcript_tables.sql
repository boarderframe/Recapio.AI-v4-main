-- Begin transaction
BEGIN;

-- Check and enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop enum types first (if they exist)
DO $$ 
BEGIN
    DROP TYPE IF EXISTS transcript_status;
    DROP TYPE IF EXISTS source_type;
    DROP TYPE IF EXISTS output_type;
    DROP TYPE IF EXISTS processing_status;
EXCEPTION
    WHEN OTHERS THEN null;
END $$;

-- Create enum types
DO $$ BEGIN
    CREATE TYPE transcript_status AS ENUM ('draft', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE source_type AS ENUM ('text', 'document', 'media', 'live');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE output_type AS ENUM ('summary', 'key_points', 'action_items', 'category_specific');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE processing_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create transcript_types table if it doesn't exist
CREATE TABLE IF NOT EXISTS transcript_types (
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    sub_type TEXT NOT NULL,
    summary_prompt TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (category, type, sub_type)
);

-- Drop existing tables if they exist
DROP TABLE IF EXISTS transcript_outputs CASCADE;
DROP TABLE IF EXISTS transcript_processing CASCADE;
DROP TABLE IF EXISTS transcript_contents CASCADE;
DROP TABLE IF EXISTS transcripts CASCADE;

-- Create tables
CREATE TABLE transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    tenant_id UUID NOT NULL,
    organization_id UUID,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    sub_type TEXT NOT NULL,
    title TEXT NOT NULL,
    status transcript_status NOT NULL DEFAULT 'draft',
    source_type source_type NOT NULL DEFAULT 'text',
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (category, type, sub_type) REFERENCES transcript_types(category, type, sub_type)
);

CREATE TABLE transcript_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
    original_content TEXT NOT NULL,
    processed_content TEXT,
    word_count INTEGER,
    token_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE transcript_processing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
    model_id TEXT NOT NULL,
    model_provider TEXT NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cost DECIMAL(10,4) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status processing_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    metadata JSONB
);

CREATE TABLE transcript_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
    output_type output_type NOT NULL,
    content JSONB NOT NULL,
    model_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_transcripts_user_tenant ON transcripts(user_id, tenant_id);
CREATE INDEX idx_transcripts_status ON transcripts(status);
CREATE INDEX idx_transcripts_created_at ON transcripts(created_at DESC);
CREATE INDEX idx_transcript_contents_transcript_id ON transcript_contents(transcript_id);
CREATE INDEX idx_transcript_processing_transcript_id ON transcript_processing(transcript_id);
CREATE INDEX idx_transcript_processing_status ON transcript_processing(status);
CREATE INDEX idx_transcript_outputs_transcript_id ON transcript_outputs(transcript_id);
CREATE INDEX idx_transcript_outputs_type ON transcript_outputs(output_type);

-- Create functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE FUNCTION calculate_token_count(content TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- This is a simple approximation. Adjust the divisor based on your needs
    -- GPT models typically use about 4 characters per token on average
    RETURN CEIL(LENGTH(content) / 4.0);
END;
$$ LANGUAGE plpgsql;

-- Create triggers
CREATE TRIGGER update_transcripts_updated_at
    BEFORE UPDATE ON transcripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_outputs ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own transcripts"
    ON transcripts FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transcripts"
    ON transcripts FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transcripts"
    ON transcripts FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transcripts"
    ON transcripts FOR DELETE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own transcript contents"
    ON transcript_contents FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM transcripts
        WHERE transcripts.id = transcript_contents.transcript_id
        AND transcripts.user_id = auth.uid()
    ));

CREATE POLICY "Users can insert their own transcript contents"
    ON transcript_contents FOR INSERT
    WITH CHECK (EXISTS (
        SELECT 1 FROM transcripts
        WHERE transcripts.id = transcript_contents.transcript_id
        AND transcripts.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own transcript processing"
    ON transcript_processing FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM transcripts
        WHERE transcripts.id = transcript_processing.transcript_id
        AND transcripts.user_id = auth.uid()
    ));

CREATE POLICY "Users can view their own transcript outputs"
    ON transcript_outputs FOR SELECT
    USING (EXISTS (
        SELECT 1 FROM transcripts
        WHERE transcripts.id = transcript_outputs.transcript_id
        AND transcripts.user_id = auth.uid()
    ));

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON transcripts TO authenticated;
GRANT SELECT, INSERT ON transcript_contents TO authenticated;
GRANT SELECT ON transcript_processing TO authenticated;
GRANT SELECT ON transcript_outputs TO authenticated;

-- Commit transaction
COMMIT; 