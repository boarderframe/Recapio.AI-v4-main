# Development Instructions for AI Agent

## Required Reading Order
1. `/docs/planning/local-development-strategy.md` - Current progress and next steps
2. `/supabase/seed.sql` - Complete database seed data
3. `/supabase/migrations/*.sql` - Database schema and structure

## Environment Setup
1. Ensure Supabase CLI is installed
2. Start local Supabase instance:
   ```bash
   supabase start
   ```
3. Initialize database with seed data:
   ```bash
   PGPASSWORD=postgres psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql
   ```

## Current Status
- Local Supabase instance configured
- Database schema implemented
- Comprehensive seed data available
- All tables populated with test data
- Foreign key relationships verified

## Immediate Tasks
1. Database Policy Testing
   - Test RLS policies
   - Verify tenant isolation
   - Document policy behaviors

2. Function Testing
   - Test database functions
   - Verify error handling
   - Document results

3. API Implementation
   - Create core endpoints
   - Add authentication
   - Document API

## Development Guidelines
1. Focus on local development only
2. Use provided seed data for testing
3. Document all test results
4. Follow existing code structure
5. Update planning document with progress

## Important Notes
- All development should be done locally
- Use test data from seed.sql
- Document any schema changes
- Verify RLS policies before API implementation 