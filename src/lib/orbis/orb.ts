/**
 * The ORBIS mark.
 *
 * An orthographic projection of a sphere, drawn as a set of thick meridian
 * bands crossed by a solid equatorial band. Each meridian band is subdivided
 * by parallels into cells, which produces the mark's characteristic grid.
 *
 * Everything is derived from the sphere maths, so the mark is identical at any
 * size and can be re-tinted per colourway without ever being redrawn by hand.
 */

const RAD = Math.PI / 180;

export interface OrbGeometry {
  /** Centre longitudes of the meridian bands, in degrees. */
  meridians: number[];
  /** Angular half-width of each meridian band, in degrees. */
  meridianHalfWidth: number;
  /** Bands stop short of the poles, leaving the orb open at top and bottom. */
  latClip: number;
  /** Latitude height of one cell. */
  cellStep: number;
  /** Gap between two stacked cells, in degrees of latitude. */
  cellGap: number;
  /** Half-height of the solid equatorial band. */
  equatorHalfWidth: number;
  /** The equatorial band stops short of the limb. */
  lonClip: number;
}

export const ORB_GEOMETRY: OrbGeometry = {
  meridians: [-70, -25, 25, 70],
  meridianHalfWidth: 10.5,
  latClip: 77,
  cellStep: 11.6,
  cellGap: 2.5,
  equatorHalfWidth: 8.5,
  lonClip: 85,
};

export interface OrbCell {
  d: string;
  /** Latitude at the centre of the cell — drives the spectrum colourway. */
  lat: number;
  /** True for the single solid equatorial band. */
  equator: boolean;
}

interface Projector {
  (lat: number, lon: number): [number, number];
}

function makeProjector(cx: number, cy: number, r: number): Projector {
  return (lat, lon) => [
    cx + r * Math.cos(lat * RAD) * Math.sin(lon * RAD),
    cy - r * Math.sin(lat * RAD),
  ];
}

const fmt = (n: number) => (Math.round(n * 100) / 100).toString();

/** Samples an arc of constant longitude (a meridian edge). */
function meridianEdge(p: Projector, lon: number, latA: number, latB: number, steps = 5) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) pts.push(p(latA + ((latB - latA) * i) / steps, lon));
  return pts;
}

/** Samples an arc of constant latitude (a parallel). */
function parallelEdge(p: Projector, lat: number, lonA: number, lonB: number, steps = 8) {
  const pts: [number, number][] = [];
  for (let i = 0; i <= steps; i++) pts.push(p(lat, lonA + ((lonB - lonA) * i) / steps));
  return pts;
}

function toPath(rings: [number, number][][]): string {
  return rings
    .map((pts, i) => {
      const head = i === 0 ? `M ${fmt(pts[0][0])},${fmt(pts[0][1])}` : `L ${fmt(pts[0][0])},${fmt(pts[0][1])}`;
      const rest = pts.slice(1).map(([x, y]) => `L ${fmt(x)},${fmt(y)}`).join(" ");
      return `${head} ${rest}`;
    })
    .join(" ") + " Z";
}

/**
 * Builds every cell of the mark for a sphere of radius `r` centred at (cx, cy).
 */
export function buildOrb(cx: number, cy: number, r: number, g: OrbGeometry = ORB_GEOMETRY): OrbCell[] {
  const p = makeProjector(cx, cy, r);
  const cells: OrbCell[] = [];

  for (const lon0 of g.meridians) {
    const west = lon0 - g.meridianHalfWidth;
    const east = lon0 + g.meridianHalfWidth;

    for (let lat = -g.latClip; lat < g.latClip - 1; lat += g.cellStep) {
      const latA = lat;
      const latB = Math.min(lat + g.cellStep - g.cellGap, g.latClip);
      // The equatorial band is drawn solid, so skip cells it would swallow.
      if (latB < -g.equatorHalfWidth || latA > g.equatorHalfWidth) {
        cells.push({
          d: toPath([
            meridianEdge(p, west, latA, latB),
            parallelEdge(p, latB, west, east, 3),
            meridianEdge(p, east, latB, latA),
            parallelEdge(p, latA, east, west, 3),
          ]),
          lat: (latA + latB) / 2,
          equator: false,
        });
      }
    }
  }

  cells.push({
    d: toPath([
      parallelEdge(p, g.equatorHalfWidth, -g.lonClip, g.lonClip, 20),
      meridianEdge(p, g.lonClip, g.equatorHalfWidth, -g.equatorHalfWidth, 4),
      parallelEdge(p, -g.equatorHalfWidth, g.lonClip, -g.lonClip, 20),
      meridianEdge(p, -g.lonClip, -g.equatorHalfWidth, g.equatorHalfWidth, 4),
    ]),
    lat: 0,
    equator: true,
  });

  return cells;
}

/** The spectrum colourway grades the orb by latitude. */
export function spectrumFill(lat: number): string {
  if (lat > 42) return "#B93A2E";
  if (lat > 14) return "#C0432F";
  if (lat > -14) return "#D9A441";
  if (lat > -42) return "#2E7D46";
  return "#2F5FA8";
}
