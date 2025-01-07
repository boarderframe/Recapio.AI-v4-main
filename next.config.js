/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
        // Add path aliases
        config.resolve.alias['@'] = require('path').join(__dirname);

        if (dev) {
            // Development-specific optimizations
            config.optimization = {
                ...config.optimization,
                splitChunks: false,
                minimize: false,
                minimizer: [],
            };

            // Enable React Fast Refresh
            config.experiments = {
                ...config.experiments,
                topLevelAwait: true,
            };
        }

        return config;
    },
    // Improve development performance
    onDemandEntries: {
        // Period (in ms) where the server will keep pages in the buffer
        maxInactiveAge: 120 * 1000,
        // Number of pages that should be kept simultaneously without being disposed
        pagesBufferLength: 5,
    },
};

module.exports = nextConfig;