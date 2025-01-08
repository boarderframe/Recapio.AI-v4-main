CREATE OR REPLACE FUNCTION check_enum_types()
RETURNS TABLE (
    enum_name text,
    enum_values text[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.typname::text as enum_name,
        array_agg(e.enumlabel)::text[] as enum_values
    FROM pg_type t
    JOIN pg_enum e ON t.oid = e.enumtypid
    GROUP BY t.typname;
END;
$$ LANGUAGE plpgsql; 