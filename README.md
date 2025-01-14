# Recapio.AI v4.3.1

## Latest Updates
- Fixed auth system stability issues
- Improved session management
- Enhanced UI state handling
- Better TypeScript type safety

## Development Approach

This project uses a local-first development approach with Supabase. All development and testing are done using a local Supabase instance, which simplifies the development process and makes testing more efficient.

### Key Points
- Local Supabase instance for development
- TypeScript support with proper type definitions
- Complete test data available through seed files
- All database operations are type-safe and testable locally
- Robust auth system with proper state management

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

### Authentication System
- Uses Zustand for global state management
- Session storage for better security
- Proper cleanup of auth listeners
- Type-safe auth operations
- UI state synchronization
- See [Auth Troubleshooting](docs/troubleshooting/auth-troubleshooting.md) for common issues

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
- `/lib/state` - Global state management
- `/docs/troubleshooting` - Common issues and solutions

### Testing
- Use local database for all testing
- Type-safe database operations
- Comprehensive seed data available
- Database functions can be tested locally
- API endpoints testable against local instance
- UI components tested with proper state management

## Documentation

- [Local Development Strategy](docs/planning/local-development-strategy.md)
- [Database Layer Strategy](docs/planning/database-layer-strategy.md)
- [Development Strategy](docs/planning/development-strategy.md)
- [Auth Troubleshooting](docs/troubleshooting/auth-troubleshooting.md)

## Important Notes

1. This project uses local development only - no remote schema synchronization is needed
2. All database changes should be made through migrations
3. All database operations are type-safe with TypeScript
4. Test data is provided through the seed file
5. Development is simplified by focusing on local instance
6. Always check component mount status before state updates
7. Use proper cleanup for subscriptions and effects

For detailed setup and development instructions, see [run.md](run.md). 