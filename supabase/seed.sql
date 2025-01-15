-- Seed data for Recapio.AI database
BEGIN;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create system user
INSERT INTO auth.users (id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data) VALUES 
    ('00000000-0000-0000-0000-000000000000', 'system@recapio.ai', NOW(),
    '{"role": "system", "provider": "email", "providers": ["email"]}',
    '{"role": "system", "email_verified": true}')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, roles, created_at, updated_at) VALUES
    ('00000000-0000-0000-0000-000000000000', 'system@recapio.ai', ARRAY['system'], NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    roles = EXCLUDED.roles,
    updated_at = NOW();

-- Create admin user
WITH new_admin AS (
    INSERT INTO auth.users (
        id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, encrypted_password
    ) VALUES (
        uuid_generate_v4(), 'cosburn@yahoo.com', NOW(),
        '{"role": "admin", "provider": "email", "providers": ["email"]}',
        '{"role": "admin", "first_name": "Carl", "last_name": "Osburn", "email_verified": true}',
        crypt('Anker5425$a', gen_salt('bf'))
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id, email
)
INSERT INTO public.users (id, email, roles, created_at, updated_at)
SELECT id, email, ARRAY['admin'], NOW(), NOW()
FROM new_admin
ON CONFLICT (id) DO NOTHING;

-- Create test user
WITH new_test_user AS (
    INSERT INTO auth.users (
        id, email, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, encrypted_password
    ) VALUES (
        uuid_generate_v4(), 'user1@recapio.ai', NOW(),
        '{"role": "user", "provider": "email", "providers": ["email"]}',
        '{"role": "user", "email_verified": true}',
        crypt('User123!', gen_salt('bf'))
    )
    ON CONFLICT (id) DO NOTHING
    RETURNING id, email
)
INSERT INTO public.users (id, email, roles, created_at, updated_at)
SELECT id, email, ARRAY['user'], NOW(), NOW()
FROM new_test_user
ON CONFLICT (id) DO NOTHING;

-- Insert AI providers
INSERT INTO public.ai_providers (name, description, created_at, updated_at) VALUES
    ('OpenAI', 'Provider of GPT models and APIs', NOW(), NOW()),
    ('Anthropic', 'Provider of Claude models and APIs', NOW(), NOW()),
    ('Cohere', 'Provider of language models and APIs', NOW(), NOW());

-- Insert AI models
INSERT INTO public.ai_models (
    provider_id, model_name, token_limit, cost_per_token,
    version, capabilities, created_at, updated_at
) VALUES
    ((SELECT id FROM ai_providers WHERE name = 'OpenAI'), 'gpt-4', 8192, 0.00003,
    '4.0', '{"features": ["chat", "completion", "function_calling"]}', NOW(), NOW()),
    ((SELECT id FROM ai_providers WHERE name = 'OpenAI'), 'gpt-3.5-turbo', 4096, 0.000002,
    '3.5', '{"features": ["chat", "completion", "function_calling"]}', NOW(), NOW()),
    ((SELECT id FROM ai_providers WHERE name = 'Anthropic'), 'claude-2', 100000, 0.000008,
    '2.0', '{"features": ["chat", "completion", "analysis"]}', NOW(), NOW());

-- Insert API costs
INSERT INTO public.api_costs (api_type, cost_per_call, token_cost_multiplier, created_at, updated_at) VALUES
    ('transcription', 0.0001, 1.0, NOW(), NOW()),
    ('summarization', 0.00015, 1.2, NOW(), NOW()),
    ('analysis', 0.0002, 1.5, NOW(), NOW());

-- Insert service tiers
INSERT INTO public.service_tiers (
    name, description, monthly_price, api_limit,
    credit_limit, features, created_at, updated_at
) VALUES
    ('Free', 'Basic access with limited features', 0, 100, 1000,
    '{"max_file_size": "10MB", "concurrent_jobs": 2}', NOW(), NOW()),
    ('Pro', 'Professional tier with advanced features', 49.99, 1000, 10000,
    '{"max_file_size": "100MB", "concurrent_jobs": 5, "priority_processing": true}', NOW(), NOW()),
    ('Enterprise', 'Full access with custom limits', 199.99, 5000, 50000,
    '{"max_file_size": "1GB", "concurrent_jobs": 20, "priority_processing": true, "custom_models": true}', NOW(), NOW());

-- Insert output types
INSERT INTO public.output_types (
    name, description, component_name,
    props, style, tenant_id,
    created_at, updated_at
) VALUES
    ('insights_stream', 'Real-time insights stream during playback',
    'InsightsStream',
    jsonb_build_object(
        'stream_interval', '30s',
        'max_context_window', 2000,
        'min_confidence', 0.85
    ),
    jsonb_build_object(
        'theme', 'light',
        'layout', 'sidebar',
        'colors', jsonb_build_object(
            'primary', '#2196F3',
            'secondary', '#FFC107',
            'background', '#FFFFFF'
        )
    ),
    '00000000-0000-0000-0000-000000000000',
    NOW(), NOW()),
    
    ('one_pager', 'One-page summary with key points',
    'OnePager',
    jsonb_build_object(
        'max_length', 1000,
        'format', 'markdown',
        'sections', ARRAY['summary', 'key_points', 'action_items']
    ),
    jsonb_build_object(
        'theme', 'light',
        'layout', 'full',
        'colors', jsonb_build_object(
            'primary', '#4CAF50',
            'secondary', '#FF5722',
            'background', '#F5F5F5'
        )
    ),
    '00000000-0000-0000-0000-000000000000',
    NOW(), NOW());

COMMIT; 