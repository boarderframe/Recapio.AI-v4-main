DO $$
DECLARE
    user_id uuid;
BEGIN
    -- Create extension if not exists
    CREATE EXTENSION IF NOT EXISTS pgcrypto;

    -- Generate UUID for the user
    SELECT gen_random_uuid() INTO user_id;

    -- Create user in auth.users
    INSERT INTO auth.users (
        id,
        instance_id,
        email,
        encrypted_password,
        email_confirmed_at,
        raw_app_meta_data,
        raw_user_meta_data,
        created_at,
        updated_at,
        aud,
        role
    ) VALUES (
        user_id,
        '00000000-0000-0000-0000-000000000000',
        'cosburn@yahoo.com',
        crypt('changeme123', gen_salt('bf', 10)), -- Using higher cost factor
        now(),
        '{"provider": "email", "providers": ["email"]}',
        jsonb_build_object(
            'first_name', 'Carl',
            'last_name', 'Osburn'
        ),
        now(),
        now(),
        'authenticated',
        'authenticated'
    );

    -- Create corresponding public user
    INSERT INTO public.users (id, email, roles)
    VALUES (user_id, 'cosburn@yahoo.com', ARRAY['admin']::text[]);

    RAISE NOTICE 'Created admin user:';
    RAISE NOTICE 'Email: cosburn@yahoo.com';
    RAISE NOTICE 'Password: changeme123';
    RAISE NOTICE 'User ID: %', user_id;
END $$; 