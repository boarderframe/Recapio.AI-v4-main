-- Drop the table if it exists
DROP TABLE IF EXISTS transcript_output_requests;

-- Recreate the table
CREATE TABLE transcript_output_requests (
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