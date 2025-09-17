/** @type {import('next').NextConfig} */
const nextConfig = {
  // Skip ESLint during production builds to avoid failures when ESLint isn't installed
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
