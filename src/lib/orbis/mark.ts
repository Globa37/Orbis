/**
 * The ORBIS mark in outline.
 *
 * Where orb.ts builds the filled, cell-divided sphere used on the dial itself,
 * this is the drawn mark: a circle, one meridian ring, the equator, and the
 * crown stem sitting on top of the pole. It is the form the mark takes when it
 * has to survive at swatch size, where the dial's grid collapses into mush.
 *
 * Proportions are taken off the supplied artwork and expressed as fractions of
 * the sphere radius, so the mark is identical at any size.
 */

/** Half-width of the meridian ring, as a fraction of the radius. */
const MERIDIAN_RATIO = 0.41;

/** The crown stem, as fractions of the radius. */
const STEM_WIDTH_RATIO = 0.17;
const STEM_HEIGHT_RATIO = 0.28;

/** How far the stem's foot reaches inside the circle, so the two never gap. */
const STEM_OVERLAP_RATIO = 0.06;

/** Stroke weight of the drawn lines, as a fraction of the radius. */
export const MARK_STROKE_RATIO = 0.041;

export interface MarkGeometry {
  circle: { cx: number; cy: number; r: number };
  /** The single meridian, seen as an ellipse in orthographic projection. */
  meridian: { cx: number; cy: number; rx: number; ry: number };
  equator: { x1: number; x2: number; y: number };
  stem: { x: number; y: number; width: number; height: number };
  strokeWidth: number;
}

/** Builds the mark around a sphere of radius `r` centred on (cx, cy). */
export function buildMark(cx: number, cy: number, r: number): MarkGeometry {
  const stemWidth = r * STEM_WIDTH_RATIO;
  const stemHeight = r * STEM_HEIGHT_RATIO;
  const stemFoot = cy - r + r * STEM_OVERLAP_RATIO;

  return {
    circle: { cx, cy, r },
    meridian: { cx, cy, rx: r * MERIDIAN_RATIO, ry: r },
    equator: { x1: cx - r, x2: cx + r, y: cy },
    stem: {
      x: cx - stemWidth / 2,
      y: stemFoot - stemHeight,
      width: stemWidth,
      height: stemHeight,
    },
    strokeWidth: r * MARK_STROKE_RATIO,
  };
}

/**
 * Vertical extent of the mark including the stem, which reaches above the
 * sphere. Callers use it to centre the whole mark rather than just the circle.
 */
export function markTop(cy: number, r: number): number {
  return cy - r + r * STEM_OVERLAP_RATIO - r * STEM_HEIGHT_RATIO;
}
