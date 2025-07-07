/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable any Next.js experimental flags you need
  experimental: {
    serverActions: true,
  },

  // Disable ESLint checks during builds so you don't need ESLint installed in CI
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Preserve your existing webpack warning suppression
  webpack: (config) => {
    config.ignoreWarnings = [
      {
        module: /node_modules\/@supabase\/realtime-js/,
        message: /the request of a dependency is an expression/,
      },
    ];
    return config;
  },
};

module.exports = nextConfig;
