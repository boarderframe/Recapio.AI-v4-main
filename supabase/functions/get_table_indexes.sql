CREATE OR REPLACE FUNCTION get_table_indexes(table_name text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    WITH index_info AS (
        SELECT
            i.relname as index_name,
            array_agg(a.attname ORDER BY k.i) as column_names,
            ix.indisunique as is_unique,
            ix.indisprimary as is_primary,
            am.amname as index_type
        FROM
            pg_class t,
            pg_class i,
            pg_index ix,
            pg_attribute a,
            pg_am am,
            generate_subscripts(ix.indkey, 1) k
        WHERE
            t.oid = ix.indrelid
            AND i.oid = ix.indexrelid
            AND a.attrelid = t.oid
            AND a.attnum = ix.indkey[k.i]
            AND i.relam = am.oid
            AND t.relkind = 'r'
            AND t.relname = table_name
        GROUP BY
            i.relname,
            ix.indisunique,
            ix.indisprimary,
            am.amname
        ORDER BY
            i.relname
    )
    SELECT json_agg(
        json_build_object(
            'name', index_name,
            'columns', column_names,
            'type', index_type,
            'is_unique', is_unique,
            'is_primary', is_primary
        )
    ) INTO result
    FROM index_info;

    RETURN COALESCE(result, '[]'::json);
END;
$$; 