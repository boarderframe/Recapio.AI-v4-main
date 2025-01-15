-- Create base schema for Recapio.AI

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create source_type enum
DO $$ BEGIN
    CREATE TYPE source_type AS ENUM ('text', 'audio', 'video', 'image');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create users table if it doesn't exist
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    roles TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create transcripts table
CREATE TABLE IF NOT EXISTS transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tenant_id UUID NOT NULL REFERENCES users(id),
    title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    category TEXT DEFAULT 'general',
    language TEXT DEFAULT 'en',
    source_type source_type DEFAULT 'text',
    sub_type TEXT DEFAULT 'meeting',
    type TEXT DEFAULT 'business',
    summary TEXT,
    content TEXT,
    universal_metadata JSONB DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    user_id UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create transcript_types table
CREATE TABLE IF NOT EXISTS transcript_types (
    id SERIAL PRIMARY KEY,
    tenant_id UUID NOT NULL REFERENCES users(id),
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    sub_type TEXT NOT NULL,
    analysis_instructions TEXT,
    summary_prompt TEXT,
    schema_version INTEGER DEFAULT 1,
    api_parameters JSONB DEFAULT '{}',
    json_schema JSONB DEFAULT '{}',
    json_structure JSONB DEFAULT '{}',
    category_color TEXT,
    category_icon TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    UNIQUE(tenant_id, category, type, sub_type)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcript_types ENABLE ROW LEVEL SECURITY;

-- Grant basic permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update their own data"
    ON users FOR UPDATE
    USING (auth.uid() = id);

-- Create RLS policies for transcripts table
CREATE POLICY "Users can view own transcripts"
    ON transcripts FOR SELECT
    USING (
        tenant_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

CREATE POLICY "Users can manage own transcripts"
    ON transcripts
    FOR ALL
    USING (
        tenant_id = auth.uid() OR
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

-- Create RLS policies for transcript_types table
CREATE POLICY "Admin full access to transcript types"
    ON transcript_types
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM users
            WHERE id = auth.uid()
            AND 'admin' = ANY(roles)
        )
    );

CREATE POLICY "Users can view transcript types"
    ON transcript_types
    FOR SELECT
    USING (
        tenant_id = auth.uid() OR
        tenant_id = '00000000-0000-0000-0000-000000000000'
    );

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_transcripts_tenant_id ON transcripts(tenant_id);
CREATE INDEX IF NOT EXISTS idx_transcript_types_tenant_id ON transcript_types(tenant_id);
CREATE INDEX IF NOT EXISTS idx_users_roles ON users USING GIN(roles);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers to all tables
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transcripts_updated_at
    BEFORE UPDATE ON transcripts
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transcript_types_updated_at
    BEFORE UPDATE ON transcript_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create ai_providers table
CREATE TABLE IF NOT EXISTS ai_providers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create ai_models table
CREATE TABLE IF NOT EXISTS ai_models (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    provider_id UUID NOT NULL REFERENCES ai_providers(id),
    model_name TEXT NOT NULL,
    token_limit INTEGER,
    cost_per_token DECIMAL,
    version TEXT,
    capabilities JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider_id, model_name)
);

-- Create api_costs table
CREATE TABLE IF NOT EXISTS api_costs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    api_type TEXT NOT NULL UNIQUE,
    cost_per_call DECIMAL,
    token_cost_multiplier DECIMAL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create service_tiers table
CREATE TABLE IF NOT EXISTS service_tiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    monthly_price DECIMAL,
    api_limit INTEGER,
    credit_limit INTEGER,
    features JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create teams table
CREATE TABLE IF NOT EXISTS teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    tenant_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(tenant_id, name)
);

-- Create user_roles table
CREATE TABLE IF NOT EXISTS user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    team_id UUID NOT NULL REFERENCES teams(id),
    role TEXT NOT NULL,
    tenant_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, team_id)
);

-- Create user_subscriptions table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    tier_id UUID NOT NULL REFERENCES service_tiers(id),
    start_date TIMESTAMPTZ NOT NULL,
    end_date TIMESTAMPTZ NOT NULL,
    is_active BOOLEAN DEFAULT true,
    tenant_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create user_credits table
