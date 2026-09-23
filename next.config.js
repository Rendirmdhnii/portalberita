/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'qhtwymioyulvyctztktd.supabase.co',
      'qhtwymloyulvyctztktd.supabase.co',
      'pojoktv.com',
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'qhtwymioyulvyctztktd.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'qhtwymloyulvyctztktd.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;
