-- Enable RLS on user_roles table
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy for viewing user roles
CREATE POLICY "Users can view their own roles"
    ON user_roles
    FOR SELECT
    USING (auth.uid() = user_id);

-- Create policy for admin users to view all roles
CREATE POLICY "Admins can view all roles"
    ON user_roles
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Create policy for admin users to modify roles
CREATE POLICY "Admins can modify roles"
    ON user_roles
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM user_roles
            WHERE user_id = auth.uid()
            AND role = 'admin'
        )
    );

-- Function to set a user's role
CREATE OR REPLACE FUNCTION set_user_role(target_user_id UUID, new_role TEXT)
RETURNS VOID AS $$
BEGIN
    -- Check if the executing user is an admin
    IF NOT EXISTS (
        SELECT 1 FROM user_roles
        WHERE user_id = auth.uid()
        AND role = 'admin'
    ) THEN
        RAISE EXCEPTION 'Only administrators can modify roles';
    END IF;

    -- Insert or update the role
    INSERT INTO user_roles (user_id, role)
    VALUES (target_user_id, new_role)
    ON CONFLICT (user_id)
    DO UPDATE SET role = new_role;

    -- Update user_metadata in auth.users
    UPDATE auth.users
    SET raw_user_meta_data = 
        COALESCE(raw_user_meta_data::jsonb, '{}'::jsonb) || 
        jsonb_build_object('role', new_role)
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON user_roles TO authenticated;
GRANT EXECUTE ON FUNCTION set_user_role TO authenticated; 