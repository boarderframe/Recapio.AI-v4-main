-- Function to generate schema documentation
WITH RECURSIVE
-- Get all tables
tables AS (
  SELECT 
    t.table_name as name,
    obj_description(pgc.oid, 'pg_class') as description
  FROM information_schema.tables t
  JOIN pg_class pgc ON t.table_name = pgc.relname
  WHERE t.table_schema = 'public'
    AND t.table_type = 'BASE TABLE'
),

-- Get all columns for each table
columns AS (
  SELECT 
    c.table_name,
    jsonb_agg(jsonb_build_object(
      'name', c.column_name,
      'type', c.data_type,
      'length', c.character_maximum_length,
      'precision', c.numeric_precision,
      'scale', c.numeric_scale,
      'nullable', CASE WHEN c.is_nullable = 'YES' THEN true ELSE false END,
      'default', c.column_default,
      'is_identity', c.is_identity,
      'isPrimaryKey', CASE WHEN pk.constraint_name IS NOT NULL THEN true ELSE false END,
      'description', col_description(pgc.oid, c.ordinal_position),
      'position', c.ordinal_position,
      'check_constraints', array_agg(chk.check_clause) FILTER (WHERE chk.check_clause IS NOT NULL)
    ) ORDER BY c.ordinal_position) as columns
  FROM information_schema.columns c
  LEFT JOIN information_schema.key_column_usage kcu 
    ON c.table_name = kcu.table_name 
    AND c.column_name = kcu.column_name
  LEFT JOIN information_schema.table_constraints pk 
    ON kcu.constraint_name = pk.constraint_name 
    AND pk.constraint_type = 'PRIMARY KEY'
  LEFT JOIN information_schema.check_constraints chk 
    ON c.table_name = chk.table_name 
    AND c.column_name = chk.column_name
  JOIN pg_class pgc ON c.table_name = pgc.relname
  WHERE c.table_schema = 'public'
  GROUP BY c.table_name, pgc.oid
),

-- Get all relationships (foreign keys and primary keys)
relationships AS (
  SELECT 
    tc.table_name,
    jsonb_agg(jsonb_build_object(
      'type', tc.constraint_type,
      'sourceColumn', kcu.column_name,
      'targetTable', ccu.table_name,
      'targetColumn', ccu.column_name,
      'onDelete', rc.delete_rule,
      'onUpdate', rc.update_rule,
      'deferrable', tc.is_deferrable = 'YES',
      'deferred', tc.initially_deferred = 'YES'
    )) as relationships
  FROM information_schema.table_constraints tc
  JOIN information_schema.key_column_usage kcu 
    ON tc.constraint_name = kcu.constraint_name
  JOIN information_schema.constraint_column_usage ccu 
    ON tc.constraint_name = ccu.constraint_name
  JOIN information_schema.referential_constraints rc 
    ON tc.constraint_name = rc.constraint_name
  WHERE tc.table_schema = 'public'
    AND tc.constraint_type IN ('FOREIGN KEY', 'PRIMARY KEY')
  GROUP BY tc.table_name
),

-- Get all indexes
indexes AS (
  SELECT 
    tablename,
    jsonb_agg(jsonb_build_object(
      'name', indexname,
      'definition', indexdef
    )) as indexes
  FROM pg_indexes
  WHERE schemaname = 'public'
  GROUP BY tablename
),

-- Get all triggers
triggers AS (
  SELECT 
    event_object_table as table_name,
    jsonb_agg(jsonb_build_object(
      'name', trigger_name,
      'timing', action_timing,
      'event', event_manipulation,
      'definition', action_statement
    )) as triggers
  FROM information_schema.triggers
  WHERE trigger_schema = 'public'
  GROUP BY event_object_table
),

-- Get all security policies (RLS)
policies AS (
  SELECT 
    tablename as table_name,
    jsonb_agg(jsonb_build_object(
      'name', policyname,
      'roles', roles,
      'cmd', cmd,
      'qual', qual,
      'with_check', with_check
    )) as policies
  FROM pg_policies
  WHERE schemaname = 'public'
  GROUP BY tablename
),

