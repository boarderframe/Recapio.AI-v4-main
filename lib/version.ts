import pkg from '../package.json';

// Validate version format (should be 4.x.x)
function validateVersion(version: string): string {
    const versionRegex = /^4\.\d+\.\d+$/;
    if (!versionRegex.test(version)) {
        console.warn(`Invalid version format: ${version}. Expected format: 4.x.x`);
        return '4.1.0'; // Default to 4.1.0 if invalid
    }
    return version;
}

// Base version from package.json should be v4.x.x format
export const BASE_VERSION = validateVersion(pkg.version);

// Environment-specific version suffixes
const VERSION_SUFFIXES = {
    production: '',
    staging: '-rc',
    development: '-dev',
    training: '-train'
} as const;

// Get current environment
export const APP_ENV = process.env.NEXT_PUBLIC_APP_ENV || process.env.NODE_ENV || 'development';
export const BUILD_TIME = process.env.NEXT_PUBLIC_BUILD_TIME || new Date().toISOString();
export const IS_DEV = APP_ENV === 'development';

// Get build number from env or default to 1
const BUILD_NUMBER = process.env.NEXT_PUBLIC_BUILD_NUMBER || '1';

export function getEnvironmentString(): string {
    return APP_ENV.toUpperCase();
}

export function getVersionString(): string {
    const baseVersion = BASE_VERSION;
    
    // For production, just return the base version
    if (APP_ENV === 'production') {
        return `v${baseVersion}`;
    }

    // For other environments, append the appropriate suffix and build number
    const suffix = VERSION_SUFFIXES[APP_ENV as keyof typeof VERSION_SUFFIXES] || '-dev';
    return `v${baseVersion}${suffix}.${BUILD_NUMBER}`;
}

export function getVersionInfo() {
    const versionString = getVersionString();
    return {
        version: versionString,
        baseVersion: BASE_VERSION,
        environment: getEnvironmentString(),
        buildTime: BUILD_TIME,
        buildNumber: BUILD_NUMBER,
        isDev: IS_DEV,
        nextVersion: pkg.dependencies?.next || 'unknown',
        reactVersion: pkg.dependencies?.react || 'unknown',
        nodeVersion: process.version,
    };
}

export function getDetailedVersionInfo() {
    return {
        ...getVersionInfo(),
        dependencies: {
            next: pkg.dependencies?.next || 'unknown',
            react: pkg.dependencies?.react || 'unknown',
            mui: pkg.dependencies?.['@mui/material'] || 'unknown',
        },
        platform: process.platform,
        arch: process.arch,
    };
} 