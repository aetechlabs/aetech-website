import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
    ],
  },
  // Disable caching and storage
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0',
          },
          {
            key: 'Pragma',
            value: 'no-cache',
          },
          {
            key: 'Expires',
            value: '0',
          },
        ],
      },
    ];
  },
  // Disable static optimization and force dynamic rendering
  experimental: {
    serverComponentsExternalPackages: [],
  },
  // Disable build-time caching
  generateBuildId: async () => {
    return 'no-cache-' + Date.now();
  },
};

export default nextConfig;
