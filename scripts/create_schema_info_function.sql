CREATE OR REPLACE FUNCTION get_schema_info()
RETURNS TABLE (
    table_name text,
    column_name text,
    data_type text,
    is_nullable boolean,
    column_default text,
    is_primary_key boolean,
    is_foreign_key boolean,
    foreign_table text,
    foreign_column text,
    description text
) LANGUAGE plpgsql AS $$
BEGIN
    RETURN QUERY
    WITH pk_info AS (
        SELECT 
            tc.table_name::text,
            kcu.column_name::text
        FROM information_schema.table_constraints tc
        JOIN information_schema.key_column_usage kcu 
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        WHERE tc.constraint_type = 'PRIMARY KEY'
        AND tc.table_schema = 'public'
    ),
    fk_info AS (
        SELECT 
            kcu.table_name::text,
            kcu.column_name::text,
            ccu.table_name::text AS foreign_table_name,
            ccu.column_name::text AS foreign_column_name
        FROM information_schema.table_constraints AS tc 
        JOIN information_schema.key_column_usage AS kcu
            ON tc.constraint_name = kcu.constraint_name
            AND tc.table_schema = kcu.table_schema
        JOIN information_schema.constraint_column_usage AS ccu
            ON ccu.constraint_name = tc.constraint_name
            AND ccu.table_schema = tc.table_schema
        WHERE tc.constraint_type = 'FOREIGN KEY'
        AND tc.table_schema = 'public'
    )
    SELECT 
        c.table_name::text,
        c.column_name::text,
        c.data_type::text,
        c.is_nullable::boolean,
        c.column_default::text,
        (pk.column_name IS NOT NULL) as is_primary_key,
        (fk.column_name IS NOT NULL) as is_foreign_key,
        fk.foreign_table_name,
        fk.foreign_column_name,
        pgd.description
    FROM information_schema.columns c
    LEFT JOIN pk_info pk 
        ON c.table_name::text = pk.table_name 
        AND c.column_name::text = pk.column_name
    LEFT JOIN fk_info fk 
        ON c.table_name::text = fk.table_name 
        AND c.column_name::text = fk.column_name
    LEFT JOIN pg_catalog.pg_statio_all_tables st 
        ON c.table_name::text = st.relname
    LEFT JOIN pg_catalog.pg_description pgd
        ON pgd.objoid = st.relid
        AND pgd.objsubid = c.ordinal_position
    WHERE c.table_schema = 'public'
    AND c.table_name::text IN (
        'transcripts',
        'transcript_contents',
        'transcript_processing',
        'transcript_outputs',
        'transcript_output_requests',
        'transcript_types'
    )
    ORDER BY c.table_name, c.ordinal_position;
END;
$$; 