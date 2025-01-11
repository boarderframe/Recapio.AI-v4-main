ALTER TABLE ai_providers ALTER COLUMN tenant_id SET NOT NULL;
ALTER TABLE user_credits ALTER COLUMN tenant_id SET NOT NULL; ALTER TABLE output_files ALTER COLUMN tenant_id SET NOT NULL;
