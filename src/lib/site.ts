/**
 * The origin every absolute URL is built from: canonicals, Open Graph images,
 * the links inside the structured data.
 *
 * NEXT_PUBLIC_SITE_URL wins, and is what you set once a real domain is
 * pointed at the deployment. Failing that, a Vercel deployment names itself —
 * without which every canonical on a preview or a *.vercel.app deployment
 * would claim to live at orbis.watch, a domain that may not be serving this
 * site at all. The literal is the last resort, for a build with no
 * environment at all.
 */
const ORIGIN =
  process.env.NEXT_PUBLIC_SITE_URL ??
  vercel(process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL) ??
  vercel(process.env.VERCEL_PROJECT_PRODUCTION_URL) ??
  "https://orbis.watch";

/** Vercel names its domains without a scheme. */
function vercel(host: string | undefined) {
  return host ? `https://${host}` : undefined;
}

export const SITE_URL = ORIGIN.replace(/\/$/, "");

export const SITE_NAME = "ORBIS";

export function absolute(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

/**
 * Prefixes a root-relative path with the deployment's base path.
 *
 * next/image and next/link do this themselves. Anything else that names a file
 * by hand — a stylesheet's url(), an inline background — does not, and would
 * request the file from the domain root. A static export served from a
 * subdirectory (GitHub Pages puts a project site under /<repo>) is exactly the
 * case where that breaks, so those callers go through here.
 */
export function asset(path: string) {
  const base = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
