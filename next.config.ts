import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
  },
  poweredByHeader: false,
  // Hostinger: Turbopack PostCSS workers can fail on their build hosts.
  // Prefer `next build --webpack` (package.json). This is a fallback if Turbopack is used.
  experimental: {
    turbopackPluginRuntimeStrategy: "workerThreads",
  },
};

export default nextConfig;
