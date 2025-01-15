# Recapio.AI

![Version](https://img.shields.io/badge/version-4.4.0-blue.svg)

A modern web application for transcribing and analyzing audio content using AI.

## Features

- 🎯 Advanced Speech Recognition with AI
- 📊 Smart Analytics & Insights
- 🔄 Real-time Processing
- 📱 Responsive Design
- 🔒 Secure Authentication
- 👥 Role-based Access Control
- 🎨 Modern UI with Tailwind CSS
- 🌙 Dark Mode Support
- 🚀 Optimized Performance

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **Styling**: Tailwind CSS with custom theme
- **Icons**: Heroicons
- **UI Components**: Headless UI
- **State Management**: Zustand
- **Type Safety**: TypeScript
- **Development**: Docker & Supabase CLI

## Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm or yarn
- Docker Desktop
- Supabase CLI
- Git

### Local Development

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/recapio.git
   cd recapio
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start Docker Desktop and set up Supabase:
   ```bash
   supabase start
   ```

4. Create a `.env.local` file:
   ```
   NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

Visit `http://localhost:3000` to see the application.

## Development Workflow

### Core Features
The project maintains separate branches for core features:
- `core/auth` - Authentication system
- `core/ui` - UI components and navigation
- `core/api` - API and business logic
- `core/db` - Database and data models

### Feature Development
1. Choose the appropriate core branch
2. Create a feature branch
3. Develop and test
4. Merge back to core branch
5. Tag stable versions

### Version Control
- Core features are independently versioned
- Integration happens in `develop` branch
- Releases are merged to `main`
- Recovery is possible through version tags

For detailed development guidelines, see [Development Guide](docs/DEVELOPMENT.md)

## Project Structure

```
app/
├── (marketing)/     # Public pages
│   ├── page.tsx    # Home
│   ├── features/   # Feature showcase
│   ├── pricing/    # Pricing plans
│   ├── about/      # About us
│   └── contact/    # Contact form
├── (auth)/         # Authentication
│   ├── signin/     # Login page
│   └── signup/     # Registration
├── (app)/          # Protected pages
│   ├── dashboard/  # User dashboard
│   ├── transcripts/# Transcript management
│   ├── library/    # Resource library
│   ├── reporting/  # Analytics & reports
│   ├── settings/   # User settings
│   └── profile/    # User profile
└── (admin)/        # Admin section
    ├── console/    # Admin dashboard
    ├── debug/      # Debug tools
    └── testing/    # Testing utilities

components/
├── layout/         # Layout components
│   ├── AdminNavigation.tsx  # Admin nav with groups
│   ├── AppNavigation.tsx    # Main app navigation
│   └── PublicNavbar.tsx     # Marketing site nav
├── ui/            # UI components
└── providers/     # Context providers

lib/
├── supabase/      # Supabase client
├── state/         # State management
└── utils/         # Utilities

styles/            # Global styles
```

## Authentication & Authorization

The application uses Supabase Authentication with:
- Email/Password authentication
- Role-based access control (User, Admin)
- Protected routes with middleware
- Session management
- Profile creation on signup
- User metadata for roles

## Navigation System

### Marketing Pages
- Public navigation with mobile menu
- Feature highlights
- Pricing information
- About and contact pages

### App Pages (Post-Login)
- Protected navigation with user profile
- Dashboard access
- Transcript management
- Settings and profile pages

### Admin Section
- Role-restricted access
- Grouped navigation:
  - Navigation group (App, Public)
  - Admin group (Console, Debug, Testing)
- Custom themed interface
- Quick access to all sections

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests
- `supabase start` - Start Supabase services
- `supabase stop` - Stop Supabase services

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support:
- Email: support@recapio.ai
- Discord: [Join our community](https://discord.gg/recapio)
- Documentation: [docs.recapio.ai](https://docs.recapio.ai)

## Roadmap

Completed:
- ✅ Migration to Tailwind CSS (v4.4.0)
- ✅ Admin interface redesign with role-based access (v4.4.0)
- ✅ Navigation system with grouped items (v4.4.0)
- ✅ Dark mode support
- ✅ Command system for development workflow (v4.4.0)
- ✅ Directory restructure for app routes (v4.4.0)
- ✅ TypeScript migration complete (v4.4.0)

In Progress:
- [ ] Email verification
- [ ] Password reset flow
- [ ] Enhanced user profiles
- [ ] Mobile navigation improvements
- [ ] Loading state refinements

## Acknowledgments

- Next.js team for the amazing framework
- Supabase team for the backend infrastructure
- Tailwind CSS team for the styling system
- Headless UI team for accessible components
- All contributors and supporters 