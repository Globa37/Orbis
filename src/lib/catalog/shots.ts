import type { Lang, Localized } from "@/lib/i18n";
import type { CropRole, ImageRole } from "./types";
import { SHARED_IMAGES } from "./shared.generated";
import { asset } from "@/lib/site";

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
  label: Localized;
}

export const SHOTS: ShotSpec[] = [
  {
    role: "hero", label: { de: "Kampagne", en: "Campaign" },
    w: 1200, ratio: 0.8, scale: 1, centre: { x: 0.5, y: 0.5 },
  },
  {
    role: "angle", label: { de: "Gehäuse", en: "Case" },
    w: 1200, ratio: 0.8, scale: 0.66, centre: { x: 0.53, y: 0.44 },
  },
  {
    role: "lifestyle", label: { de: "Umgebung", en: "Setting" },
    w: 1400, ratio: 0.8, scale: 0.86, centre: { x: 0.5, y: 0.56 },
  },
  {
    role: "card", label: { de: "Karte", en: "Card" },
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

/*
 * Shared framings are cut to the same frame as the cropped ones, so a caseback
 * sits in the gallery at the size of every other view rather than breaking the
 * run. The sources are landscape, so this is a centre crop, not a fit.
 */
export const SHARED_WIDTH = 1200;
export const SHARED_RATIO = 0.8;

/*
 * What the gallery shows, in order. "lifestyle" is deliberately absent: it is
 * the wide environment frame the home and collection pages open with, and
 * repeating it inside the gallery only said the same thing twice. Those pages
 * reach it through frameImage() instead of searching a product's gallery.
 */
export const GALLERY_ORDER: CropRole[] = ["hero", "angle"];

export function shot(role: CropRole | "card") {
  const s = SHOTS.find((x) => x.role === role);
  if (!s) throw new Error(`unknown shot ${role}`);
  return s;
}

/*
 * A shared framing takes its caption from its file name, which can only be one
 * language. These are the roles the shop actually ships, translated; anything
 * else dropped into the folder keeps its file name in both, which is the
 * honest fallback for a caption nobody has written yet.
 */
const SHARED_LABELS: Record<string, Localized> = {
  caseback: { de: "Gehäuseboden", en: "Caseback" },
  "caseback-angle": { de: "Gehäuseboden schräg", en: "Caseback angle" },
};

/** Caption for any framing, cropped or shared. */
export function shotLabel(role: string, lang: Lang): string {
  const crop = SHOTS.find((s) => s.role === role);
  if (crop) return crop.label[lang];
  const known = SHARED_LABELS[role];
  if (known) return known[lang];
  return SHARED_IMAGES.find((s) => s.role === role)?.label ?? role;
}

export function shotHeight(s: ShotSpec) {
  return Math.round(s.w / s.ratio);
}

/*
 * Through asset(), because next/image only applies basePath when it is routing
 * the request through the optimiser. A static export runs unoptimized, so the
 * src is emitted verbatim and has to carry the prefix already.
 */
export function imagePath(collection: string, product: string, role: CropRole | "card") {
  return asset(`/products/${collection}/${product}/${role}.webp`);
}

/** Shared framings live beside the products, not inside each one. */
export function sharedImagePath(collection: string, role: ImageRole) {
  return asset(`/products/${collection}/_shared/${role}.webp`);
}

