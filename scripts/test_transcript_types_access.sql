-- 1. Check current user and role
SELECT 
    auth.uid() as current_user_id,
    raw_user_meta_data ->> 'role' as user_role
FROM auth.users 
WHERE id = auth.uid();

-- 2. Test Read Access
-- Should work for both admin and regular users
SELECT * FROM transcript_types 
WHERE tenant_id = auth.uid()
   OR tenant_id = '00000000-0000-0000-0000-000000000000'::uuid;

-- 3. Test Admin Write Access
-- These operations should only work for admin users
DO $$
BEGIN
    -- Insert test
    INSERT INTO transcript_types (tenant_id, name, description)
    VALUES (auth.uid(), 'Test Type', 'Test Description');

    -- Update test
    UPDATE transcript_types 
    SET description = 'Updated Description'
    WHERE name = 'Test Type' AND tenant_id = auth.uid();

    -- Delete test
    DELETE FROM transcript_types 
    WHERE name = 'Test Type' AND tenant_id = auth.uid();

    RAISE NOTICE 'All admin operations successful';
EXCEPTION
    WHEN insufficient_privilege THEN
        RAISE NOTICE 'Access denied: User does not have admin privileges';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error: %', SQLERRM;
END;
$$;

-- 4. Verify Policies
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'transcript_types'
ORDER BY policyname; 