-- Helper functions for Recapio.AI database operations

-- User Management Functions
CREATE OR REPLACE FUNCTION get_user_by_email(p_email TEXT)
RETURNS TABLE (
    id UUID,
    email TEXT,
    roles TEXT[],
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT u.id, u.email, u.roles, u.created_at, u.updated_at
    FROM users u
    WHERE u.email = p_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_user_roles(p_user_id UUID, p_roles TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE users
    SET roles = p_roles,
        updated_at = NOW()
    WHERE id = p_user_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Transcript Management Functions
CREATE OR REPLACE FUNCTION create_transcript(
    p_tenant_id UUID,
    p_title TEXT
)
RETURNS UUID AS $$
DECLARE
    v_transcript_id UUID;
BEGIN
    INSERT INTO transcripts (id, tenant_id, title, status)
    VALUES (uuid_generate_v4(), p_tenant_id, p_title, 'pending')
    RETURNING id INTO v_transcript_id;
    
    RETURN v_transcript_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_user_transcripts(
    p_tenant_id UUID,
    p_limit INTEGER DEFAULT 10,
    p_offset INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title TEXT,
    status TEXT,
    created_at TIMESTAMPTZ,
    updated_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT t.id, t.title, t.status, t.created_at, t.updated_at
    FROM transcripts t
    WHERE t.tenant_id = p_tenant_id
    AND t.deleted_at IS NULL
    ORDER BY t.created_at DESC
    LIMIT p_limit
    OFFSET p_offset;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION update_transcript_status(
    p_transcript_id UUID,
    p_status TEXT
)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE transcripts
    SET status = p_status,
        updated_at = NOW()
    WHERE id = p_transcript_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Transcript Type Management Functions
CREATE OR REPLACE FUNCTION create_transcript_type(
    p_tenant_id UUID,
    p_name TEXT,
    p_description TEXT DEFAULT NULL,
    p_settings JSONB DEFAULT '{}'::jsonb
)
RETURNS INTEGER AS $$
DECLARE
    v_type_id INTEGER;
BEGIN
    INSERT INTO transcript_types (tenant_id, name, description, settings)
    VALUES (p_tenant_id, p_name, p_description, p_settings)
    RETURNING id INTO v_type_id;
    
    RETURN v_type_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION get_available_transcript_types(p_tenant_id UUID)
RETURNS TABLE (
    id INTEGER,
    name TEXT,
    description TEXT,
    settings JSONB,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT tt.id, tt.name, tt.description, tt.settings, tt.created_at
    FROM transcript_types tt
    WHERE (tt.tenant_id = p_tenant_id OR tt.tenant_id = '00000000-0000-0000-0000-000000000000')
    AND tt.deleted_at IS NULL
    ORDER BY tt.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Utility Functions
CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1
        FROM users
        WHERE id = p_user_id
        AND 'admin' = ANY(roles)
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION soft_delete_transcript(p_transcript_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE transcripts
    SET deleted_at = NOW()
    WHERE id = p_transcript_id
    AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION soft_delete_transcript_type(p_type_id INTEGER)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE transcript_types
    SET deleted_at = NOW()
    WHERE id = p_type_id
    AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions to authenticated users
GRANT EXECUTE ON FUNCTION get_user_by_email TO authenticated;
GRANT EXECUTE ON FUNCTION update_user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION create_transcript TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_transcripts TO authenticated;
GRANT EXECUTE ON FUNCTION update_transcript_status TO authenticated;
GRANT EXECUTE ON FUNCTION create_transcript_type TO authenticated;
GRANT EXECUTE ON FUNCTION get_available_transcript_types TO authenticated;
GRANT EXECUTE ON FUNCTION is_admin TO authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_transcript TO authenticated;
GRANT EXECUTE ON FUNCTION soft_delete_transcript_type TO authenticated;
