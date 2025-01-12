# Recapio App

This directory contains the Next.js application code for Recapio.

## Development Setup

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Git with GPG signing configured
- macOS development tools:
  ```bash
  brew install gnupg pinentry-mac
  ```

### Environment Setup
1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment variables:
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

### Git Configuration
1. Set up GPG signing (required for all commits):
   - Follow the [GPG Signing Guide](../docs/setup/gpg-signing.md)
   - Configure Git:
     ```bash
     git config --global commit.gpgsign true
     ```

2. Verify your setup:
   ```bash
   git commit -S -m "test: verify GPG signing"
   git log -1 --show-signature
   ```

### Development Server
1. Start the development server:
   ```bash
   npm run dev
   ```

2. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── api/            # API routes
├── components/     # Shared components
├── lib/           # Core libraries
├── pages/         # App pages
├── public/        # Static assets
├── styles/        # Global styles
└── types/         # TypeScript types
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build production bundle
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `npm run type-check` - Run TypeScript checks

## Contributing

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit with GPG signing:
   ```bash
   git commit -S -m "feat: add new feature"
   ```

3. Push and create a pull request:
   ```bash
   git push origin feature/your-feature-name
   ```

## Security

- All commits must be GPG signed
- Follow security best practices in [Security Guide](../docs/deployment/security.md)
- Keep dependencies updated
- Run security audits regularly:
  ```bash
  npm audit
  ``` 