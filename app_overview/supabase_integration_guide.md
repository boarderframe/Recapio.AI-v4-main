# Supabase Integration Guide

## Setting Up the Supabase Client

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'YOUR_SUPABASE_URL';
const supabaseAnonKey = 'YOUR_SUPABASE_ANON_KEY';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

## TypeScript Integration

### Generating Types
Use the Supabase CLI to generate TypeScript types for your database schema:
```bash
npx supabase gen types typescript --project-id "$PROJECT_REF" --schema public > types/supabase.ts
```

### Using Generated Types
```typescript
import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/supabase'

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SECRET_KEY
)
```

## Query Building and Database Operations

### Basic Queries
- Use type-safe queries with generated types
- Implement proper error handling
- Utilize pagination and filtering capabilities

### Real-time Subscriptions
```typescript
const subscription = supabase
  .from('table_name')
  .on('*', payload => {
    console.log('Change received!', payload)
  })
  .subscribe();
```

## Security Best Practices

### Row Level Security (RLS)
- Enable RLS on all tables
- Implement tenant isolation at the policy level
- Use proper authentication checks

### Environment Variables
- Store Supabase URL and keys securely
- Use different keys for different environments
- Never expose service role key in client-side code

## Production Considerations

### Database Changes
- Avoid using Dashboard for production changes
- Implement proper migration workflows
- Use CI/CD for database updates

### Performance Optimization
- Create appropriate indexes
- Monitor query performance
- Implement proper connection pooling

### Error Handling
```typescript
try {
  const { data, error } = await supabase
    .from('table_name')
    .select()
  
  if (error) throw error
  
  // Handle data
} catch (error) {
  console.error('Error:', error)
}
```

## Best Practices

1. **Query Building**
   - Use type-safe queries
   - Implement proper filtering
   - Handle pagination efficiently

2. **Security**
   - Enable RLS
   - Use proper authentication
   - Implement tenant isolation

3. **Performance**
   - Create necessary indexes
   - Monitor query performance
   - Optimize large queries

4. **Error Handling**
   - Implement proper error catching
   - Log errors appropriately
   - Provide meaningful error messages

5. **Type Safety**
   - Use generated types
   - Maintain type definitions
   - Update types when schema changes 