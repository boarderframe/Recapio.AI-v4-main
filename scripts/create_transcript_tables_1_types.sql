-- Part 1: Extensions and Types
-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create enum types for static values
DO $$ BEGIN
    CREATE TYPE transcript_status AS ENUM ('draft', 'processing', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE source_type AS ENUM ('text', 'document', 'media', 'live');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE output_type AS ENUM (
        'insights_stream',
        'tinder_swipers',
        'one_pager',
        'recapio_slides',
        'recapio_bytes',
        'recapio_anchor'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE processing_status AS ENUM ('pending', 'in_progress', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE request_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'failed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$; 