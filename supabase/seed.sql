-- Seed data for Recapio.AI database
BEGIN;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Insert users
INSERT INTO auth.users (id, email) VALUES 
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51', 'admin@recapio.ai'),
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', 'user1@recapio.ai'),
    ('f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', 'user2@recapio.ai'),
    ('a1b2c3d4-e5f6-4a5b-6c7d-8e9f01234567', 'tester@recapio.ai'),
    ('b2c3d4e5-f6a7-4a5b-6c7d-8e9f01234568', 'dev@recapio.ai')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.users (id, email, roles, created_at, updated_at) VALUES
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51', 'admin@recapio.ai', ARRAY['admin'], NOW(), NOW()),
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', 'user1@recapio.ai', ARRAY['user'], NOW(), NOW()),
    ('f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', 'user2@recapio.ai', ARRAY['user'], NOW(), NOW()),
    ('a1b2c3d4-e5f6-4a5b-6c7d-8e9f01234567', 'tester@recapio.ai', ARRAY['user', 'tester'], NOW(), NOW()),
    ('b2c3d4e5-f6a7-4a5b-6c7d-8e9f01234568', 'dev@recapio.ai', ARRAY['user', 'developer'], NOW(), NOW())
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    roles = EXCLUDED.roles,
    updated_at = NOW();

-- Insert transcript types
INSERT INTO public.transcript_types (
    tenant_id, category, type, sub_type, 
    analysis_instructions, summary_prompt, schema_version,
    api_parameters, json_schema, json_structure,
    category_color, category_icon,
    created_at, updated_at
) VALUES
    -- Corporate transcript types
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51', 'Corporate', 'business', 'meeting',
    'Analyze meeting content for key decisions, action items, and participants.',
    'Summarize the key points, decisions, and action items from this business meeting.',
    1,
    '{"language": "en", "format": "structured"}',
    '{"type": "object", "properties": {"decisions": {"type": "array"}, "action_items": {"type": "array"}}}',
    '{"sections": ["overview", "decisions", "action_items", "next_steps"]}',
    '#2196F3', 'business',
    NOW(), NOW()),

    -- Legal transcript types
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', 'Legal', 'legal', 'hearing',
    'Analyze legal proceedings for key arguments, decisions, and citations.',
    'Summarize the key legal arguments, decisions, and important statements from all parties.',
    1,
    '{"language": "en", "format": "legal"}',
    '{"type": "object", "properties": {"arguments": {"type": "array"}, "decisions": {"type": "array"}}}',
    '{"sections": ["summary", "arguments", "decisions", "citations"]}',
    '#F44336', 'gavel',
    NOW(), NOW()),

    -- Medical transcript types
    ('f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', 'Medical', 'medical', 'consultation',
    'Analyze medical consultations for symptoms, diagnosis, and treatment plans.',
    'Summarize the patient''s symptoms, diagnosis, treatment plan, and follow-up instructions.',
    1,
    '{"language": "en", "format": "medical"}',
    '{"type": "object", "properties": {"symptoms": {"type": "array"}, "diagnosis": {"type": "string"}}}',
    '{"sections": ["patient_info", "symptoms", "diagnosis", "treatment", "follow_up"]}',
    '#4CAF50', 'medical_services',
    NOW(), NOW());

