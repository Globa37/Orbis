/** Canonical origin. Override per environment; no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbis.watch"
).replace(/\/$/, "");

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
