-- Export current schema
SELECT 
    'CREATE TABLE IF NOT EXISTS ' || tablename || ' (' ||
    string_agg(
        column_name || ' ' ||  type || 
        CASE WHEN character_maximum_length IS NOT NULL 
            THEN '(' || character_maximum_length || ')'
            ELSE '' END ||
        CASE WHEN is_nullable = 'NO' 
            THEN ' NOT NULL'
            ELSE '' END ||
        CASE WHEN column_default IS NOT NULL 
            THEN ' DEFAULT ' || column_default
            ELSE '' END,
        ', '
    ) || ');'
FROM (
    SELECT 
        c.table_schema,
        c.table_name AS tablename,
        c.column_name,
        c.is_nullable,
        c.column_default,
        c.character_maximum_length,
        CASE 
            WHEN c.udt_name = 'uuid' THEN 'UUID'
            WHEN c.udt_name = 'int4' THEN 'INTEGER'
            WHEN c.udt_name = 'text' THEN 'TEXT'
            WHEN c.udt_name = 'varchar' THEN 'VARCHAR'
            WHEN c.udt_name = 'bool' THEN 'BOOLEAN'
            WHEN c.udt_name = 'jsonb' THEN 'JSONB'
            WHEN c.udt_name = 'timestamptz' THEN 'TIMESTAMPTZ'
            ELSE c.udt_name
        END as type
    FROM information_schema.columns c
    WHERE table_schema = 'public'
    ORDER BY c.ordinal_position
) t
GROUP BY tablename;

-- Export foreign keys
SELECT 
    'ALTER TABLE ' || tc.table_schema || '.' || tc.table_name || 
    ' ADD CONSTRAINT ' || tc.constraint_name || 
    ' FOREIGN KEY (' || kcu.column_name || 
    ') REFERENCES ' || ccu.table_schema || '.' || ccu.table_name || 
    ' (' || ccu.column_name || ');'
FROM information_schema.table_constraints tc
JOIN information_schema.key_column_usage kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_schema = 'public';

-- Export indexes
SELECT 
    'CREATE INDEX IF NOT EXISTS ' || indexname || 
    ' ON ' || tablename || ' USING ' || indexdef || ';'
FROM pg_indexes
WHERE schemaname = 'public';

-- Export RLS policies
SELECT 
    'CREATE POLICY ' || quote_ident(policyname) ||
    ' ON ' || quote_ident(schemaname) || '.' || quote_ident(tablename) ||
    ' AS ' || permissive || 
    ' FOR ' || cmd || 
    ' TO ' || roles::text ||
    ' USING (' || qual || ')' ||
    CASE WHEN with_check IS NOT NULL 
        THEN ' WITH CHECK (' || with_check || ')'
        ELSE '' END || ';'
FROM pg_policies
WHERE schemaname = 'public'; 