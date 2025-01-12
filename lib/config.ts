/**
 * Application configuration derived from environment variables
 */

interface Config {
    // Application settings
    APP_NAME: string;
    APP_URL: string;
    NODE_ENV: 'development' | 'production' | 'test';
    PORT: number;

    // API URLs
    API_URL: string;
    SUPABASE_URL: string;
    SUPABASE_ANON_KEY: string;
    SUPABASE_SERVICE_ROLE_KEY: string;

    // External API keys
    OPENAI_API_KEY: string;
    GOOGLE_API_KEY: string;

    // Authentication settings
    AUTH_COOKIE_NAME: string;
    AUTH_COOKIE_LIFETIME: number;
    JWT_SECRET: string;
    JWT_EXPIRY: string;

    // Feature toggles
    ENABLE_AUTH: boolean;
    ENABLE_ADMIN: boolean;
    ENABLE_API: boolean;
    ENABLE_WEBSOCKETS: boolean;

    // Rate limiting
    RATE_LIMIT_WINDOW: number;
    RATE_LIMIT_MAX_REQUESTS: number;

    // Cache settings
    CACHE_TTL: number;
    CACHE_CHECK_PERIOD: number;

    // Monitoring
    ENABLE_LOGGING: boolean;
    LOG_LEVEL: 'debug' | 'info' | 'warn' | 'error';
    SENTRY_DSN?: string;
}

// Default configuration values
const defaultConfig: Config = {
    APP_NAME: 'Recapio',
    APP_URL: 'http://localhost:3000',
    NODE_ENV: (process.env.NODE_ENV as Config['NODE_ENV']) || 'development',
    PORT: parseInt(process.env.PORT || '3000', 10),

    API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
    SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY || '',

    OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY || '',

    AUTH_COOKIE_NAME: 'auth_token',
    AUTH_COOKIE_LIFETIME: 7 * 24 * 60 * 60 * 1000, // 7 days
    JWT_SECRET: process.env.JWT_SECRET || 'your-secret-key',
    JWT_EXPIRY: '7d',

    ENABLE_AUTH: true,
    ENABLE_ADMIN: true,
    ENABLE_API: true,
    ENABLE_WEBSOCKETS: true,

    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX_REQUESTS: 100,

    CACHE_TTL: 5 * 60 * 1000, // 5 minutes
    CACHE_CHECK_PERIOD: 60 * 1000, // 1 minute

    ENABLE_LOGGING: true,
    LOG_LEVEL: 'info',
    SENTRY_DSN: process.env.SENTRY_DSN
};

// Validation function to ensure required environment variables are present
const validateConfig = () => {
    const requiredVars = ['SUPABASE_URL', 'SUPABASE_ANON_KEY'];
    const missingVars = requiredVars.filter(
        (varName) => !process.env[`NEXT_PUBLIC_${varName}`]
    );

    if (missingVars.length > 0) {
        throw new Error(
            `Missing required environment variables: ${missingVars.join(', ')}`
        );
    }
};

// Get configuration with optional overrides
export const getConfig = (overrides?: Partial<Config>): Config => {
    validateConfig();
    return {
        ...defaultConfig,
        ...overrides
    };
};

// Export the configuration
export const appConfig = getConfig(); 