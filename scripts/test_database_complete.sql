-- Comprehensive test suite for Recapio.AI database
SET client_min_messages TO NOTICE;

-- Setup test data
DO $$
DECLARE
    admin_user_id UUID;
    normal_user_id UUID;
    jwt_claim_admin TEXT;
    jwt_claim_normal TEXT;
    test_transcript_id UUID;
BEGIN
    -- Create test users
    INSERT INTO auth.users (id, email) VALUES (gen_random_uuid(), 'admin@recapio.ai') RETURNING id INTO admin_user_id;
    INSERT INTO auth.users (id, email) VALUES (gen_random_uuid(), 'user@recapio.ai') RETURNING id INTO normal_user_id;

    -- Create corresponding public.users entries
    INSERT INTO public.users (id, email, roles) VALUES (admin_user_id, 'admin@recapio.ai', ARRAY['admin']);
    INSERT INTO public.users (id, email, roles) VALUES (normal_user_id, 'user@recapio.ai', ARRAY['user']);

    RAISE NOTICE 'Test users created - Admin: %, Normal: %', admin_user_id, normal_user_id;

    -- Format JWT claims
    jwt_claim_admin := format('{"sub": "%s"}', admin_user_id);
    jwt_claim_normal := format('{"sub": "%s"}', normal_user_id);

    RAISE NOTICE '
=== Testing User Management Functions ===';
    
    RAISE NOTICE 'Testing get_user_by_email:';
    -- Test get_user_by_email for admin
    SET SESSION "request.jwt.claims" = jwt_claim_admin;
    RAISE NOTICE 'Admin user: %', get_user_by_email('admin@recapio.ai');

    -- Test get_user_by_email for normal user
    SET SESSION "request.jwt.claims" = jwt_claim_normal;
    RAISE NOTICE 'Normal user: %', get_user_by_email('user@recapio.ai');

    RAISE NOTICE '
Testing update_user_roles:';
    -- Test update_user_roles
    SET SESSION "request.jwt.claims" = jwt_claim_admin;
    RAISE NOTICE 'Updated user roles: %', update_user_roles(normal_user_id, ARRAY['user', 'tester']);

    RAISE NOTICE '
=== Testing Transcript Management Functions ===';
    -- Test create_transcript
    SET SESSION "request.jwt.claims" = jwt_claim_admin;
    SELECT create_transcript(
        admin_user_id,
        'Test Transcript',
        'business',
        'en',
        'text'::source_type,
        'meeting',
        'corporate',
        'This is a test transcript summary',
        '{"test": true}'::jsonb,
        admin_user_id
    ) INTO test_transcript_id;

    RAISE NOTICE 'Created transcript ID: %', test_transcript_id;

    -- Test get_user_transcripts
    RAISE NOTICE 'Admin user transcripts: %', get_user_transcripts(admin_user_id);

    -- Test RLS policies
    RAISE NOTICE '
=== Testing RLS Policies ===';
    
    -- Test admin access to all transcripts
    SET SESSION "request.jwt.claims" = jwt_claim_admin;
    RAISE NOTICE 'Admin can see all transcripts: %', (SELECT COUNT(*) FROM transcripts);

    -- Test normal user access to own transcripts
    SET SESSION "request.jwt.claims" = jwt_claim_normal;
    RAISE NOTICE 'Normal user can see own transcripts: %', (SELECT COUNT(*) FROM transcripts WHERE tenant_id = normal_user_id);

    -- Create additional test transcripts
    SELECT create_transcript(
        normal_user_id,
        'User Test Transcript 1',
        'legal',
        'en',
        'text'::source_type,
        'meeting',
        'corporate',
        'This is a test transcript summary for user',
        '{"test": true, "user": true}'::jsonb,
        normal_user_id
    ) INTO test_transcript_id;

    SELECT create_transcript(
        admin_user_id,
        'Admin Test Transcript 2',
        'medical',
        'es',
        'document'::source_type,
        'consultation',
        'healthcare',
        'This is another test transcript summary',
        '{"test": true, "admin": true}'::jsonb,
        admin_user_id
    ) INTO test_transcript_id;

    -- Cleanup test data (commented out to keep data for viewing)
    /*
    DELETE FROM public.users WHERE id IN (admin_user_id, normal_user_id);
    DELETE FROM auth.users WHERE id IN (admin_user_id, normal_user_id);
    DELETE FROM transcripts WHERE tenant_id IN (admin_user_id, normal_user_id);
    */

    RAISE NOTICE 'Test completed - Data preserved for viewing in Supabase Studio.';
END $$; 