-- Part 3: Indexes and Functions
-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_transcripts_user_tenant ON transcripts(user_id, tenant_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_status ON transcripts(status);
CREATE INDEX IF NOT EXISTS idx_transcripts_created_at ON transcripts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_transcript_contents_transcript_id ON transcript_contents(transcript_id);
CREATE INDEX IF NOT EXISTS idx_transcript_processing_transcript_id ON transcript_processing(transcript_id);
CREATE INDEX IF NOT EXISTS idx_transcript_processing_status ON transcript_processing(status);
CREATE INDEX IF NOT EXISTS idx_transcript_outputs_transcript_id ON transcript_outputs(transcript_id);
CREATE INDEX IF NOT EXISTS idx_transcript_outputs_type ON transcript_outputs(output_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at trigger to transcripts table
DROP TRIGGER IF EXISTS update_transcripts_updated_at ON transcripts;
CREATE TRIGGER update_transcripts_updated_at
    BEFORE UPDATE ON transcripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create function to calculate token count
CREATE OR REPLACE FUNCTION calculate_token_count(content TEXT)
RETURNS INTEGER AS $$
BEGIN
    -- This is a simple approximation. Adjust the divisor based on your needs
    -- GPT models typically use about 4 characters per token on average
    RETURN CEIL(LENGTH(content) / 4.0);
END;
$$ LANGUAGE plpgsql; 