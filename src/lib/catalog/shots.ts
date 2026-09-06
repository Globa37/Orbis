import type { CropRole, ImageRole } from "./types";
import { SHARED_IMAGES } from "./shared.generated";

/**
 * Framings taken from the campaign photography.
 *
 * There is one master photograph per reference, so every framing in SHOTS is a
 * genuine crop of that frame — never a second pose invented to fill a gallery.
 * Values are fractions of the source image.
 *
 * SHARED_IMAGES is the one deliberate exception: see the note above it.
 */
export interface ShotSpec {
  role: CropRole | "card";
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
 * Shared framings are discovered, not declared.
 *
 * The back of the watch is the same part on all five references — one caseback,
 * five dials — so it is shot once and shared rather than re-photographed per
 * colourway. Any image dropped into assets/caseback/ becomes one of these: the
 * build derives it into the collection's _shared/ folder and records it in
 * shared.generated.ts, which is what SHARED_IMAGES re-exports here.
 *
 * That means adding a view is adding a file. Nothing in this module has to
 * change, and a folder with no images simply yields no shared framings.
 */
export { SHARED_IMAGES };

/** Output size for a shared framing, which is used whole rather than cropped. */
export const SHARED_WIDTH = 1400;

export const GALLERY_ORDER: CropRole[] = ["hero", "angle", "detail", "lifestyle"];

export function shot(role: CropRole | "card") {
  const s = SHOTS.find((x) => x.role === role);
  if (!s) throw new Error(`unknown shot ${role}`);
  return s;
}

/** Label for any framing, cropped or shared. */
export function shotLabel(role: string): string {
  return (
    SHOTS.find((s) => s.role === role)?.label ??
    SHARED_IMAGES.find((s) => s.role === role)?.label ??
    role
  );
}

export function shotHeight(s: ShotSpec) {
  return Math.round(s.w / s.ratio);
}

export function imagePath(collection: string, product: string, role: CropRole | "card") {
  return `/products/${collection}/${product}/${role}.webp`;
}

/** Shared framings live beside the products, not inside each one. */
export function sharedImagePath(collection: string, role: ImageRole) {
  return `/products/${collection}/_shared/${role}.webp`;
}
