# Database Layer Strategy

## Goals
1. Ensure admin access to all data
2. Implement Row Level Security (RLS) for tenant isolation
3. Establish CLI-first approach for database management
4. Create comprehensive testing strategy

## Current Status

### RLS Implementation ✅
- Successfully implemented and tested RLS policies for transcript_types table
- Verified admin access across tenants
- Confirmed tenant isolation for regular users
- Implemented global data access (tenant_id = '00000000-0000-0000-0000-000000000000')

### Current Issues
1. Need to apply RLS template to remaining tables
2. Monitoring system needed for policy auditing
3. Automated testing infrastructure required
4. Documentation needs updating

## Implementation Plan

### Phase 1: Database Access Audit (Completed) ✅
- [x] Document current access patterns
- [x] Identify security requirements
- [x] Create RLS policy templates
- [x] Test RLS implementation on transcript_types

### Phase 2: RLS Policy Standardization (In Progress)
- [x] Create standard RLS template
- [x] Implement on transcript_types table
- [ ] Apply to remaining tables
- [ ] Verify cross-table relationships

### Phase 3: CLI-First Management
- [ ] Create policy management commands
- [ ] Implement rollback procedures
- [ ] Add verification tools
- [ ] Document CLI workflows

### Phase 4: Testing Strategy
- [x] Create test scripts for transcript_types
- [ ] Expand test coverage to all tables
- [ ] Implement automated testing
- [ ] Set up CI/CD pipeline

### Phase 5: Monitoring and Maintenance
- [ ] Set up policy auditing
- [ ] Implement access logging
- [ ] Create monitoring dashboard
- [ ] Establish maintenance procedures

## Standard RLS Template

```sql
-- Enable RLS
ALTER TABLE [table_name] FORCE ROW LEVEL SECURITY;

-- View policy
CREATE POLICY "View [table_name]"
ON [table_name]
AS PERMISSIVE
FOR SELECT
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
    OR tenant_id = '00000000-0000-0000-0000-000000000000'::uuid
);

-- Insert policy
CREATE POLICY "Insert [table_name]"
ON [table_name]
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
);

-- Update policy
CREATE POLICY "Update [table_name]"
ON [table_name]
AS PERMISSIVE
FOR UPDATE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
);

-- Delete policy
CREATE POLICY "Delete [table_name]"
ON [table_name]
AS PERMISSIVE
FOR DELETE
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM users
        WHERE users.id = auth.uid()
        AND 'admin' = ANY(users.roles)
    )
    OR tenant_id = auth.uid()
);
```

## Testing Template

```sql
DO $$
DECLARE
    admin_user_id UUID;
    regular_user_id UUID;
    another_user_id UUID;
    test_record_id UUID;
BEGIN
    -- Create test users
    INSERT INTO auth.users (id, email)
    VALUES 
        (gen_random_uuid(), 'admin@test.com'),
        (gen_random_uuid(), 'user@test.com'),
        (gen_random_uuid(), 'another@test.com')
    RETURNING id INTO admin_user_id;

    -- Set up roles
    INSERT INTO public.users (id, email, roles)
    VALUES 
        (admin_user_id, 'admin@test.com', '{admin}'),
        (regular_user_id, 'user@test.com', '{user}'),
        (another_user_id, 'another@test.com', '{user}');

    -- Test admin access
    SET LOCAL "request.jwt.claims" TO '{"sub": "' || admin_user_id || '"}';
    -- Run admin tests

    -- Test user access
    SET LOCAL "request.jwt.claims" TO '{"sub": "' || regular_user_id || '"}';
    -- Run user tests

    -- Cleanup
    DELETE FROM [table_name] WHERE id = test_record_id;
    DELETE FROM public.users WHERE id IN (admin_user_id, regular_user_id, another_user_id);
    DELETE FROM auth.users WHERE email IN ('admin@test.com', 'user@test.com', 'another@test.com');
END $$;
```

## Immediate Actions
1. Apply RLS template to remaining tables
2. Set up monitoring system
3. Create automated test suite
4. Update documentation

## Short-term Tasks
1. Implement policy auditing
2. Create rollback procedures
3. Set up CI/CD pipeline
4. Document maintenance procedures

## Long-term Goals
1. Automated policy verification
2. Real-time access monitoring
3. Policy impact analysis
4. Performance optimization 