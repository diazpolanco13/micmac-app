/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['@prisma/client']
  },
  images: {
    domains: ['avatars.githubusercontent.com', 'lh3.googleusercontent.com']
  },
  env: {
    AUTOMATION_ENABLED: process.env.NODE_ENV === 'production' ? 'true' : 'false'
  }
};

module.exports = nextConfig;