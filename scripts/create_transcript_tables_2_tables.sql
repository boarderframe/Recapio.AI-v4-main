-- Part 2: Create Tables
-- Main transcripts table
CREATE TABLE IF NOT EXISTS transcripts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) NOT NULL,
    tenant_id UUID NOT NULL,
    organization_id UUID,
    category TEXT NOT NULL,
    type TEXT NOT NULL,
    sub_type TEXT NOT NULL,
    title TEXT NOT NULL,
    status transcript_status NOT NULL DEFAULT 'draft',
    source_type source_type NOT NULL DEFAULT 'text',
    language TEXT NOT NULL DEFAULT 'en',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    FOREIGN KEY (category, type, sub_type) REFERENCES transcript_types(category, type, sub_type)
);

-- Content storage table
CREATE TABLE IF NOT EXISTS transcript_contents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
    original_content TEXT NOT NULL,
    processed_content TEXT,
    word_count INTEGER,
    token_count INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Processing tracking table
CREATE TABLE IF NOT EXISTS transcript_processing (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
    model_id TEXT NOT NULL,
    model_provider TEXT NOT NULL,
    input_tokens INTEGER NOT NULL,
    output_tokens INTEGER NOT NULL,
    cost DECIMAL(10,4) NOT NULL,
    started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    status processing_status NOT NULL DEFAULT 'pending',
    error_message TEXT,
    metadata JSONB
);

-- Generated outputs table
CREATE TABLE IF NOT EXISTS transcript_outputs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
    output_type output_type NOT NULL,
    content JSONB NOT NULL,
    model_id TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Table for tracking requested outputs and their estimates
CREATE TABLE IF NOT EXISTS transcript_output_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    transcript_id UUID REFERENCES transcripts(id) ON DELETE CASCADE NOT NULL,
    output_type output_type NOT NULL,
    estimated_input_tokens INTEGER,
    estimated_output_tokens INTEGER,
    estimated_cost DECIMAL(10,4),
    model_id TEXT NOT NULL,
    status request_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
); 