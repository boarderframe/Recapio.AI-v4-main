-- Disable Row Level Security triggers first
ALTER TABLE transcripts DISABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_contents DISABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_processing DISABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_outputs DISABLE ROW LEVEL SECURITY;

-- Drop policies
DROP POLICY IF EXISTS "Users can view their own transcripts" ON transcripts;
DROP POLICY IF EXISTS "Users can insert their own transcripts" ON transcripts;
DROP POLICY IF EXISTS "Users can update their own transcripts" ON transcripts;
DROP POLICY IF EXISTS "Users can delete their own transcripts" ON transcripts;
DROP POLICY IF EXISTS "Users can view their own transcript contents" ON transcript_contents;
DROP POLICY IF EXISTS "Users can insert their own transcript contents" ON transcript_contents;
DROP POLICY IF EXISTS "Users can view their own transcript processing" ON transcript_processing;
DROP POLICY IF EXISTS "Users can view their own transcript outputs" ON transcript_outputs;

-- Revoke permissions
REVOKE ALL ON transcripts FROM authenticated;
REVOKE ALL ON transcript_contents FROM authenticated;
REVOKE ALL ON transcript_processing FROM authenticated;
REVOKE ALL ON transcript_outputs FROM authenticated;

-- Drop triggers
DROP TRIGGER IF EXISTS update_transcripts_updated_at ON transcripts;

-- Drop functions
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS calculate_token_count(TEXT);

-- Drop tables (in correct order due to dependencies)
DROP TABLE IF EXISTS transcript_outputs;
DROP TABLE IF EXISTS transcript_processing;
DROP TABLE IF EXISTS transcript_contents;
DROP TABLE IF EXISTS transcripts;

-- Drop enum types
DROP TYPE IF EXISTS transcript_status;
DROP TYPE IF EXISTS source_type;
DROP TYPE IF EXISTS output_type;
DROP TYPE IF EXISTS processing_status; 