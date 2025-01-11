/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    swcMinify: false, // Disable SWC minification for stability
    webpack: (config) => {
        config.resolve.alias = {
            ...config.resolve.alias,
            '@': __dirname,
        };
        
        // Disable webpack caching in development
        config.cache = false;
        
        return config;
    },
    // Increase buffer size and timeouts
    experimental: {
        largePageDataBytes: 128 * 100000, // Increase page data buffer
    },
};

module.exports = nextConfig;