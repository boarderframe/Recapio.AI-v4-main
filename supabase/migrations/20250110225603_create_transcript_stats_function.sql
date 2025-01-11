-- Function to get transcript statistics for a tenant
CREATE OR REPLACE FUNCTION get_transcript_stats(p_tenant_id UUID)
RETURNS TABLE (
    total_count BIGINT,
    completed_count BIGINT,
    processing_count BIGINT,
    failed_count BIGINT,
    avg_processing_time NUMERIC
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_count,
        COUNT(CASE WHEN status = 'completed' THEN 1 END)::BIGINT as completed_count,
        COUNT(CASE WHEN status = 'processing' THEN 1 END)::BIGINT as processing_count,
        COUNT(CASE WHEN status = 'failed' THEN 1 END)::BIGINT as failed_count,
        AVG(CASE WHEN status = 'completed' THEN EXTRACT(EPOCH FROM (updated_at - created_at)) END)::NUMERIC as avg_processing_time
    FROM transcripts
    WHERE tenant_id = p_tenant_id
    AND deleted_at IS NULL;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION get_transcript_stats(UUID) TO authenticated;

-- Add row level security policy
ALTER FUNCTION get_transcript_stats(UUID) SET RLS_ENABLED = TRUE;

COMMENT ON FUNCTION get_transcript_stats(UUID) IS 'Get transcript statistics for a tenant, including counts by status and average processing time';

-- Create an index to optimize the statistics query
CREATE INDEX IF NOT EXISTS idx_transcripts_tenant_status
    ON transcripts (tenant_id, status)
    WHERE deleted_at IS NULL;

-- Create an index for processing time calculation
CREATE INDEX IF NOT EXISTS idx_transcripts_processing_time
    ON transcripts (tenant_id, status, created_at, updated_at)
    WHERE status = 'completed' AND deleted_at IS NULL; 