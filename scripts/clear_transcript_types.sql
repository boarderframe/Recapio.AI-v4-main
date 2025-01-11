-- Clear out AI-related fields from all transcript types
UPDATE transcript_types
SET 
    analysis_instructions = NULL,
    json_schema = NULL,
    api_parameters = NULL
WHERE true;

-- Verify the update
SELECT id, category, type, sub_type, analysis_instructions, json_schema, api_parameters
FROM transcript_types
ORDER BY category, type, sub_type; 