# Recapio

Recapio is a powerful transcription and analysis platform that leverages AI to convert speech to text and provide intelligent insights.

## Table of Contents
- [Features](#features)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

## Features
- Speech-to-text transcription
- AI-powered analysis
- Real-time collaboration
- Custom theme support
- Role-based access control
- Responsive design

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm 9.x or higher
- Supabase account
- OpenAI API key
- Google Cloud account (for speech-to-text)

### Installation
1. Clone the repository:
```bash
git clone https://github.com/yourusername/recapio.git
cd recapio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```
Edit `.env.local` with your configuration.

4. Start the development server:
```bash
npm run dev
```

## Documentation

### Core Systems
- [Authentication System](docs/core-systems/authentication.md)
- [Database System](docs/core-systems/database.md)
- [Navigation System](docs/core-systems/navigation.md)
- [Profile Menu System](docs/core-systems/profile-menu.md)

### Technical Documentation
- [Architecture Overview](docs/technical/architecture.md)
- [State Management](docs/technical/state-management.md)
- [API Integration](docs/technical/api-integration.md)
- [Theme System](docs/technical/theme.md)

### Deployment
- [Deployment Guide](docs/deployment/deployment-guide.md)
- [Environment Configuration](docs/deployment/environment.md)
- [Security Considerations](docs/deployment/security.md)

### Planning
- [Roadmap](docs/planning/roadmap.md)
- [Feature Planning](docs/planning/features.md)
- [UI/UX Guidelines](docs/planning/ui-ux.md)

### Testing
- [Testing Guide](docs/testing/testing-guide.md)
- [Test Environment](docs/testing/environment.md)
- [E2E Testing](docs/testing/e2e.md)

### Troubleshooting
- [Common Issues](docs/troubleshooting/common-issues.md)
- [Debug Guide](docs/troubleshooting/debug-guide.md)
- [FAQ](docs/troubleshooting/faq.md)

## Architecture

### Frontend
- Next.js 14 (App Router)
- React 18
- TypeScript
- Material-UI
- TailwindCSS

### State Management
- Redux Toolkit (Global state)
- Zustand (UI state)
- React Query (Server state)

### Backend
- Supabase (Database & Authentication)
- OpenAI API (AI processing)
- Google Cloud Speech-to-Text

### Infrastructure
- Vercel (Hosting)
- Supabase (Backend)
- AWS S3 (File storage)

## Contributing
Please read our [Contributing Guide](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 