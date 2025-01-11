-- Check tenant_id nullability
SELECT table_name, column_name, is_nullable, column_default
FROM information_schema.columns
WHERE column_name = 'tenant_id'
ORDER BY table_name;

-- Check indexes
SELECT 
    tablename, 
    indexname, 
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Add missing composite index for playlists
CREATE INDEX IF NOT EXISTS idx_playlist_user ON public.playlists USING btree (tenant_id, user_id, created_at);

-- Update statistics
ANALYZE ai_models;
ANALYZE ai_providers;
ANALYZE api_costs;
ANALYZE billing_records;
ANALYZE output_ai_constraints;
ANALYZE output_files;
ANALYZE output_pricing;
ANALYZE output_queue;
ANALYZE output_types;
ANALYZE playlist_items;
ANALYZE playlists;
ANALYZE service_tiers;
ANALYZE teams;
ANALYZE transcript_types;
ANALYZE transcripts;
ANALYZE user_credits;
ANALYZE user_model_preferences;
ANALYZE user_roles;
ANALYZE user_subscriptions; 