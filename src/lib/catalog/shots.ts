import type { ImageRole } from "./types";

/**
 * Framings taken from the campaign photography.
 *
 * There is one master photograph per reference, so every framing in SHOTS is a
 * genuine crop of that frame — never a second pose invented to fill a gallery.
 * Values are fractions of the source image.
 *
 * SHARED_SHOTS is the one deliberate exception: see the note above it.
 */
export interface ShotSpec {
  role: ImageRole | "card";
  /** Output width in pixels; height follows from the aspect ratio. */
  w: number;
  /** Target aspect ratio, width / height. */
  ratio: number;
  /** Crop width as a fraction of the source width. */
  scale: number;
  /** Crop centre, as fractions of the source. */
  centre: { x: number; y: number };
  label: string;
}

export const SHOTS: ShotSpec[] = [
  {
    role: "hero", label: "Campaign",
    w: 1200, ratio: 0.8, scale: 1, centre: { x: 0.5, y: 0.5 },
  },
  {
    role: "angle", label: "Case",
    w: 1200, ratio: 0.8, scale: 0.66, centre: { x: 0.53, y: 0.44 },
  },
  {
    role: "detail", label: "Dial",
    w: 1200, ratio: 1, scale: 0.42, centre: { x: 0.5, y: 0.43 },
  },
  {
    role: "lifestyle", label: "Setting",
    w: 1400, ratio: 0.8, scale: 0.86, centre: { x: 0.5, y: 0.56 },
  },
  {
    role: "card", label: "Card",
    w: 1000, ratio: 0.8, scale: 0.74, centre: { x: 0.5, y: 0.46 },
  },
];

/**
 * Framings that are their own photograph rather than a crop of a reference's
 * master frame.
 *
 * The back of the watch is the same part on all five references — one caseback,
 * five dials — so it is shot once and shared instead of being re-photographed
 * per colourway. Each entry is stored under the collection's _shared/ folder
 * and served to every product in it. A shared shot whose source file is absent
 * is skipped by the build and never reaches the gallery, so adding a role here
 * before its photograph exists is safe.
 *
 * `source` is the basename expected in assets/caseback/.
 */
export interface SharedShotSpec {
  role: ImageRole;
  source: string;
  w: number;
  ratio: number;
  label: string;
}

export const SHARED_SHOTS: SharedShotSpec[] = [
  { role: "caseback", source: "back-front", w: 1400, ratio: 4 / 3, label: "Caseback" },
  { role: "caseback-angled", source: "back-angled", w: 1400, ratio: 4 / 3, label: "Caseback angle" },
];

export const GALLERY_ORDER: ImageRole[] = ["hero", "angle", "detail", "lifestyle"];

export function shot(role: ImageRole | "card") {
  const s = SHOTS.find((x) => x.role === role);
  if (!s) throw new Error(`unknown shot ${role}`);
  return s;
}

/** Label for any framing, cropped or shared. */
export function shotLabel(role: string): string {
  return (
    SHOTS.find((s) => s.role === role)?.label ??
    SHARED_SHOTS.find((s) => s.role === role)?.label ??
    role
  );
}

export function shotHeight(s: ShotSpec) {
  return Math.round(s.w / s.ratio);
}

export function imagePath(collection: string, product: string, role: ImageRole | "card") {
  return `/products/${collection}/${product}/${role}.webp`;
}

/** Shared framings live beside the products, not inside each one. */
export function sharedImagePath(collection: string, role: ImageRole) {
  return `/products/${collection}/_shared/${role}.webp`;
}

export function sharedBlurKey(collection: string, role: ImageRole) {
  return `${collection}/_shared/${role}`;
}
