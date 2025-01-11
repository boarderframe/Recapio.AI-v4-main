-- Set default value for tenant_id and make it non-nullable
ALTER TABLE ai_providers ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE ai_providers ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE user_credits ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE user_credits ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE output_files ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE output_files ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE user_model_preferences ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE user_model_preferences ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE transcript_types ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE transcript_types ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE service_tiers ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE service_tiers ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE user_subscriptions ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE user_subscriptions ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE output_queue ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE output_queue ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE api_costs ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE api_costs ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE ai_models ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE ai_models ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE teams ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE teams ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE output_pricing ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE output_pricing ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE output_types ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE output_types ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE user_roles ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE user_roles ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE output_ai_constraints ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE output_ai_constraints ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE transcripts ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE transcripts ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE playlists ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE playlists ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE playlist_items ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE playlist_items ALTER COLUMN tenant_id SET NOT NULL;

ALTER TABLE billing_records ALTER COLUMN tenant_id SET DEFAULT '00000000-0000-0000-0000-000000000000';
ALTER TABLE billing_records ALTER COLUMN tenant_id SET NOT NULL;

-- Create indexes for performance optimization
-- Multi-tenant optimization indexes
CREATE INDEX IF NOT EXISTS idx_tenant_user_credits ON user_credits(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_user_subs ON user_subscriptions(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_transcripts ON transcripts(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_playlists ON playlists(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_output_files ON output_files(tenant_id);
CREATE INDEX IF NOT EXISTS idx_tenant_output_queue ON output_queue(tenant_id);

-- Performance optimization indexes
CREATE INDEX IF NOT EXISTS idx_subscription_dates ON user_subscriptions(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_output_queue_status ON output_queue(status);
CREATE INDEX IF NOT EXISTS idx_transcripts_status ON transcripts(status);
CREATE INDEX IF NOT EXISTS idx_transcripts_type ON transcripts(type);
CREATE INDEX IF NOT EXISTS idx_output_files_type ON output_files(file_type);

-- Foreign key optimization indexes
CREATE INDEX IF NOT EXISTS idx_output_queue_transcript ON output_queue(transcript_id);
CREATE INDEX IF NOT EXISTS idx_output_queue_type ON output_queue(output_type_id);
CREATE INDEX IF NOT EXISTS idx_user_model_prefs ON user_model_preferences(preferred_model_id);
CREATE INDEX IF NOT EXISTS idx_user_subs_tier ON user_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_file ON playlist_items(output_file_id);
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist ON playlist_items(playlist_id);

-- Update statistics after index creation
ANALYZE user_credits;
ANALYZE user_subscriptions;
ANALYZE transcripts;
ANALYZE playlists;
ANALYZE output_files;
ANALYZE output_queue;
ANALYZE user_model_preferences;
ANALYZE playlist_items; 