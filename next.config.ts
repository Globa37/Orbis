import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // The campaign is pre-rendered to WebP at fixed frame sizes; Next only needs
    // to pick a width. AVIF is generated on demand for browsers that take it.
    formats: ["image/avif", "image/webp"],
    deviceSizes: [420, 640, 828, 1080, 1200, 1600, 1920, 2560],
    imageSizes: [88, 96, 128, 256, 384],
  },
  experimental: {
    optimizePackageImports: ["@/components"],
  },
};

export default nextConfig;
