import type { NextConfig } from "next";

/*
 * `npm run export` writes the whole site to out/ as plain files, so it can be
 * opened from disk or dropped on any static host without a Node server.
 *
 * Two things cannot survive that: the image optimiser and redirects both need
 * a server at request time. The campaign is already pre-rendered to WebP at
 * fixed sizes by scripts/build-assets.mts, so serving those files untouched
 * costs nothing; the redirects are simply absent from an export, which is why
 * this is a viewing build and not the deployment.
 */
const isExport = process.env.STATIC_EXPORT === "1";

/*
 * An export is served from wherever it is dropped. On GitHub Pages a project
 * site lives under /<repo>, not at the root, so every asset and link has to
 * carry that prefix or the page loads bare. Empty means the site is at the
 * root, which is the default.
 */
const basePath = process.env.BASE_PATH ?? "";

const nextConfig: NextConfig = {
  ...(isExport ? { output: "export" as const, trailingSlash: true } : {}),
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  // Reaches asset() in the browser, for paths basePath cannot rewrite itself.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  images: {
    unoptimized: isExport,
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
  // Redirects need a server, so an export has none. See isExport above.
  ...(isExport ? {} : { redirects }),
};

async function redirects() {
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
}

export default nextConfig;
