import type { ImageRole } from "./types";

/**
 * The campaign framings. One source of truth: the render script shoots these,
 * the site consumes them. A new collection inherits the whole system.
 */
export interface ShotSpec {
  role: ImageRole | "card";
  w: number;
  h: number;
  /** Case height as a fraction of frame height. */
  fill: number;
  /** Frame-relative point the case centre lands on. */
  focus: { x: number; y: number };
  plate: { pos: string; scale: number; blur: number; opacity: number };
  rotate?: { y: number; x: number };
  shadow: number;
  reflection: boolean;
  /** Shown in the product gallery under this name. */
  label: string;
}

export const SHOTS: ShotSpec[] = [
  {
    role: "hero", label: "Front",
    w: 1200, h: 1500, fill: 0.57, focus: { x: 0.5, y: 0.47 },
    plate: { pos: "center 58%", scale: 1.25, blur: 22, opacity: 0.85 },
    shadow: 1, reflection: true,
  },
  {
    role: "angle", label: "Three-quarter",
    w: 1200, h: 1500, fill: 0.57, focus: { x: 0.52, y: 0.47 },
    plate: { pos: "center 55%", scale: 1.35, blur: 24, opacity: 0.8 },
    rotate: { y: -27, x: 7 },
    shadow: 1, reflection: true,
  },
  {
    role: "detail", label: "Dial",
    w: 1200, h: 1200, fill: 0.86, focus: { x: 0.5, y: 0.5 },
    plate: { pos: "center 40%", scale: 1.9, blur: 34, opacity: 0.7 },
    rotate: { y: -9, x: 3 },
    shadow: 0.5, reflection: false,
  },
  {
    role: "lifestyle", label: "Campaign",
    w: 1400, h: 1750, fill: 0.42, focus: { x: 0.5, y: 0.5 },
    plate: { pos: "center 44%", scale: 1.04, blur: 5, opacity: 1 },
    rotate: { y: -16, x: 5 },
    shadow: 0.95, reflection: true,
  },
  {
    role: "card", label: "Card",
    w: 1000, h: 1250, fill: 0.56, focus: { x: 0.5, y: 0.47 },
    plate: { pos: "center 60%", scale: 1.3, blur: 26, opacity: 0.7 },
    shadow: 0.8, reflection: false,
  },
];

export const GALLERY_ORDER: ImageRole[] = ["hero", "angle", "detail", "lifestyle"];

export function shot(role: ImageRole | "card") {
  const s = SHOTS.find((x) => x.role === role);
  if (!s) throw new Error(`unknown shot ${role}`);
  return s;
}

export function imagePath(collection: string, product: string, role: ImageRole | "card") {
  return `/products/${collection}/${product}/${role}.webp`;
}
