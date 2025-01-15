-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.users (
    id uuid NOT NULL PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email text NOT NULL UNIQUE,
    roles text[] DEFAULT '{}'::text[],
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

-- Create admin check function if it doesn't exist
CREATE OR REPLACE FUNCTION auth.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 
    FROM public.users 
    WHERE id = auth.uid() 
    AND 'admin' = ANY(roles)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies for transcript_types
ALTER TABLE public.transcript_types ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admin full access to transcript types" ON public.transcript_types;
CREATE POLICY "Admin full access to transcript types" ON public.transcript_types
AS PERMISSIVE FOR ALL
TO public
USING (
  EXISTS (
    SELECT 1 
    FROM users 
    WHERE users.id = auth.uid() 
    AND 'admin' = ANY(users.roles)
  )
);

-- Update RLS policies for transcripts
ALTER TABLE public.transcripts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can manage own transcripts" ON public.transcripts;
CREATE POLICY "Users can manage own transcripts" ON public.transcripts
AS PERMISSIVE FOR ALL
TO public
USING (
  tenant_id = auth.uid() 
  OR EXISTS (
    SELECT 1 
    FROM users 
    WHERE users.id = auth.uid() 
    AND 'admin' = ANY(users.roles)
  )
);

-- Update RLS policies for users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can view their own data" ON public.users
AS PERMISSIVE FOR SELECT
TO public
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data" ON public.users
AS PERMISSIVE FOR UPDATE
TO public
USING (auth.uid() = id);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Create or update function for transcript statistics
CREATE OR REPLACE FUNCTION public.get_transcript_stats(p_tenant_id uuid)
RETURNS TABLE (
  total_count bigint,
  completed_count bigint,
  processing_count bigint,
  failed_count bigint,
  avg_processing_time numeric
) 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Check if user has access to the tenant
  IF NOT EXISTS (
    SELECT 1 
    FROM users 
    WHERE id = auth.uid() 
    AND (
      id = p_tenant_id 
      OR 'admin' = ANY(roles)
      OR p_tenant_id = '00000000-0000-0000-0000-000000000000'
    )
  ) THEN
    RAISE EXCEPTION 'Access denied to tenant data';
  END IF;

  RETURN QUERY
  SELECT 
    COUNT(*)::BIGINT as total_count,
    COUNT(CASE WHEN status = 'completed' THEN 1 END)::BIGINT as completed_count,
    COUNT(CASE WHEN status = 'processing' THEN 1 END)::BIGINT as processing_count,
    COUNT(CASE WHEN status = 'failed' THEN 1 END)::BIGINT as failed_count,
    AVG(
      CASE 
        WHEN status = 'completed' 
        THEN EXTRACT(EPOCH FROM (updated_at - created_at)) 
      END
    )::NUMERIC as avg_processing_time
  FROM transcripts
  WHERE tenant_id = p_tenant_id
  AND deleted_at IS NULL;
END;
$$;

-- Create trigger for updating timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE PROCEDURE update_updated_at_column();
