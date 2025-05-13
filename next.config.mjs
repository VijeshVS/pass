// next.config.mjs
import { defineConfig } from 'next';

export default defineConfig({
  typescript: {
    // Ignore TypeScript errors
    ignoreBuildErrors: true,
  },
  eslint: {
    // Ignore ESLint errors during production build
    ignoreDuringBuilds: true,
  },
});
