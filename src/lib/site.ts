/** Canonical origin. Override per environment; no trailing slash. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://orbis.watch"
).replace(/\/$/, "");

export const SITE_NAME = "ORBIS";

export function absolute(path: string) {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
