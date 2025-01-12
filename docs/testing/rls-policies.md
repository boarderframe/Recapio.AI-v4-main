# Row Level Security (RLS) Testing Guide

This document outlines the SQL scripts and procedures for testing Row Level Security (RLS) policies in the Recapio database.

## Overview

The test script verifies:
1. Unauthenticated access (should be denied)
2. Regular user access (should only see own data)
3. Admin user access (should see all data)
4. Complex relationships (output queue through transcript relationships)

## Test Script

```sql
-- Test RLS Policies

-- 1. First, let's test as a superuser (disable RLS temporarily to verify data exists)
SET request.jwt.claim.role = 'service_role';

-- Check if we have any providers
SELECT id, name FROM ai_providers LIMIT 1;

-- If no providers exist, let's create one
INSERT INTO ai_providers (name, description, tenant_id)
VALUES ('OpenAI', 'OpenAI API Provider', '00000000-0000-0000-0000-000000000000')
RETURNING id;

-- Check if data exists in tables
SELECT COUNT(*) as ai_models_count FROM ai_models;
SELECT COUNT(*) as transcripts_count FROM transcripts;
SELECT COUNT(*) as user_roles_count FROM user_roles;

-- 2. Test as an unauthenticated user (should be denied)
SET request.jwt.claim.role = '';
SET request.jwt.claims = '{}';

SELECT COUNT(*) FROM ai_models; -- Should be denied
SELECT COUNT(*) FROM transcripts; -- Should be denied
SELECT COUNT(*) FROM user_roles; -- Should be denied

-- 3. Test as a regular authenticated user (User 1)
SET request.jwt.claim.role = 'authenticated';
SET request.jwt.claim.sub = '123e4567-e89b-12d3-a456-426614174001';

-- Should only see own transcripts
SELECT COUNT(*) FROM transcripts WHERE user_id = current_setting('request.jwt.claim.sub')::uuid;

-- Should be able to view AI models (read-only)
SELECT COUNT(*) FROM ai_models;

-- Should not be able to modify AI models
INSERT INTO ai_models (
    model_name, 
    provider_id, 
    token_limit, 
    cost_per_token,
    capabilities,
    version,
    tenant_id
) 
SELECT 
    'Test Model',
    id,
    4096,
    0.0001,
    '{"text-generation": true}',
    'v1',
    '00000000-0000-0000-0000-000000000000'
FROM ai_providers 
WHERE name = 'OpenAI'
LIMIT 1; -- Should fail

-- 4. Test as User 2
SET request.jwt.claim.role = 'authenticated';
SET request.jwt.claim.sub = '123e4567-e89b-12d3-a456-426614174002';

-- Should only see own transcripts
SELECT COUNT(*) FROM transcripts WHERE user_id = current_setting('request.jwt.claim.sub')::uuid;

-- 5. Test as admin user (Carl Osburn)
SET request.jwt.claim.role = 'authenticated';
SET request.jwt.claim.sub = '37fc99d0-e2de-49f2-876e-b8cfe89574ef';
SET request.jwt.claims = '{"role": "admin", "email": "cosburn@yahoo.com"}';

-- Should see all transcripts
SELECT COUNT(*) FROM transcripts;

-- Should be able to view and modify AI models
SELECT COUNT(*) FROM ai_models;

-- Insert test model with all required fields
INSERT INTO ai_models (
    model_name, 
    provider_id, 
    token_limit, 
    cost_per_token,
    capabilities,
    version,
    tenant_id
) 
SELECT 
    'Test Admin Model',
    id,
    4096,
    0.0001,
    '{"text-generation": true}',
    'v1',
    '00000000-0000-0000-0000-000000000000'
FROM ai_providers 
WHERE name = 'OpenAI'
LIMIT 1
RETURNING id;

-- Clean up test data
DELETE FROM ai_models WHERE model_name = 'Test Admin Model';

-- 6. Test complex relationships
-- Test output_queue access through transcript relationship
SET request.jwt.claim.role = 'authenticated';
SET request.jwt.claim.sub = '123e4567-e89b-12d3-a456-426614174001'; -- Regular user 1

SELECT oq.id, t.user_id 
FROM output_queue oq
JOIN transcripts t ON t.id = oq.transcript_id
WHERE t.user_id = current_setting('request.jwt.claim.sub')::uuid
LIMIT 1;

-- Reset to superuser for final verification
SET request.jwt.claim.role = 'service_role';

-- Verify RLS is enabled on all tables using the correct system catalog view
SELECT 
    n.nspname as schema,
    c.relname as table_name,
    CASE WHEN c.relrowsecurity THEN 'enabled' ELSE 'disabled' END as rls_enabled,
    CASE WHEN c.relforcerowsecurity THEN 'enabled' ELSE 'disabled' END as rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
    AND c.relkind = 'r'
    AND c.relname IN (
        'ai_models',
        'ai_providers',
        'api_costs',
        'billing_records',
        'output_ai_constraints',
        'output_files',
        'output_pricing',
        'output_queue',
        'output_types',
        'playlist_items',
        'playlists',
        'service_tiers',
        'teams',
        'transcript_types',
        'transcripts',
        'user_credits',
        'user_model_preferences',
        'user_roles',
        'user_subscriptions'
    )
ORDER BY c.relname;
```

## Expected Results

1. Unauthenticated users should be denied access to all tables
2. Regular users should:
   - Only see their own transcripts
   - View but not modify AI models
   - Access output queue items only for their transcripts
3. Admin users should:
   - See all transcripts
   - Have full access to AI models
   - Access all output queue items

## Troubleshooting

If tests fail, verify:
1. RLS is enabled on all tables
2. Policies are correctly created
3. JWT claims are properly set
4. Required columns are properly populated (e.g., user_id, tenant_id) 
5. All commits are properly signed with GPG keys for audit tracking 