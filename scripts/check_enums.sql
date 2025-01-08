-- Check enum types
SELECT 
    t.typname as enum_name,
    array_agg(e.enumlabel) as enum_values
FROM pg_type t
JOIN pg_enum e ON t.oid = e.enumtypid
GROUP BY t.typname; 