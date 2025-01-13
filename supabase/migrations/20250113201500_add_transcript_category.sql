-- Drop existing functions
DROP FUNCTION IF EXISTS create_transcript(UUID, TEXT);
DROP FUNCTION IF EXISTS create_transcript(UUID, TEXT, TEXT, TEXT);
DROP FUNCTION IF EXISTS create_transcript(UUID, TEXT, TEXT, TEXT, source_type, TEXT);
DROP FUNCTION IF EXISTS get_user_transcripts(UUID, INTEGER, INTEGER);

-- Create updated function with all required fields
CREATE OR REPLACE FUNCTION create_transcript(
    p_tenant_id UUID,
    p_title TEXT,
    p_category TEXT DEFAULT 'general',
    p_language TEXT DEFAULT 'en',
    p_source_type source_type DEFAULT 'text',
    p_sub_type TEXT DEFAULT 'meeting',
    p_type TEXT DEFAULT 'business',
    p_summary TEXT DEFAULT '',
    p_universal_metadata JSONB DEFAULT '{}'::JSONB,
    p_user_id UUID DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_transcript_id UUID;
BEGIN
    -- If user_id is not provided, use the current user's ID
    IF p_user_id IS NULL THEN
        p_user_id := auth.uid();
    END IF;

    INSERT INTO transcripts (
        id, 
        tenant_id, 
        title, 
        status,
        category,
        language,
        source_type,
        sub_type,
        type,
        summary,
        universal_metadata,
        user_id
    )
    VALUES (
        uuid_generate_v4(), 
        p_tenant_id, 
        p_title, 
        'pending',
        p_category,
        p_language,
        p_source_type,
        p_sub_type,
        p_type,
        p_summary,
        p_universal_metadata,
        p_user_id
    )
    RETURNING id INTO v_transcript_id;

    RETURN v_transcript_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create get_user_transcripts function
CREATE OR REPLACE FUNCTION get_user_transcripts(
    p_tenant_id UUID,
    p_offset INTEGER DEFAULT 0,
    p_limit INTEGER DEFAULT 10
) RETURNS TABLE (
    id UUID,
    tenant_id UUID,
    title TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ,
    category TEXT,
    language TEXT,
    source_type TEXT,
    sub_type TEXT,
    type TEXT,
    summary TEXT,
    universal_metadata JSONB,
    user_id UUID
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.tenant_id,
        t.title,
        t.status,
        t.created_at,
        t.updated_at,
        t.category,
        t.language,
        t.source_type::TEXT,
        t.sub_type,
        t.type,
        t.summary,
        t.universal_metadata,
        t.user_id
    FROM transcripts t
    WHERE t.tenant_id = p_tenant_id
    ORDER BY t.created_at DESC
    OFFSET p_offset
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION create_transcript(UUID, TEXT, TEXT, TEXT, source_type, TEXT, TEXT, TEXT, JSONB, UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_transcripts(UUID, INTEGER, INTEGER) TO authenticated; 