-- Test suite for database functions
SET client_min_messages TO NOTICE;

-- Setup test data
DO $$
DECLARE
    admin_user_id UUID;
    normal_user_id UUID;
    test_transcript_id UUID;
    test_type_id INTEGER;
BEGIN
    -- Create test users
    INSERT INTO auth.users (id, email)
    VALUES 
        (gen_random_uuid(), 'admin@recapio.ai')
    RETURNING id INTO admin_user_id;

    INSERT INTO auth.users (id, email)
    VALUES 
        (gen_random_uuid(), 'user@recapio.ai')
    RETURNING id INTO normal_user_id;

    -- Make first user admin
    UPDATE users 
    SET roles = array_append(roles, 'admin')
    WHERE id = admin_user_id;

    RAISE NOTICE 'Test users created - Admin: %, Normal: %', admin_user_id, normal_user_id;

    -- Test User Management Functions
    RAISE NOTICE E'\n=== Testing User Management Functions ===';
    
    -- Test get_user_by_email
    RAISE NOTICE 'Testing get_user_by_email:';
    RAISE NOTICE 'Admin user: %', (SELECT row_to_json(u.*) FROM get_user_by_email('admin@recapio.ai') u);
    RAISE NOTICE 'Normal user: %', (SELECT row_to_json(u.*) FROM get_user_by_email('user@recapio.ai') u);

    -- Test update_user_roles
    RAISE NOTICE E'\nTesting update_user_roles:';
    PERFORM update_user_roles(normal_user_id, ARRAY['tester']);
    RAISE NOTICE 'Updated user roles: %', (
        SELECT row_to_json(u) FROM users u WHERE id = normal_user_id
    );

    -- Test Transcript Management
    RAISE NOTICE E'\n=== Testing Transcript Management Functions ===';
    
    -- Test create_transcript
    SELECT create_transcript(
        admin_user_id,
        'Test Transcript'
    ) INTO test_transcript_id;
    
    RAISE NOTICE 'Created transcript: %', (
        SELECT row_to_json(t) FROM transcripts t WHERE id = test_transcript_id
    );

    -- Test get_user_transcripts
    RAISE NOTICE E'\nUser transcripts:';
    RAISE NOTICE '%', (
        SELECT json_agg(t)
        FROM get_user_transcripts(admin_user_id, 10, 0) t
    );

    -- Test update_transcript_status
    PERFORM update_transcript_status(test_transcript_id, 'processing');
    RAISE NOTICE E'\nUpdated transcript status:';
    RAISE NOTICE '%', (
        SELECT row_to_json(t) FROM transcripts t WHERE id = test_transcript_id
    );

    -- Test Transcript Type Management
    RAISE NOTICE E'\n=== Testing Transcript Type Management Functions ===';
    
    -- Test create_transcript_type
    SELECT create_transcript_type(
        admin_user_id,
        'Test Type',
        'Test Description',
        jsonb_build_object('test_setting', true)
    ) INTO test_type_id;

    RAISE NOTICE 'Created transcript type:';
    RAISE NOTICE '%', (
        SELECT row_to_json(tt) FROM transcript_types tt WHERE id = test_type_id
    );

    -- Test get_available_transcript_types
    RAISE NOTICE E'\nAvailable transcript types:';
    RAISE NOTICE '%', (
        SELECT json_agg(t)
        FROM get_available_transcript_types(admin_user_id) t
    );

    -- Test Utility Functions
    RAISE NOTICE E'\n=== Testing Utility Functions ===';
    
    -- Test is_admin
    RAISE NOTICE 'Is admin user admin? %', (SELECT is_admin(admin_user_id));
    RAISE NOTICE 'Is normal user admin? %', (SELECT is_admin(normal_user_id));

    -- Test soft delete functions
    PERFORM soft_delete_transcript(test_transcript_id);
    PERFORM soft_delete_transcript_type(test_type_id);

    RAISE NOTICE E'\nAfter soft deletes:';
    RAISE NOTICE 'Transcript (should have deleted_at): %', (
        SELECT row_to_json(t) FROM transcripts t WHERE id = test_transcript_id
    );
    RAISE NOTICE 'Transcript type (should have deleted_at): %', (
        SELECT row_to_json(tt) FROM transcript_types tt WHERE id = test_type_id
    );

    -- Cleanup
    DELETE FROM auth.users WHERE id IN (admin_user_id, normal_user_id);
    RAISE NOTICE E'\nTest data cleaned up';
END $$; 