-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own data"
    ON users
    FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users
    FOR UPDATE
    USING (auth.uid() = id);

-- Function to handle new user creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.users (id, email, roles)
    VALUES (new.id, new.email, '{}');
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for new user creation
CREATE OR REPLACE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_new_user();

-- Function to make a user admin
CREATE OR REPLACE FUNCTION public.make_user_admin(user_email TEXT)
RETURNS void AS $$
BEGIN
    UPDATE public.users
    SET roles = array_append(roles, 'admin')
    WHERE email = user_email
    AND NOT 'admin' = ANY(roles);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Enable RLS on all tables
ALTER TABLE transcript_types ENABLE ROW LEVEL SECURITY;

-- Drop any existing policies
DROP POLICY IF EXISTS "Admins can manage transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can view all transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can view transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can insert transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can update transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Admins can delete transcript types" ON transcript_types CASCADE;
DROP POLICY IF EXISTS "Users can view transcript types" ON transcript_types CASCADE;

-- Grant basic permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON transcript_types TO authenticated;
GRANT SELECT ON transcript_types TO anon;

-- Grant sequence permissions
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE transcript_types_id_seq TO authenticated;

-- Create RLS policies for transcript_types table
CREATE POLICY "Admins can view all transcript types"
ON transcript_types FOR SELECT
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
);

CREATE POLICY "Admins can insert transcript types"
ON transcript_types FOR INSERT
TO authenticated
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
);

CREATE POLICY "Admins can update transcript types"
ON transcript_types FOR UPDATE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
)
WITH CHECK (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
);

CREATE POLICY "Admins can delete transcript types"
ON transcript_types FOR DELETE
TO authenticated
USING (
    (auth.jwt() -> 'app_metadata' ->> 'role') = 'admin'
    AND (
        tenant_id = '00000000-0000-0000-0000-000000000000' OR
        tenant_id = auth.uid()
    )
);

CREATE POLICY "Users can view transcript types"
ON transcript_types FOR SELECT
TO authenticated
USING (
    tenant_id = auth.uid() OR
    tenant_id = '00000000-0000-0000-0000-000000000000'
); 