-- Function to get all tables in the public schema
CREATE OR REPLACE FUNCTION get_tables()
RETURNS TABLE (table_name text)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT t.table_name::text
    FROM information_schema.tables t
    WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
    AND t.table_name NOT LIKE 'pg_%';
END;
$$;

-- Function to get foreign key relationships for a table
CREATE OR REPLACE FUNCTION get_foreign_keys(table_name text)
RETURNS TABLE (
    column_name text,
    referenced_table_name text,
    referenced_column_name text
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN QUERY
    SELECT
        kcu.column_name::text,
        ccu.table_name::text AS referenced_table_name,
        ccu.column_name::text AS referenced_column_name
    FROM information_schema.key_column_usage kcu
    JOIN information_schema.constraint_column_usage ccu
        ON kcu.constraint_name = ccu.constraint_name
        AND kcu.constraint_schema = ccu.constraint_schema
    WHERE kcu.table_schema = 'public'
        AND kcu.table_name = table_name
        AND ccu.table_name IS NOT NULL;
END;
$$; 