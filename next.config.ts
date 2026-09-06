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
  /*
   * The references were renamed to the brand names (Onyx, Lagoon, Chrome,
   * Blush). Keep the old paths alive so nothing that was already linked
   * breaks.
   */
  async redirects() {
    const renamed: Record<string, string> = {
      noir: "onyx",
      celeste: "lagoon",
      spectrum: "chrome",
      aurora: "blush",
    };
    return Object.entries(renamed).map(([from, to]) => ({
      source: `/collections/millenium/${from}`,
      destination: `/collections/millenium/${to}`,
      permanent: true,
    }));
  },
};

export default nextConfig;
