# Database Layer Implementation Plan

## Progress So Far
✅ Completed:
1. Created comprehensive database documentation
2. Set up local development environment with Colima and Docker
3. Created base schema with core tables (users, transcripts, transcript_types)
4. Implemented and tested RLS policies for transcript_types table
5. Created admin access functions and statistics functions
6. Set up migration management system
7. Created comprehensive test suite for RLS policies
8. Verified tenant isolation and global data access

## Next Steps

### Phase 1: Apply RLS Policies to All Tables (ETA: 2-3 days)
1. Apply standard RLS template to remaining tables:
   ```sql
   -- Standard RLS Template
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

   -- ... other policies (see transcript_types implementation)
   ```

2. Create test scripts for each table:
   ```sql
   -- Test script template
   DO $$
   DECLARE
       admin_user_id UUID;
       regular_user_id UUID;
   BEGIN
       -- Create test users
       -- Test admin access
       -- Test user access
       -- Verify results
   END $$;
   ```

### Phase 2: Monitoring System (ETA: 2-3 days)
1. Create policy audit system:
   ```sql
   CREATE OR REPLACE VIEW policy_audit AS
   SELECT 
       schemaname,
       tablename,
       policyname,
       cmd,
       roles,
       qual
   FROM pg_policies
   WHERE schemaname = 'public'
   ORDER BY tablename, policyname;
   ```

2. Set up access logging:
   ```sql
   CREATE TABLE access_log (
       id BIGSERIAL PRIMARY KEY,
       user_id UUID REFERENCES auth.users(id),
       table_name TEXT,
       operation TEXT,
       timestamp TIMESTAMPTZ DEFAULT NOW()
   );
   ```

### Phase 3: Automated Testing (ETA: 2-3 days)
1. Create test suite:
   ```typescript
   // tests/database/rls.test.ts
   describe('RLS Policies', () => {
     describe('Admin Access', () => {
       it('should allow full access')
       it('should allow cross-tenant operations')
     })
     
     describe('User Access', () => {
       it('should restrict to own data')
       it('should allow global data access')
     })
   })
   ```

2. Set up CI/CD pipeline:
   ```yaml
   # .github/workflows/test-database.yml
   name: Test Database
   on: [push, pull_request]
   jobs:
     test:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Start Supabase
           run: supabase start
         - name: Run Tests
           run: npm run test:database
   ```

### Phase 4: Documentation (ETA: 1-2 days)
1. Update technical documentation:
   - RLS policy implementation guide
   - Testing procedures
   - Rollback procedures
   - Monitoring guide

2. Create user documentation:
   - Access patterns
   - Data ownership rules
   - Global data usage
   - Admin capabilities

## Implementation Details

### RLS Policy Structure
```sql
-- Policy naming convention
"[Action] [table_name]"  -- e.g., "View transcript_types"

-- Policy types
AS PERMISSIVE  -- For normal access
AS RESTRICTIVE -- For additional restrictions

-- Operations
FOR SELECT
FOR INSERT
FOR UPDATE
FOR DELETE
```

### Test Data Requirements
```typescript
interface TestData {
  users: {
    id: string;
    email: string;
    roles: string[];
    // ... other fields
  }[];
  testCases: {
    description: string;
    operation: 'select' | 'insert' | 'update' | 'delete';
    expectedResult: boolean;
    // ... test specifics
  }[];
}
```

## Verification Checklist
- [x] transcript_types RLS policies implemented
- [x] Admin access verified
- [x] User access restrictions tested
- [x] Global data access working
- [ ] Apply to remaining tables
- [ ] Set up monitoring
- [ ] Create automated tests
- [ ] Update documentation

## Commands Reference

### Testing
```bash
# Run RLS tests
npm run test:rls

# Verify policies
npm run verify:policies

# Reset test data
npm run reset:testdata
```

### Deployment
```bash
# Apply RLS policies
npm run apply:rls

# Verify deployment
npm run verify:deployment
```

## Next Actions
1. Apply RLS template to remaining tables
2. Set up monitoring system
3. Create automated test suite
4. Update documentation
5. Deploy to staging for verification 