-- Multi-tenancy and user indexes CREATE INDEX IF NOT EXISTS idx_tenant_user_credits ON user_credits(tenant_id, user_id);
CREATE INDEX IF NOT EXISTS idx_tenant_user_subs ON user_subscriptions(tenant_id, user_id); CREATE INDEX IF NOT EXISTS idx_subscription_dates ON user_subscriptions(start_date, end_date);
