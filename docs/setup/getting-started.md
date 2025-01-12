# Getting Started with Recapio

## Prerequisites

- Node.js 18.x or higher
- npm 9.x or higher
- Git
- Supabase account
- OpenAI API key
- Google Cloud account (for speech-to-text)

## Initial Setup

1. **Clone the Repository**
   ```bash
   git clone https://github.com/your-repo/recapio.git
   cd recapio
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # OpenAI Configuration
   OPENAI_API_KEY=your_openai_api_key

   # Google Cloud Configuration
   GOOGLE_APPLICATION_CREDENTIALS=path_to_credentials.json

   # Application Configuration
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_DEBUG_MODE=true
   ```

4. **Database Setup**
   ```bash
   # Generate database types
   npx supabase gen types typescript --project-id "your_project_id" > types/supabase.ts

   # Apply migrations
   npx supabase db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## Development Tools Setup

### VS Code Extensions
- ESLint
- Prettier
- TypeScript and JavaScript Language Features
- Tailwind CSS IntelliSense
- GitLens

### Code Quality Tools
```bash
# Install Husky for git hooks
npx husky install

# Setup lint-staged
npm set-script prepare "husky install"
npx husky add .husky/pre-commit "npx lint-staged"
```

## Testing Environment

1. **Setup Testing Framework**
   ```bash
   # Install testing dependencies
   npm install --save-dev jest @testing-library/react @testing-library/jest-dom

   # Create test database
   npx supabase db create test
   ```

2. **Configure Test Environment**
   Create `.env.test.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_test_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_test_anon_key
   ```

## Common Setup Issues

### Node Version Mismatch
```bash
# Using nvm to manage Node versions
nvm install 18
nvm use 18
```

### Database Connection Issues
1. Check Supabase dashboard for correct credentials
2. Verify IP allowlist in Supabase settings
3. Test connection using Supabase CLI

### Build Errors
```bash
# Clear Next.js cache
rm -rf .next

# Clean install dependencies
rm -rf node_modules
npm cache clean --force
npm install
```

## Next Steps

1. Review the [Architecture Overview](../technical/architecture.md)
2. Set up [Authentication](../core-systems/authentication.md)
3. Configure [Database Access](../core-systems/database.md)
4. Explore [UI Components](../ui-ux/design-guide.md)

## Development Workflow

1. **Branch Management**
   ```bash
   # Create feature branch
   git checkout -b feature/your-feature-name

   # Keep branch updated
   git fetch origin
   git rebase origin/main
   ```

2. **Code Quality**
   ```bash
   # Run linting
   npm run lint

   # Run tests
   npm test

   # Check types
   npm run type-check
   ```

3. **Local Testing**
   ```bash
   # Build production version
   npm run build

   # Start production server
   npm start
   ```

## Support and Resources

- Join our [Discord community](https://discord.gg/your-server)
- Check [Troubleshooting Guide](../troubleshooting/fixes.md)
- Review [FAQ](../setup/faq.md) 