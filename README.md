# Recapio.AI

## Development Approach

This project uses a local-first development approach with Supabase. All development and testing are done using a local Supabase instance, which simplifies the development process and makes testing more efficient.

### Key Points
- Local Supabase instance for development
- No remote schema synchronization required
- Complete test data available through seed files
- All database operations testable locally

## Getting Started

1. Install Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Start local Supabase:
```bash
supabase start
```

3. Initialize database:
```bash
psql -h localhost -p 54322 -U postgres -d postgres -f supabase/seed.sql
```

## Development Guidelines

### Database Development
- All schema changes should be made through local migrations
- Test data is provided through seed files
- Database functions are tested locally
- RLS policies are implemented and tested locally

### Code Organization
- `/supabase/migrations` - Database migrations
- `/supabase/seed.sql` - Test data
- `/docs/planning` - Development strategy and documentation
- `/docs/database` - Database documentation

### Testing
- Use local database for all testing
- Comprehensive seed data available
- Database functions can be tested locally
- API endpoints testable against local instance

## Documentation

- [Local Development Strategy](docs/planning/local-development-strategy.md)
- [Database Layer Strategy](docs/planning/database-layer-strategy.md)
- [Development Strategy](docs/planning/development-strategy.md)

## Important Notes

1. This project uses local development only - no remote schema synchronization is needed
2. All database changes should be made through migrations
3. Test data is provided through the seed file
4. Development is simplified by focusing on local instance

For detailed setup and development instructions, see [run.md](run.md). 