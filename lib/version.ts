import pkg from '../package.json';
import os from 'os';

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

// Build number management using environment variables
// In development, we increment the number on each server restart
let buildCounter = 1;
export const BUILD_NUMBER = (() => {
    // Try to get from environment
    const envBuildNumber = process.env.NEXT_PUBLIC_BUILD_NUMBER;
    if (envBuildNumber) {
        return parseInt(envBuildNumber, 10);
    }
    
    // For development, use memory counter
    if (IS_DEV) {
        return buildCounter++;
    }
    
    // Default to 1 for other cases
    return 1;
})();

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

export interface DetailedVersionInfo {
    version: string;
    baseVersion: string;
    environment: string;
    buildNumber: number;
    buildTime: string;
    dependencies: {
        node: string;
        next: string;
        react: string;
        mui: string;
    };
    system: {
        platform: string;
        arch: string;
        memory: string;
        cpus: number;
    };
}

export function getVersionInfo(): DetailedVersionInfo {
    const versionString = getVersionString();
    const totalMem = Math.round(os.totalmem() / (1024 * 1024 * 1024));
    
    return {
        version: versionString,
        baseVersion: BASE_VERSION,
        environment: getEnvironmentString(),
        buildNumber: BUILD_NUMBER,
        buildTime: BUILD_TIME,
        dependencies: {
            node: process.version,
            next: pkg.dependencies?.next || 'unknown',
            react: pkg.dependencies?.react || 'unknown',
            mui: pkg.dependencies?.['@mui/material'] || 'unknown',
        },
        system: {
            platform: os.platform(),
            arch: os.arch(),
            memory: `${totalMem}GB RAM`,
            cpus: os.cpus().length,
        }
    };
}

// Development helper to track version changes
if (IS_DEV) {
    console.log('Version Info:', getVersionInfo());
} 