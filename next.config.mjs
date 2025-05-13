/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Disable ESLint during the build step
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Disable TypeScript type checking during the build step
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
