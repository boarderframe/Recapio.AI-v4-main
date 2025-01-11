-- Add new columns for separated prompt components
ALTER TABLE transcript_types
ADD COLUMN IF NOT EXISTS analysis_instructions TEXT,
ADD COLUMN IF NOT EXISTS json_schema JSONB,
ADD COLUMN IF NOT EXISTS api_parameters JSONB;

-- Create a function to migrate existing data
CREATE OR REPLACE FUNCTION migrate_prompts() RETURNS void AS $$
DECLARE
    default_json_schema JSONB := '{
        "type": "object",
        "properties": {
            "ai_title": {
                "type": "string",
                "description": "Descriptive, SEO-friendly title capturing the essence of the transcript (50-75 chars)"
            },
            "summary": {
                "type": "string",
                "description": "Concise overview highlighting key points and main takeaways (200-300 chars)"
            },
            "themes": {
                "type": "array",
                "items": { "type": "string" },
                "minItems": 3,
                "maxItems": 7,
                "description": "Main topics, concepts, and areas of discussion"
            },
            "hashtags": {
                "type": "array",
                "items": { "type": "string" },
                "minItems": 5,
                "maxItems": 10,
                "description": "Relevant hashtags for social media and categorization"
            },
            "sentiment_analysis": {
                "type": "object",
                "properties": {
                    "overall": {
                        "type": "string",
                        "description": "General sentiment (positive/negative/neutral) with confidence score"
                    },
                    "sections": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "section": { "type": "string" },
                                "sentiment": { "type": "string" },
                                "confidence": { 
                                    "type": "number",
                                    "minimum": 0,
                                    "maximum": 1
                                }
                            },
                            "required": ["section", "sentiment", "confidence"]
                        }
                    }
                },
                "required": ["overall", "sections"]
            },
            "category_specific_data": {
                "type": "object"
            }
        },
        "required": ["ai_title", "summary", "themes", "hashtags", "sentiment_analysis"]
    }'::jsonb;
BEGIN
    -- Update records that have existing summary_prompts
    UPDATE transcript_types
    SET 
        analysis_instructions = CASE 
            WHEN summary_prompt LIKE '%[ANALYSIS INSTRUCTIONS]%' 
            THEN substring(summary_prompt from '\[ANALYSIS INSTRUCTIONS\](.*?)\[JSON' )
            ELSE summary_prompt
        END,
        json_schema = default_json_schema,
        api_parameters = '{"model": "gpt-4", "temperature": 0.7, "max_tokens": 1000, "top_p": 0.95, "frequency_penalty": 0.0, "presence_penalty": 0.0}'::jsonb
    WHERE summary_prompt IS NOT NULL;
END;
$$ LANGUAGE plpgsql;

-- Execute the migration
SELECT migrate_prompts();

-- Add comments to explain the columns
COMMENT ON COLUMN transcript_types.analysis_instructions IS 'The specific instructions for analyzing this type of transcript';
COMMENT ON COLUMN transcript_types.json_schema IS 'The JSON schema for OpenAI structured output validation';
COMMENT ON COLUMN transcript_types.api_parameters IS 'The OpenAI API parameters for this transcript type';

-- Create an index on the new columns
CREATE INDEX IF NOT EXISTS idx_transcript_types_analysis ON transcript_types USING gin(to_tsvector('english', analysis_instructions));
CREATE INDEX IF NOT EXISTS idx_transcript_types_json ON transcript_types USING gin(json_schema);
CREATE INDEX IF NOT EXISTS idx_transcript_types_api ON transcript_types USING gin(api_parameters); 