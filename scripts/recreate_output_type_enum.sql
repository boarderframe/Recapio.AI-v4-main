-- Drop existing enum type and dependent objects
DROP TYPE IF EXISTS output_type CASCADE;

-- Create enum type with correct values
CREATE TYPE output_type AS ENUM (
    'insights_stream',
    'tinder_swipers',
    'one_pager',
    'recapio_slides',
    'recapio_bytes',
    'recapio_anchor'
);

-- Add the columns back and set their type
ALTER TABLE transcript_outputs 
    ADD COLUMN output_type output_type;

ALTER TABLE transcript_output_requests 
    ADD COLUMN output_type output_type; 