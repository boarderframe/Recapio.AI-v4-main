# Recapio.ai

AI-Powered Transcript Summarization and Insights Platform

## Prerequisites

- Node.js (v18.x or later)
- npm (v9.x or later)
- Supabase account and project
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/recapio.git
cd recapio
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file in the root directory with the following environment variables:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Optional: Google Cloud Configuration (if using speech-to-text)
GOOGLE_APPLICATION_CREDENTIALS=path_to_your_credentials.json
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Tech Stack

- **Framework**: Next.js 14
- **UI Library**: Material-UI (MUI) v5
- **Authentication**: Supabase Auth
- **Database**: Supabase (PostgreSQL)
- **State Management**: 
  - Redux Toolkit
  - Zustand
  - React Query
- **Styling**: 
  - Emotion
  - Tailwind CSS
- **Type Checking**: TypeScript
- **Testing**: Jest & React Testing Library
- **Code Quality**:
  - ESLint
  - Prettier
- **Monitoring**: Sentry

## Features

- User authentication (email, Google, GitHub)
- Dashboard with analytics
- Transcript processing and summarization
- Real-time updates with Socket.IO
- Responsive design
- Internationalization support
- Data visualization with various chart libraries
- PDF and PowerPoint export capabilities

## Development

- Run tests:
```bash
npm test
```

- Run linter:
```bash
npm run lint
```

- Build for production:
```bash
npm run build
```

## Project Structure

```
recapio/
├── app/                    # Next.js 14 app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── ...               # Other pages
├── components/            # Reusable components
├── lib/                   # Utilities and contexts
├── public/               # Static assets
└── styles/               # Global styles
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 