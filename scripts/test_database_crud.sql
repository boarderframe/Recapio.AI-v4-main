-- Test CRUD operations for Recapio.AI database

-- Test Users Table Operations
DO $$
DECLARE
    test_user_id uuid;
    test_email text := 'test@recapio.ai';
BEGIN
    -- Test INSERT
    INSERT INTO auth.users (id, email)
    VALUES (gen_random_uuid(), test_email)
    RETURNING id INTO test_user_id;

    RAISE NOTICE 'Created test user with ID: %', test_user_id;

    -- Test SELECT
    RAISE NOTICE 'User data: %', (SELECT row_to_json(u) FROM users u WHERE id = test_user_id);

    -- Test UPDATE
    UPDATE users 
    SET roles = array_append(roles, 'tester')
    WHERE id = test_user_id;

    RAISE NOTICE 'Updated user data: %', (SELECT row_to_json(u) FROM users u WHERE id = test_user_id);

    -- Test DELETE
    DELETE FROM auth.users WHERE id = test_user_id;
    RAISE NOTICE 'Deleted test user';
END $$;

-- Test Transcript Types Table Operations
DO $$
DECLARE
    test_type_id integer;
    test_tenant_id uuid;
BEGIN
    -- Get a valid tenant ID (admin user)
    SELECT id INTO test_tenant_id FROM users WHERE 'admin' = ANY(roles) LIMIT 1;
    
    -- Test INSERT
    INSERT INTO transcript_types (tenant_id, name, description)
    VALUES (test_tenant_id, 'Test Type', 'Test Description')
    RETURNING id INTO test_type_id;

    RAISE NOTICE 'Created test transcript type with ID: %', test_type_id;

    -- Test SELECT
    RAISE NOTICE 'Transcript type data: %', (
        SELECT row_to_json(tt) 
        FROM transcript_types tt 
        WHERE id = test_type_id
    );

    -- Test UPDATE
    UPDATE transcript_types 
    SET description = 'Updated Description',
        settings = jsonb_build_object('test_setting', true)
    WHERE id = test_type_id;

    RAISE NOTICE 'Updated transcript type data: %', (
        SELECT row_to_json(tt) 
        FROM transcript_types tt 
        WHERE id = test_type_id
    );

    -- Test DELETE
    DELETE FROM transcript_types WHERE id = test_type_id;
    RAISE NOTICE 'Deleted test transcript type';
END $$;

-- Test Transcripts Table Operations
DO $$
DECLARE
    test_transcript_id uuid;
    test_tenant_id uuid;
BEGIN
    -- Get a valid tenant ID (admin user)
    SELECT id INTO test_tenant_id FROM users WHERE 'admin' = ANY(roles) LIMIT 1;
    
    -- Test INSERT
    INSERT INTO transcripts (tenant_id, title, content)
    VALUES (test_tenant_id, 'Test Transcript', 'Test Content')
    RETURNING id INTO test_transcript_id;

    RAISE NOTICE 'Created test transcript with ID: %', test_transcript_id;

    -- Test SELECT
    RAISE NOTICE 'Transcript data: %', (
        SELECT row_to_json(t) 
        FROM transcripts t 
        WHERE id = test_transcript_id
    );

    -- Test UPDATE
    UPDATE transcripts 
    SET content = 'Updated Content',
        metadata = jsonb_build_object('test_meta', true)
    WHERE id = test_transcript_id;

    RAISE NOTICE 'Updated transcript data: %', (
        SELECT row_to_json(t) 
        FROM transcripts t 
        WHERE id = test_transcript_id
    );

    -- Test DELETE
    DELETE FROM transcripts WHERE id = test_transcript_id;
    RAISE NOTICE 'Deleted test transcript';
END $$; 