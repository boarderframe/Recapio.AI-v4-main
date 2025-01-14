# Recapio.AI v4.3.0

## Development Approach

This project uses a local-first development approach with Supabase. All development and testing are done using a local Supabase instance, which simplifies the development process and makes testing more efficient.

### Key Points
- Local Supabase instance for development
- TypeScript support with proper type definitions
- Complete test data available through seed files
- All database operations are type-safe and testable locally

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
- Database operations are fully typed with TypeScript
- Test data is provided through seed files
- Database functions and relationships are tested locally
- RLS policies are implemented and tested locally

### Code Organization
- `/supabase/migrations` - Database migrations
- `/supabase/seed.sql` - Test data
- `/docs/planning` - Development strategy and documentation
- `/docs/database` - Database documentation
- `/lib/database` - TypeScript database operations
- `/types` - TypeScript type definitions

### Testing
- Use local database for all testing
- Type-safe database operations
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
3. All database operations are type-safe with TypeScript
4. Test data is provided through the seed file
5. Development is simplified by focusing on local instance

For detailed setup and development instructions, see [run.md](run.md). 