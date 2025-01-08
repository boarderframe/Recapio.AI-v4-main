-- Drop existing table if it exists
DROP TABLE IF EXISTS transcript_types;

-- Create the table with proper structure
CREATE TABLE transcript_types (
    id BIGSERIAL PRIMARY KEY,
    category VARCHAR(100) NOT NULL,
    category_color VARCHAR(50),
    category_icon VARCHAR(50),
    type VARCHAR(100) NOT NULL,
    sub_type TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_transcript_types_category ON transcript_types(category);
CREATE INDEX idx_transcript_types_type ON transcript_types(type);

-- Add a unique constraint to prevent duplicates
ALTER TABLE transcript_types ADD CONSTRAINT unique_category_type_subtype UNIQUE (category, type, sub_type); 