-- Insert transcripts
INSERT INTO public.transcripts (
    id, tenant_id, title, status, category, language,
    source_type, sub_type, type, summary,
    universal_metadata, user_id,
    created_at, updated_at
) VALUES
    -- Corporate transcript
    (gen_random_uuid(), 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    'Q4 Planning Meeting', 'completed', 'Corporate', 'en',
    'audio', 'meeting', 'business',
    'Quarterly planning meeting discussing Q4 goals, budget review, and team updates.',
    jsonb_build_object(
        'duration', '45:30',
        'participants', ARRAY['John Smith', 'Sarah Johnson', 'Mike Brown'],
        'topics', ARRAY['Budget Review', 'Strategy Planning', '2024 Goals']
    ),
    'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    NOW() - INTERVAL '7 days', NOW()),

    -- Legal transcript
    (gen_random_uuid(), 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    'Smith vs Jones Hearing', 'completed', 'Legal', 'en',
    'audio', 'hearing', 'legal',
    'Civil case hearing regarding contract dispute between Smith Enterprises and Jones Corp.',
    jsonb_build_object(
        'duration', '120:15',
        'case_number', 'CV-2024-123',
        'court', 'Superior Court of California',
        'judge', 'Hon. Robert Wilson'
    ),
    'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    NOW() - INTERVAL '5 days', NOW()),

    -- Medical transcript
    (gen_random_uuid(), 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345',
    'Patient Consultation - John Doe', 'completed', 'Medical', 'en',
    'audio', 'consultation', 'medical',
    'Initial consultation for cardiac evaluation and treatment planning.',
    jsonb_build_object(
        'duration', '30:00',
        'patient_id', 'P12345',
        'department', 'Cardiology',
        'doctor', 'Dr. Emily White'
    ),
    'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345',
    NOW() - INTERVAL '3 days', NOW());

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

-- Insert teams
INSERT INTO public.teams (name, tenant_id, created_at, updated_at) VALUES
    ('Engineering', 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51', NOW(), NOW()),
    ('Legal Team', 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', NOW(), NOW()),
    ('Medical Staff', 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', NOW(), NOW());

-- Insert user roles
INSERT INTO public.user_roles (user_id, team_id, role, tenant_id, created_at) VALUES
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51', 
    (SELECT id FROM teams WHERE name = 'Engineering'), 
    'team_lead', 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51', NOW()),
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    (SELECT id FROM teams WHERE name = 'Legal Team'),
    'member', 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', NOW()),
    ('f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345',
    (SELECT id FROM teams WHERE name = 'Medical Staff'),
    'member', 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', NOW());

-- Insert user subscriptions
INSERT INTO public.user_subscriptions (
    user_id, tier_id, start_date, end_date,
    is_active, tenant_id, created_at, updated_at
) VALUES
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    (SELECT id FROM service_tiers WHERE name = 'Enterprise'),
    NOW(), NOW() + INTERVAL '1 year',
    true, 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51', NOW(), NOW()),
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    (SELECT id FROM service_tiers WHERE name = 'Pro'),
    NOW(), NOW() + INTERVAL '1 year',
    true, 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', NOW(), NOW()),
    ('f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345',
    (SELECT id FROM service_tiers WHERE name = 'Free'),
    NOW(), NOW() + INTERVAL '1 month',
    true, 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', NOW(), NOW());

-- Insert user credits
INSERT INTO public.user_credits (
    user_id, tenant_id, total_credits, used_credits,
    created_at, updated_at
) VALUES
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51', 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    50000, 1500, NOW(), NOW()),
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    10000, 2500, NOW(), NOW()),
    ('f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345',
    1000, 100, NOW(), NOW());

-- Insert user model preferences
INSERT INTO public.user_model_preferences (
    user_id, tenant_id, preferred_model_id, use_for_output_types,
    created_at, updated_at
) VALUES
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51', 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    (SELECT id FROM ai_models WHERE model_name = 'gpt-4'),
    ARRAY['insights_stream', 'one_pager'], NOW(), NOW()),
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    (SELECT id FROM ai_models WHERE model_name = 'claude-2'),
    ARRAY['recapio_slides'], NOW(), NOW());

-- Insert billing records
INSERT INTO public.billing_records (
    user_id, tenant_id, amount, description,
    billing_date, created_at, updated_at
) VALUES
    ('d0d04ba7-962f-48c0-8bc4-22c3c7937d51', 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    199.99, 'Enterprise subscription - Annual', NOW(), NOW(), NOW()),
    ('e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    49.99, 'Pro subscription - Monthly', NOW(), NOW(), NOW()),
    ('f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345',
    0.00, 'Free tier usage', NOW(), NOW(), NOW());

-- Insert playlists
INSERT INTO public.playlists (
    name, user_id, tenant_id, created_at, updated_at
) VALUES
    ('Important Meetings', 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    'd0d04ba7-962f-48c0-8bc4-22c3c7937d51', NOW(), NOW()),
    ('Legal Cases 2024', 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789',
    'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', NOW(), NOW()),
    ('Patient Records', 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345',
    'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', NOW(), NOW());

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
        'min_confidence', 0.85,
        'model', (SELECT id FROM ai_models WHERE model_name = 'gpt-4')
    ),
    jsonb_build_object(
        'theme', 'light',
        'layout', 'sidebar',
        'animation', true
    ),
    'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    NOW(), NOW()),
    
    ('one_pager', 'Concise one-page summary with key points',
    'OnePager',
    jsonb_build_object(
        'max_length', 1500,
        'include_sections', ARRAY['summary', 'key_points', 'action_items'],
        'format', 'markdown',
        'model', (SELECT id FROM ai_models WHERE model_name = 'gpt-4')
    ),
    jsonb_build_object(
        'theme', 'professional',
        'font_size', '14px',
        'spacing', '1.5'
    ),
    'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    NOW(), NOW()),
    
    ('recapio_slides', 'Automated presentation slides',
    'RecapioSlides',
    jsonb_build_object(
        'slides_count', 10,
        'template', 'professional',
        'include_sections', ARRAY['title', 'agenda', 'content', 'summary'],
        'model', (SELECT id FROM ai_models WHERE model_name = 'claude-2')
    ),
    jsonb_build_object(
        'theme', 'modern',
        'aspect_ratio', '16:9',
        'transition', 'slide'
    ),
    'd0d04ba7-962f-48c0-8bc4-22c3c7937d51',
    NOW(), NOW());

-- Insert output queue entries
INSERT INTO public.output_queue (
    transcript_id, output_type_id, status, result,
    tenant_id, created_at, updated_at
) VALUES
    ((SELECT id FROM transcripts WHERE title = 'Q4 Planning Meeting'),
    (SELECT id FROM output_types WHERE name = 'one_pager'),
    'completed',
    jsonb_build_object('processing_time', '120s', 'word_count', 2500),
    'd0d04ba7-962f-48c0-8bc4-22c3c7937d51', NOW(), NOW()),
    ((SELECT id FROM transcripts WHERE title = 'Smith vs Jones Hearing'),
    (SELECT id FROM output_types WHERE name = 'recapio_slides'),
    'completed',
    jsonb_build_object('processing_time', '180s', 'word_count', 5000),
    'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', NOW(), NOW()),
    ((SELECT id FROM transcripts WHERE title = 'Patient Consultation - John Doe'),
    (SELECT id FROM output_types WHERE name = 'insights_stream'),
    'completed',
    jsonb_build_object('processing_time', '60s', 'word_count', 1500),
    'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', NOW(), NOW());

-- Insert output files for playlists
INSERT INTO public.output_files (
    output_queue_id, file_url, file_type, file_metadata,
    tenant_id, created_at, updated_at
) VALUES
    ((SELECT id FROM output_queue WHERE tenant_id = 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51' LIMIT 1),
    'https://storage.recapio.ai/files/meeting1.mp4', 'video/mp4',
    jsonb_build_object('duration', '45:30', 'size', '256MB'),
    'd0d04ba7-962f-48c0-8bc4-22c3c7937d51', NOW(), NOW()),
    ((SELECT id FROM output_queue WHERE tenant_id = 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789' LIMIT 1),
    'https://storage.recapio.ai/files/hearing1.mp4', 'video/mp4',
    jsonb_build_object('duration', '120:15', 'size', '512MB'),
    'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', NOW(), NOW()),
    ((SELECT id FROM output_queue WHERE tenant_id = 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345' LIMIT 1),
    'https://storage.recapio.ai/files/consultation1.mp4', 'video/mp4',
    jsonb_build_object('duration', '30:00', 'size', '128MB'),
    'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', NOW(), NOW());

-- Insert playlist items (linking playlists to output files)
INSERT INTO public.playlist_items (
    playlist_id, output_file_id, order_index,
    tenant_id, created_at, updated_at
) VALUES
    ((SELECT id FROM playlists WHERE name = 'Important Meetings'),
    (SELECT id FROM output_files WHERE file_url LIKE '%meeting1.mp4'),
    1, 'd0d04ba7-962f-48c0-8bc4-22c3c7937d51', NOW(), NOW()),
    ((SELECT id FROM playlists WHERE name = 'Legal Cases 2024'),
    (SELECT id FROM output_files WHERE file_url LIKE '%hearing1.mp4'),
    1, 'e4a3cf1d-0f5b-4c5a-9b1a-2c3d4e5f6789', NOW(), NOW()),
    ((SELECT id FROM playlists WHERE name = 'Patient Records'),
    (SELECT id FROM output_files WHERE file_url LIKE '%consultation1.mp4'),
    1, 'f8b2ae9c-1d2e-3f4a-5b6c-7d8e9f012345', NOW(), NOW());

COMMIT; 