-- Combine all information into a single JSON structure
schema_json AS (
  SELECT jsonb_build_object(
    'lastUpdated', CURRENT_TIMESTAMP,
    'tables', (
      SELECT jsonb_object_agg(
        t.name,
        jsonb_build_object(
          'name', t.name,
          'description', t.description,
          'columns', c.columns,
          'relationships', COALESCE(r.relationships, '[]'::jsonb),
          'indexes', COALESCE(i.indexes, '[]'::jsonb),
          'triggers', COALESCE(tr.triggers, '[]'::jsonb),
          'security_policies', COALESCE(p.policies, '[]'::jsonb)
        )
      )
      FROM tables t
      LEFT JOIN columns c ON t.name = c.table_name
      LEFT JOIN relationships r ON t.name = r.table_name
      LEFT JOIN indexes i ON t.name = i.tablename
      LEFT JOIN triggers tr ON t.name = tr.table_name
      LEFT JOIN policies p ON t.name = p.table_name
    )
  ) as schema
)

-- Output both JSON and Markdown versions
SELECT 
  schema as json_output,
  -- Generate markdown documentation
  '# Database Schema Documentation

This document is automatically generated. Do not edit manually.

Last Updated: ' || to_char(CURRENT_TIMESTAMP, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') || '

## Overview

Total Tables: ' || (SELECT count(*) FROM tables) || '
Total Relationships: ' || (
  SELECT count(*)
  FROM (
    SELECT jsonb_array_elements(relationships)
    FROM relationships
  ) r
) || '

## Tables

### Table of Contents

' || string_agg('- [' || name || '](#' || lower(name) || ')', E'\n' ORDER BY name) || '

' || string_agg(
  '### ' || name || '

' || COALESCE(description, '') || '

#### Columns

| Name | Type | Length/Precision | Scale | Nullable | Default | Identity | Primary Key | Description |
|------|------|-----------------|--------|----------|----------|-----------|-------------|-------------|
' || string_agg(
  '| ' || col->>'name' || 
  ' | ' || col->>'type' || 
  ' | ' || COALESCE(col->>'length', '') || 
  ' | ' || COALESCE(col->>'scale', '') || 
  ' | ' || CASE WHEN (col->>'nullable')::boolean THEN 'YES' ELSE 'NO' END || 
  ' | ' || COALESCE(col->>'default', '') || 
  ' | ' || COALESCE(col->>'is_identity', '') || 
  ' | ' || CASE WHEN (col->>'isPrimaryKey')::boolean THEN '✓' ELSE '' END || 
  ' | ' || COALESCE(col->>'description', '-') || ' |',
  E'\n'
  ORDER BY (col->>'position')::int
) || '

#### Relationships

| Type | Column | References | On Delete | On Update | Deferrable |
|------|---------|------------|------------|------------|------------|
' || COALESCE(
  string_agg(
    '| ' || rel->>'type' || 
    ' | ' || rel->>'sourceColumn' || 
    ' | ' || rel->>'targetTable' || '(' || rel->>'targetColumn' || ')' || 
    ' | ' || rel->>'onDelete' || 
    ' | ' || rel->>'onUpdate' || 
    ' | ' || CASE WHEN (rel->>'deferrable')::boolean THEN 'YES' ELSE 'NO' END || ' |',
    E'\n'
  ),
  '| - | - | - | - | - | - |'
) || '

---

',
  E'\n'
  ORDER BY name
) || '
## All Relationships

### Primary Keys

' || string_agg(
  '- `' || r.rel->>'targetTable' || '`: Primary key on column `' || r.rel->>'targetColumn' || '`',
  E'\n'
  ORDER BY r.rel->>'targetTable'
)
FROM (
  SELECT jsonb_array_elements(relationships) as rel
  FROM relationships
  WHERE relationships @> '[{"type": "PRIMARY KEY"}]'
) r || '

### Foreign Keys

' || string_agg(
  '- `' || r.rel->>'sourceTable' || '.' || r.rel->>'sourceColumn' || '` → `' || r.rel->>'targetTable' || '.' || r.rel->>'targetColumn' || '`',
  E'\n'
  ORDER BY r.rel->>'sourceTable'
)
FROM (
  SELECT 
    rel->>'sourceColumn' as sourceColumn,
    tables.name as sourceTable,
    jsonb_array_elements(relationships) as rel
  FROM relationships
  JOIN tables ON tables.name = relationships.table_name
  WHERE relationships @> '[{"type": "FOREIGN KEY"}]'
) r as markdown_output
FROM schema_json; 