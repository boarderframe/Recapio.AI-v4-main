-- Function to get list of tables in a schema
CREATE OR REPLACE FUNCTION get_tables(schema_name text)
RETURNS text[] AS $$
BEGIN
    RETURN ARRAY(
        SELECT table_name::text
        FROM information_schema.tables
        WHERE table_schema = schema_name
        AND table_type = 'BASE TABLE'
        ORDER BY table_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get column information for a table
CREATE OR REPLACE FUNCTION get_column_info(table_name text)
RETURNS TABLE (
    column_name text,
    data_type text,
    character_maximum_length integer,
    numeric_precision integer,
    numeric_scale integer,
    is_nullable text,
    column_default text,
    is_identity text,
    is_primary_key boolean,
    column_description text,
    ordinal_position integer,
    check_constraints jsonb[]
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        c.column_name,
        c.data_type,
        c.character_maximum_length,
        c.numeric_precision,
        c.numeric_scale,
        c.is_nullable,
        c.column_default,
        c.is_identity,
        CASE WHEN pk.column_name IS NOT NULL THEN true ELSE false END as is_primary_key,
        pd.description as column_description,
        c.ordinal_position,
        ARRAY(
            SELECT jsonb_build_object(
                'name', cc.conname,
                'definition', pg_get_constraintdef(cc.oid)
            )
            FROM pg_constraint cc
            WHERE cc.conrelid = (table_name::regclass)::oid
            AND cc.contype = 'c'
            AND c.attnum = ANY(cc.conkey)
        )::jsonb[] as check_constraints
    FROM information_schema.columns c
    LEFT JOIN (
        SELECT a.attname as column_name
        FROM pg_index i
        JOIN pg_attribute a ON a.attrelid = i.indrelid AND a.attnum = ANY(i.indkey)
        WHERE i.indrelid = table_name::regclass
        AND i.indisprimary
    ) pk ON pk.column_name = c.column_name
    LEFT JOIN pg_description pd ON 
        pd.objoid = table_name::regclass::oid AND 
        pd.objsubid = c.ordinal_position
    WHERE c.table_name = table_name
    AND c.table_schema = 'public'
    ORDER BY c.ordinal_position;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get foreign key relationships for a table
CREATE OR REPLACE FUNCTION get_foreign_keys(table_name text)
RETURNS TABLE (
    source_column text,
    target_table text,
    target_column text,
    on_delete text,
    on_update text,
    is_deferrable boolean,
    is_deferred boolean
) AS $$
BEGIN
    RETURN QUERY
    SELECT
        kcu.column_name as source_column,
        ccu.table_name::text as target_table,
        ccu.column_name as target_column,
        rc.delete_rule as on_delete,
        rc.update_rule as on_update,
        rc.is_deferrable::boolean,
        rc.initially_deferred::boolean
    FROM information_schema.key_column_usage kcu
    JOIN information_schema.referential_constraints rc ON
        kcu.constraint_name = rc.constraint_name AND
        kcu.constraint_schema = rc.constraint_schema
    JOIN information_schema.constraint_column_usage ccu ON
        rc.unique_constraint_name = ccu.constraint_name AND
        rc.unique_constraint_schema = ccu.constraint_schema
    WHERE kcu.table_name = table_name
    AND kcu.table_schema = 'public';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get table description
CREATE OR REPLACE FUNCTION get_table_description(table_name text)
RETURNS TABLE (
    table_description text
) AS $$
BEGIN
    RETURN QUERY
    SELECT pg_description.description
    FROM pg_description
    JOIN pg_class ON pg_class.oid = pg_description.objoid
    WHERE pg_class.relname = table_name
    AND pg_description.objsubid = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 