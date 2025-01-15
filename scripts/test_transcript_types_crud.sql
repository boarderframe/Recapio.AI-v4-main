-- Test suite for transcript_types RLS policies and CRUD operations
SET client_min_messages TO NOTICE;

-- Enable RLS
ALTER TABLE transcript_types FORCE ROW LEVEL SECURITY;

-- Create function to set auth context
CREATE OR REPLACE FUNCTION set_auth_context(user_id uuid)
RETURNS void AS $$
BEGIN
    PERFORM set_config('request.jwt.claim.sub', user_id::text, true);
    PERFORM set_config('request.jwt.claims', json_build_object('sub', user_id::text)::text, true);
END;
$$ LANGUAGE plpgsql;

-- 1. Create test users with different roles
DO $$
DECLARE
    admin_user_id UUID;
    regular_user_id UUID;
    another_user_id UUID;
    admin_email TEXT := 'admin@test.com';
    regular_email TEXT := 'user@test.com';
    another_email TEXT := 'another@test.com';
BEGIN
    -- Create test users in auth.users
    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES 
        (gen_random_uuid(), admin_email, '{"role": "admin"}'::jsonb)
    RETURNING id INTO admin_user_id;

    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES 
        (gen_random_uuid(), regular_email, '{"role": "user"}'::jsonb)
    RETURNING id INTO regular_user_id;

    INSERT INTO auth.users (id, email, raw_user_meta_data)
    VALUES 
        (gen_random_uuid(), another_email, '{"role": "user"}'::jsonb)
    RETURNING id INTO another_user_id;

    -- Add users to the users table with roles
    INSERT INTO users (id, email, roles)
    VALUES 
        (admin_user_id, admin_email, ARRAY['admin']),
        (regular_user_id, regular_email, ARRAY['user']),
        (another_user_id, another_email, ARRAY['user']);

    RAISE NOTICE 'Created test users - Admin: %, Regular: %, Another: %', 
        admin_user_id, regular_user_id, another_user_id;

    -- 2. Test as admin user
    PERFORM set_auth_context(admin_user_id);
    SET ROLE authenticated;
    
    RAISE NOTICE E'\n=== Testing as Admin User ===';
    
    -- Insert test transcript types
    INSERT INTO transcript_types 
        (tenant_id, category, type, sub_type, analysis_instructions)
    VALUES 
        (regular_user_id, 'Test', 'Category1', 'SubType1', 'Test instructions 1'),
        (another_user_id, 'Test', 'Category2', 'SubType2', 'Test instructions 2'),
        ('00000000-0000-0000-0000-000000000000', 'Global', 'Category', 'SubType', 'Global instructions');

    RAISE NOTICE 'Admin inserted test data';
    
    -- View all transcript types (should see everything)
    RAISE NOTICE 'Admin viewing all transcript types:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(t))
        FROM transcript_types t
    );

    -- 3. Test as regular user
    PERFORM set_auth_context(regular_user_id);
    
    RAISE NOTICE E'\n=== Testing as Regular User ===';
    
    -- Try to view transcript types (should only see own and global)
    RAISE NOTICE 'Regular user viewing transcript types:';
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(t))
        FROM transcript_types t
    );

    -- Try to insert own transcript type (should work)
    INSERT INTO transcript_types 
        (tenant_id, category, type, sub_type, analysis_instructions)
    VALUES 
        (regular_user_id, 'UserTest', 'UserCategory', 'UserSubType', 'User instructions');

    -- Try to modify another user's transcript type (should fail)
    BEGIN
        UPDATE transcript_types 
        SET analysis_instructions = 'Hacked instructions'
        WHERE tenant_id = another_user_id;
        RAISE NOTICE 'WARNING: Regular user was able to modify another user''s transcript type!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'Expected behavior: Regular user cannot modify another user''s transcript type';
    END;

    -- Try to delete another user's transcript type (should fail)
    BEGIN
        DELETE FROM transcript_types 
        WHERE tenant_id = another_user_id;
        RAISE NOTICE 'WARNING: Regular user was able to delete another user''s transcript type!';
    EXCEPTION WHEN insufficient_privilege THEN
        RAISE NOTICE 'Expected behavior: Regular user cannot delete another user''s transcript type';
    END;

    -- 4. Verify final state
    RAISE NOTICE E'\n=== Final State ===';
    RAISE NOTICE 'All transcript types:';
    -- Switch back to admin to see everything
    PERFORM set_auth_context(admin_user_id);
    
    RAISE NOTICE '%', (
        SELECT json_agg(row_to_json(t))
        FROM transcript_types t
    );

    -- 5. Cleanup
    -- First clean up transcript types
    DELETE FROM transcript_types 
    WHERE tenant_id IN (regular_user_id, another_user_id) 
       OR category = 'Global';

    -- Switch to postgres role for user cleanup
    SET ROLE postgres;
    
    -- Clean up users
    DELETE FROM users 
    WHERE id IN (admin_user_id, regular_user_id, another_user_id);
    DELETE FROM auth.users 
    WHERE id IN (admin_user_id, regular_user_id, another_user_id);

    RAISE NOTICE E'\nTest data cleaned up';
END $$;

-- Drop the helper function
DROP FUNCTION IF EXISTS set_auth_context;

-- Reset role
RESET ROLE; 