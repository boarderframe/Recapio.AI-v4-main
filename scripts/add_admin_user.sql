DO $$
DECLARE
    user_id UUID;
BEGIN
    -- Create auth user
    INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at)
    VALUES (
        gen_random_uuid(),
        'cosburn@yahoo.com',
        crypt('changeme123', gen_salt('bf')),
        NOW()
    )
    RETURNING id INTO user_id;

    -- Create public user with admin role
    INSERT INTO public.users (id, email, roles)
    VALUES (
        user_id,
        'cosburn@yahoo.com',
        '{admin}'
    );

    -- Output the credentials
    RAISE NOTICE 'Admin user created:';
    RAISE NOTICE 'Email: cosburn@yahoo.com';
    RAISE NOTICE 'Password: changeme123';
    RAISE NOTICE 'User ID: %', user_id;
END $$; 