CREATE TABLE IF NOT EXISTS user_credits (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    tenant_id UUID NOT NULL REFERENCES users(id),
    total_credits INTEGER DEFAULT 0,
    used_credits INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Create user_model_preferences table
CREATE TABLE IF NOT EXISTS user_model_preferences (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    tenant_id UUID NOT NULL REFERENCES users(id),
    preferred_model_id UUID NOT NULL REFERENCES ai_models(id),
    use_for_output_types TEXT[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, preferred_model_id)
);

-- Create billing_records table
CREATE TABLE IF NOT EXISTS billing_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id),
    tenant_id UUID NOT NULL REFERENCES users(id),
    amount DECIMAL NOT NULL,
    description TEXT,
    billing_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create output_types table
CREATE TABLE IF NOT EXISTS output_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    component_name TEXT NOT NULL,
    props JSONB DEFAULT '{}',
    style JSONB DEFAULT '{}',
    tenant_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create output_queue table
CREATE TABLE IF NOT EXISTS output_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID NOT NULL REFERENCES transcripts(id),
    output_type_id UUID NOT NULL REFERENCES output_types(id),
    status TEXT NOT NULL DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    attempts INTEGER DEFAULT 0,
    last_error TEXT,
    metadata JSONB DEFAULT '{}',
    tenant_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create output_files table
CREATE TABLE IF NOT EXISTS output_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID NOT NULL REFERENCES transcripts(id),
    output_type_id UUID NOT NULL REFERENCES output_types(id),
    output_queue_id UUID REFERENCES output_queue(id),
    file_path TEXT NOT NULL,
    file_url TEXT,
    file_type TEXT,
    file_size INTEGER,
    mime_type TEXT,
    metadata JSONB DEFAULT '{}',
    status TEXT NOT NULL DEFAULT 'pending',
    tenant_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Create playlists table
CREATE TABLE IF NOT EXISTS playlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    user_id UUID NOT NULL REFERENCES users(id),
    tenant_id UUID NOT NULL REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, name)
);

-- Create playlist_items table
CREATE TABLE IF NOT EXISTS playlist_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    playlist_id UUID NOT NULL REFERENCES playlists(id),
    transcript_id UUID NOT NULL REFERENCES transcripts(id),
    output_file_id UUID REFERENCES output_files(id),
    position INTEGER NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(playlist_id, position),
    UNIQUE(playlist_id, order_index)
);

-- Add triggers for new tables
CREATE TRIGGER update_ai_providers_updated_at
    BEFORE UPDATE ON ai_providers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_ai_models_updated_at
    BEFORE UPDATE ON ai_models
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_api_costs_updated_at
    BEFORE UPDATE ON api_costs
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_tiers_updated_at
    BEFORE UPDATE ON service_tiers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
    BEFORE UPDATE ON teams
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_subscriptions_updated_at
    BEFORE UPDATE ON user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_credits_updated_at
    BEFORE UPDATE ON user_credits
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_model_preferences_updated_at
    BEFORE UPDATE ON user_model_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_billing_records_updated_at
    BEFORE UPDATE ON billing_records
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_playlists_updated_at
    BEFORE UPDATE ON playlists
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_output_types_updated_at
    BEFORE UPDATE ON output_types
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on new tables
ALTER TABLE ai_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_costs ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_model_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE output_types ENABLE ROW LEVEL SECURITY;

-- Create indexes for new tables
CREATE INDEX IF NOT EXISTS idx_ai_models_provider_id ON ai_models(provider_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_team_id ON user_roles(team_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_tier_id ON user_subscriptions(tier_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_user_id ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_model_preferences_user_id ON user_model_preferences(user_id);
CREATE INDEX IF NOT EXISTS idx_billing_records_user_id ON billing_records(user_id);
CREATE INDEX IF NOT EXISTS idx_playlists_user_id ON playlists(user_id);
CREATE INDEX IF NOT EXISTS idx_output_types_tenant_id ON output_types(tenant_id);

-- Add trigger for output_files
CREATE TRIGGER update_output_files_updated_at
    BEFORE UPDATE ON output_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable RLS on output_files
ALTER TABLE output_files ENABLE ROW LEVEL SECURITY;

-- Create indexes for output_files
CREATE INDEX IF NOT EXISTS idx_output_files_transcript_id ON output_files(transcript_id);
CREATE INDEX IF NOT EXISTS idx_output_files_output_type_id ON output_files(output_type_id);
CREATE INDEX IF NOT EXISTS idx_output_files_tenant_id ON output_files(tenant_id); 