-- Check for existing tables and their current state
DO $$ 
DECLARE
    table_exists boolean;
    policy_exists boolean;
    enum_exists boolean;
    conflict_found boolean := false;
BEGIN
    -- Check tables
    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transcripts'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE 'Table "transcripts" already exists';
        conflict_found := true;
    END IF;

    SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'transcript_contents'
    ) INTO table_exists;
    
    IF table_exists THEN
        RAISE NOTICE 'Table "transcript_contents" already exists';
        conflict_found := true;
    END IF;

    -- Check enums
    SELECT EXISTS (
        SELECT FROM pg_type 
        WHERE typname = 'transcript_status'
    ) INTO enum_exists;
    
    IF enum_exists THEN
        RAISE NOTICE 'Enum type "transcript_status" already exists';
        conflict_found := true;
    END IF;

    -- Check policies
    SELECT EXISTS (
        SELECT FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'transcripts'
    ) INTO policy_exists;
    
    IF policy_exists THEN
        RAISE NOTICE 'Policies on "transcripts" table already exist';
        conflict_found := true;
    END IF;

    -- Check foreign key constraints
    IF EXISTS (
        SELECT FROM information_schema.table_constraints 
        WHERE constraint_type = 'FOREIGN KEY' 
        AND table_name = 'transcripts'
    ) THEN
        RAISE NOTICE 'Foreign key constraints on "transcripts" table already exist';
        conflict_found := true;
    END IF;

    -- Final status
    IF conflict_found THEN
        RAISE NOTICE 'Conflicts found. Please review the notices above and consider running the rollback script first.';
    ELSE
        RAISE NOTICE 'No conflicts found. Safe to proceed with table creation.';
    END IF;
END $$; 