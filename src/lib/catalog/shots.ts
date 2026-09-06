import type { ImageRole } from "./types";

/**
 * Framings taken from the campaign photography.
 *
 * There is one master photograph per reference, so every framing here is a
 * genuine crop of that frame — never a second pose invented to fill a gallery.
 * Values are fractions of the source image.
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

export const GALLERY_ORDER: ImageRole[] = ["hero", "angle", "detail", "lifestyle"];

export function shot(role: ImageRole | "card") {
  const s = SHOTS.find((x) => x.role === role);
  if (!s) throw new Error(`unknown shot ${role}`);
  return s;
}

export function shotHeight(s: ShotSpec) {
  return Math.round(s.w / s.ratio);
}

export function imagePath(collection: string, product: string, role: ImageRole | "card") {
  return `/products/${collection}/${product}/${role}.webp`;
}
