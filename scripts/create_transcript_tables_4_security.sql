-- Part 4: Security Policies and Permissions
-- Enable Row Level Security
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_contents ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_processing ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_outputs ENABLE ROW LEVEL SECURITY;

-- Create RLS Policies
-- Transcripts table policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own transcripts" ON transcripts;
    CREATE POLICY "Users can view their own transcripts"
        ON transcripts FOR SELECT
        USING (auth.uid() = user_id);
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can insert their own transcripts" ON transcripts;
    CREATE POLICY "Users can insert their own transcripts"
        ON transcripts FOR INSERT
        WITH CHECK (auth.uid() = user_id);
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can update their own transcripts" ON transcripts;
    CREATE POLICY "Users can update their own transcripts"
        ON transcripts FOR UPDATE
        USING (auth.uid() = user_id)
        WITH CHECK (auth.uid() = user_id);
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can delete their own transcripts" ON transcripts;
    CREATE POLICY "Users can delete their own transcripts"
        ON transcripts FOR DELETE
        USING (auth.uid() = user_id);
END $$;

-- Transcript contents policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own transcript contents" ON transcript_contents;
    CREATE POLICY "Users can view their own transcript contents"
        ON transcript_contents FOR SELECT
        USING (EXISTS (
            SELECT 1 FROM transcripts
            WHERE transcripts.id = transcript_contents.transcript_id
            AND transcripts.user_id = auth.uid()
        ));
END $$;

DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can insert their own transcript contents" ON transcript_contents;
    CREATE POLICY "Users can insert their own transcript contents"
        ON transcript_contents FOR INSERT
        WITH CHECK (EXISTS (
            SELECT 1 FROM transcripts
            WHERE transcripts.id = transcript_contents.transcript_id
            AND transcripts.user_id = auth.uid()
        ));
END $$;

-- Transcript processing policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own transcript processing" ON transcript_processing;
    CREATE POLICY "Users can view their own transcript processing"
        ON transcript_processing FOR SELECT
        USING (EXISTS (
            SELECT 1 FROM transcripts
            WHERE transcripts.id = transcript_processing.transcript_id
            AND transcripts.user_id = auth.uid()
        ));
END $$;

-- Transcript outputs policies
DO $$ BEGIN
    DROP POLICY IF EXISTS "Users can view their own transcript outputs" ON transcript_outputs;
    CREATE POLICY "Users can view their own transcript outputs"
        ON transcript_outputs FOR SELECT
        USING (EXISTS (
            SELECT 1 FROM transcripts
            WHERE transcripts.id = transcript_outputs.transcript_id
            AND transcripts.user_id = auth.uid()
        ));
END $$;

-- Grant appropriate permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON transcripts TO authenticated;
GRANT SELECT, INSERT ON transcript_contents TO authenticated;
GRANT SELECT ON transcript_processing TO authenticated;
GRANT SELECT ON transcript_outputs TO authenticated; 