-- 1. Check current user details
SELECT 
    auth.uid() as current_user_id,
    email,
    raw_user_meta_data,
    raw_user_meta_data ->> 'role' as user_role
FROM auth.users 
WHERE id = auth.uid();

-- 2. Check if current user has admin access
SELECT 
    EXISTS (
        SELECT 1
        FROM auth.users
        WHERE id = auth.uid()
        AND raw_user_meta_data ->> 'role'::text = 'admin'::text
    ) as is_admin,
    auth.uid() as user_id;

-- 3. List accessible transcript types with detailed info
SELECT 
    id,
    tenant_id,
    category,
    type,
    sub_type,
    category_color,
    category_icon,
    schema_version,
    created_at,
    updated_at,
    CASE 
        WHEN tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN 'Global'
        WHEN tenant_id = auth.uid() THEN 'Own'
        ELSE 'Other'
    END as record_type,
    CASE 
        WHEN tenant_id = auth.uid() THEN true
        WHEN tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN true
        ELSE EXISTS (
            SELECT 1
            FROM auth.users
            WHERE id = auth.uid()
            AND raw_user_meta_data ->> 'role'::text = 'admin'::text
        )
    END as can_modify
FROM transcript_types
ORDER BY 
    CASE 
        WHEN tenant_id = '00000000-0000-0000-0000-000000000000'::uuid THEN 1
        WHEN tenant_id = auth.uid() THEN 2
        ELSE 3
    END,
    category, 
    type, 
    sub_type; 