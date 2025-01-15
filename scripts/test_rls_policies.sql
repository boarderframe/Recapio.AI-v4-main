-- Test suite for RLS policies
SET client_min_messages TO NOTICE;

-- Setup test data
DO $$
DECLARE
    admin_user_id UUID;
    user1_id UUID;
    user2_id UUID;
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
        (gen_random_uuid(), 'user1@recapio.ai')
    RETURNING id INTO user1_id;

    INSERT INTO auth.users (id, email)
    VALUES 
        (gen_random_uuid(), 'user2@recapio.ai')
    RETURNING id INTO user2_id;

    -- Make admin user
    UPDATE users 
    SET roles = array_append(roles, 'admin')
    WHERE id = admin_user_id;

    RAISE NOTICE 'Test users created - Admin: %, User1: %, User2: %', 
        admin_user_id, user1_id, user2_id;

    -- Test RLS for Users Table
    RAISE NOTICE E'\n=== Testing Users Table RLS ===';
    
    -- Test as admin
    SET ROLE authenticated;
    SET LOCAL "request.jwt.claims" = json_build_object('sub', admin_user_id);
    
    RAISE NOTICE 'Admin can see all users:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(u))
        FROM users u
    );

    -- Test as normal user
    SET LOCAL "request.jwt.claims" = json_build_object('sub', user1_id);
    
    RAISE NOTICE E'\nNormal user can only see their own data:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(u))
        FROM users u
    );

    -- Test RLS for Transcripts
    RAISE NOTICE E'\n=== Testing Transcripts Table RLS ===';
    
    -- Create test transcripts
    INSERT INTO transcripts (tenant_id, title, status)
    VALUES 
        (user1_id, 'User1 Transcript', 'pending'),
        (user2_id, 'User2 Transcript', 'pending')
    RETURNING id INTO test_transcript_id;

    -- Test as admin
    SET LOCAL "request.jwt.claims" = json_build_object('sub', admin_user_id);
    
    RAISE NOTICE 'Admin can see all transcripts:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(t))
        FROM transcripts t
    );

    -- Test as user1
    SET LOCAL "request.jwt.claims" = json_build_object('sub', user1_id);
    
    RAISE NOTICE E'\nUser1 can only see their transcripts:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(t))
        FROM transcripts t
    );

    -- Test RLS for Transcript Types
    RAISE NOTICE E'\n=== Testing Transcript Types Table RLS ===';
    
    -- Create test transcript types
    INSERT INTO transcript_types (tenant_id, name, description)
    VALUES 
        (user1_id, 'User1 Type', 'Description 1'),
        ('00000000-0000-0000-0000-000000000000', 'Global Type', 'Global Description')
    RETURNING id INTO test_type_id;

    -- Test as admin
    SET LOCAL "request.jwt.claims" = json_build_object('sub', admin_user_id);
    
    RAISE NOTICE 'Admin can see all transcript types:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(tt))
        FROM transcript_types tt
    );

    -- Test as user2
    SET LOCAL "request.jwt.claims" = json_build_object('sub', user2_id);
    
    RAISE NOTICE E'\nUser2 can see global types and their own:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(tt))
        FROM transcript_types tt
    );

    -- Test Insert/Update/Delete Permissions
    RAISE NOTICE E'\n=== Testing Write Permissions ===';
    
    -- Test as normal user
    SET LOCAL "request.jwt.claims" = json_build_object('sub', user1_id);
    
    -- Try to update another user's transcript
    UPDATE transcripts 
    SET title = 'Hacked Title'
    WHERE tenant_id = user2_id;
    
    RAISE NOTICE 'After attempted unauthorized update:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(t))
        FROM transcripts t
        WHERE tenant_id = user2_id
    );

    -- Try to delete another user's transcript type
    DELETE FROM transcript_types 
    WHERE tenant_id = user2_id;
    
    RAISE NOTICE E'\nAfter attempted unauthorized delete:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(tt))
        FROM transcript_types tt
        WHERE tenant_id = user2_id
    );

    -- Cleanup
    RESET ROLE;
    DELETE FROM auth.users WHERE id IN (admin_user_id, user1_id, user2_id);
    RAISE NOTICE E'\nTest data cleaned up';
END $$; 