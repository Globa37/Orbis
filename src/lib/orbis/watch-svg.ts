/**
 * MILLENIUM watch renderer.
 *
 * The case, bezel, chapter ring, markers, hands, crowns and bracelet are all
 * derived from a handful of superellipse parameters, so every reference in the
 * collection is the *same* watch — only the dial colourway changes. Nothing
 * about the product is redrawn per variant.
 */

import { buildOrb, spectrumFill } from "./orb";

const RAD = Math.PI / 180;
const f = (n: number) => (Math.round(n * 100) / 100).toString();

/* ---------------------------------------------------------------- geometry */

const VIEW = { w: 1000, h: 1010 };

/** Case architecture, shared by every MILLENIUM reference. */
const CASE = {
  cx: 482,
  cy: 505,
  outer: { a: 246, b: 256, n: 3.75 },
  bevel: { a: 230, b: 240, n: 3.6 },
  chapter: { a: 196, b: 204, n: 3.3 },
  markerRing: { a: 175, b: 183, n: 3.2 },
  dial: { a: 156, b: 163, n: 2.75 },
  orbRadius: 137,
};

const BRACELET = {
  half: 170,
  mid: 66,
  endHalf: 182,
  rowPitch: 54,
  rowHeight: 51,
  /** Dark seam between links, in user units. */
  seam: 4.2,
};

/** Superellipse outline: |x/a|^n + |y/b|^n = 1. */
function superellipse(cx: number, cy: number, a: number, b: number, n: number, steps = 240) {
  const pts: string[] = [];
  for (let i = 0; i < steps; i++) {
    const t = (i / steps) * 2 * Math.PI;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    const x = cx + a * Math.sign(ct) * Math.abs(ct) ** (2 / n);
    const y = cy + b * Math.sign(st) * Math.abs(st) ** (2 / n);
    pts.push(`${i === 0 ? "M" : "L"} ${f(x)},${f(y)}`);
  }
  return pts.join(" ") + " Z";
}

/** Where a ray at clock-angle `deg` (0 = 12 o'clock, clockwise) leaves the superellipse. */
function rayHit(a: number, b: number, n: number, deg: number) {
  const dx = Math.sin(deg * RAD);
  const dy = -Math.cos(deg * RAD);
  const s = 1 / ((Math.abs(dx) / a) ** n + (Math.abs(dy) / b) ** n) ** (1 / n);
  return { x: dx * s, y: dy * s };
}

/** Outward normal of the superellipse at a point, as a clock-angle in degrees. */
function normalAngle(a: number, b: number, n: number, x: number, y: number) {
  const gx = (Math.sign(x) * Math.abs(x) ** (n - 1)) / a ** n;
  const gy = (Math.sign(y) * Math.abs(y) ** (n - 1)) / b ** n;
  return Math.atan2(gx, -gy) / RAD;
}

/** Half-width of the case at a given vertical offset from its centre. */
function caseEdgeX(yOff: number) {
  const { a, b, n } = CASE.outer;
  const t = Math.min(1, Math.abs(yOff / b) ** n);
  return a * (1 - t) ** (1 / n);
}

/* -------------------------------------------------------------- colourways */

export type OrbFill = string | "spectrum";

export interface Colorway {
  dial: string;
  dialShade: string;
  dialSheen: string;
  orb: OrbFill;
  chapterRing: string;
  chapterRingShade: string;
  /** Luminous white markers and hands (dark dials) vs polished steel. */
  lightMarkers: boolean;
}

/* -------------------------------------------------------------------- defs */

function defs(id: string, c: Colorway) {
  return `
  <linearGradient id="${id}-steel" x1="0.14" y1="0" x2="0.86" y2="1">
    <stop offset="0%"   stop-color="#FEFEFE"/>
    <stop offset="6%"   stop-color="#E9ECEF"/>
    <stop offset="15%"  stop-color="#B4BBC2"/>
    <stop offset="24%"  stop-color="#F6F8F9"/>
    <stop offset="38%"  stop-color="#8F979F"/>
    <stop offset="49%"  stop-color="#E6EAED"/>
    <stop offset="60%"  stop-color="#767E86"/>
    <stop offset="72%"  stop-color="#DDE2E6"/>
    <stop offset="85%"  stop-color="#9AA2AA"/>
    <stop offset="94%"  stop-color="#F2F4F6"/>
    <stop offset="100%" stop-color="#B0B7BE"/>
  </linearGradient>
  <linearGradient id="${id}-bevel" x1="0.5" y1="0" x2="0.5" y2="1">
    <stop offset="0%"   stop-color="#8A929A"/>
    <stop offset="9%"   stop-color="#E7EBEE"/>
    <stop offset="30%"  stop-color="#C3CAD1"/>
    <stop offset="52%"  stop-color="#DCE1E5"/>
    <stop offset="74%"  stop-color="#B4BCC3"/>
    <stop offset="93%"  stop-color="#E9EDF0"/>
    <stop offset="100%" stop-color="#9199A1"/>
  </linearGradient>
  <linearGradient id="${id}-round" x1="0" y1="0.5" x2="1" y2="0.5">
    <stop offset="0%"   stop-color="#0A0C0F" stop-opacity="0.34"/>
    <stop offset="10%"  stop-color="#0A0C0F" stop-opacity="0.04"/>
    <stop offset="30%"  stop-color="#FFFFFF" stop-opacity="0.12"/>
    <stop offset="55%"  stop-color="#FFFFFF" stop-opacity="0.02"/>
    <stop offset="80%"  stop-color="#0A0C0F" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#0A0C0F" stop-opacity="0.36"/>
  </linearGradient>
  <linearGradient id="${id}-linkOuter" x1="0" y1="0.5" x2="1" y2="0.5">
    <stop offset="0%"   stop-color="#6E767E"/>
    <stop offset="18%"  stop-color="#E9ECEF"/>
    <stop offset="45%"  stop-color="#FAFBFC"/>
    <stop offset="72%"  stop-color="#C2C9CF"/>
    <stop offset="100%" stop-color="#7A828A"/>
  </linearGradient>
  <linearGradient id="${id}-linkMid" x1="0" y1="0.5" x2="1" y2="0.5">
    <stop offset="0%"   stop-color="#6C747C"/>
    <stop offset="16%"  stop-color="#A8B0B8"/>
    <stop offset="46%"  stop-color="#BEC6CD"/>
    <stop offset="70%"  stop-color="#A4ACB4"/>
    <stop offset="100%" stop-color="#6A727A"/>
  </linearGradient>
  <linearGradient id="${id}-braceletShade" x1="0" y1="0.5" x2="1" y2="0.5">
    <stop offset="0%"   stop-color="#080A0D" stop-opacity="0.55"/>
    <stop offset="12%"  stop-color="#080A0D" stop-opacity="0.05"/>
    <stop offset="50%"  stop-color="#FFFFFF" stop-opacity="0.06"/>
    <stop offset="88%"  stop-color="#080A0D" stop-opacity="0.08"/>
    <stop offset="100%" stop-color="#080A0D" stop-opacity="0.58"/>
  </linearGradient>
  <linearGradient id="${id}-hand" x1="0" y1="0" x2="1" y2="0.35">
    <stop offset="0%"   stop-color="#FFFFFF"/>
    <stop offset="50%"  stop-color="#EDF0F2"/>
    <stop offset="100%" stop-color="#BEC5CC"/>
  </linearGradient>
  <linearGradient id="${id}-handDark" x1="0" y1="0" x2="1" y2="0.35">
    <stop offset="0%"   stop-color="#A9B1B9"/>
    <stop offset="100%" stop-color="#6E767E"/>
  </linearGradient>
  <radialGradient id="${id}-crystal" cx="0.3" cy="0.16" r="0.9">
    <stop offset="0%"   stop-color="#FFFFFF" stop-opacity="0.22"/>
    <stop offset="30%"  stop-color="#FFFFFF" stop-opacity="0.05"/>
    <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0"/>
  </radialGradient>
  <linearGradient id="${id}-dial" x1="0.42" y1="0" x2="0.58" y2="1">
    <stop offset="0%"   stop-color="${c.dialShade}"/>
    <stop offset="26%"  stop-color="${c.dial}"/>
    <stop offset="54%"  stop-color="${c.dialSheen}"/>
    <stop offset="78%"  stop-color="${c.dial}"/>
    <stop offset="100%" stop-color="${c.dialShade}"/>
  </linearGradient>
  <radialGradient id="${id}-vignette" cx="0.5" cy="0.44" r="0.7">
    <stop offset="48%"  stop-color="#000" stop-opacity="0"/>
    <stop offset="100%" stop-color="#000" stop-opacity="0.24"/>
  </radialGradient>
  <linearGradient id="${id}-chapter" x1="0.15" y1="0" x2="0.85" y2="1">
    <stop offset="0%"   stop-color="${c.chapterRingShade}"/>
    <stop offset="20%"  stop-color="${c.chapterRing}"/>
    <stop offset="42%"  stop-color="${c.chapterRingShade}"/>
    <stop offset="64%"  stop-color="${c.chapterRing}"/>
    <stop offset="100%" stop-color="${c.chapterRingShade}"/>
  </linearGradient>
  <clipPath id="${id}-bevelClip">
    <path d="${superellipse(CASE.cx, CASE.cy, CASE.bevel.a, CASE.bevel.b, CASE.bevel.n)}"/>
  </clipPath>
  <clipPath id="${id}-dialClip">
    <path d="${superellipse(CASE.cx, CASE.cy, CASE.dial.a, CASE.dial.b, CASE.dial.n)}"/>
  </clipPath>
  <filter id="${id}-blur" x="-60%" y="-60%" width="220%" height="220%">
    <feGaussianBlur stdDeviation="4.5"/>
  </filter>`;
}

/* ------------------------------------------------------------------ pieces */

/** Twelve applied markers: slim batons, with an arrowhead at 12 and 6. */
function markers(id: string) {
  const { a, b, n } = CASE.markerRing;
  const out: string[] = [];

  for (let h = 0; h < 12; h++) {
    const p = rayHit(a, b, n, h * 30);
    const rot = normalAngle(a, b, n, p.x, p.y);
    const x = CASE.cx + p.x;
    const y = CASE.cy + p.y;
    const arrow = h === 0 || h === 6;
    const L = arrow ? 35 : 33;
    const w = arrow ? 19 : 11;

    const body = arrow
      ? `<path d="M 0,${L / 2} L ${w / 2},${-L / 2} L ${-w / 2},${-L / 2} Z"/>`
      : `<rect x="${-w / 2}" y="${-L / 2}" width="${w}" height="${L}" rx="1.4"/>`;
    const facet = arrow
      ? `<path d="M 0,${L / 2} L ${w / 2},${-L / 2} L 0,${-L / 2} Z" fill="#0B0E12" opacity="0.22"/>`
      : `<rect x="0" y="${-L / 2}" width="${w / 2}" height="${L}" fill="#0B0E12" opacity="0.20"/>`;

    out.push(
      `<g transform="translate(${f(x)},${f(y)}) rotate(${f(rot)})">
         <g transform="translate(1.4,2)" fill="#000" opacity="0.36">${body}</g>
         <g fill="url(#${id}-hand)">${body}</g>
         ${facet}
       </g>`
    );
  }
  return out.join("\n");
}

/** Faceted dauphine hands, set to 2:06. */
function hands(id: string) {
  const shape = (len: number, w: number, tail: number) => {
    const sh = -len * 0.7;
    return {
      full: `M 0,${-len} L ${w / 2},${sh} L ${w * 0.4},${tail} L ${-w * 0.4},${tail} L ${-w / 2},${sh} Z`,
      right: `M 0,${-len} L ${w / 2},${sh} L ${w * 0.4},${tail} L 0,${tail} Z`,
    };
  };
  const hand = (len: number, w: number, tail: number, deg: number) => {
    const s = shape(len, w, tail);
    return `<g transform="translate(${CASE.cx},${CASE.cy}) rotate(${deg})">
      <path d="${s.full}" fill="url(#${id}-hand)"/>
      <path d="${s.right}" fill="url(#${id}-handDark)"/>
      <path d="${s.full}" fill="none" stroke="#5A626A" stroke-width="1.1" stroke-opacity="0.5"/>
    </g>`;
  };
  const shadow = (len: number, w: number, tail: number, deg: number) =>
    `<g transform="translate(${CASE.cx},${CASE.cy}) rotate(${deg})"><path d="${shape(len, w, tail).full}" fill="#000"/></g>`;

  return `
  <g opacity="0.30" transform="translate(4,6)">
    ${shadow(101, 31, 15, 63)}
    ${shadow(146, 26, 15, 36)}
  </g>
  ${hand(101, 31, 15, 63)}
  ${hand(146, 26, 15, 36)}
  <circle cx="${CASE.cx}" cy="${CASE.cy}" r="10" fill="url(#${id}-hand)"/>
  <circle cx="${CASE.cx}" cy="${CASE.cy}" r="5.6" fill="#181B1F"/>
  <circle cx="${CASE.cx}" cy="${CASE.cy}" r="2.2" fill="#9AA2AA"/>`;
}

/** The two crowns on the right flank: a pusher-crown at 2, a fluted crown at 4. */
function crowns(id: string) {
  const crown = (yOff: number, h: number, reach: number, stem: number) => {
    const x0 = CASE.cx + caseEdgeX(yOff) - 14;
    const y = CASE.cy + yOff;
    const capX = x0 + stem;
    const capW = reach - stem;
    const flutes: string[] = [];
    for (let i = 1; i < 8; i++) {
      const fx = capX + (capW * i) / 8;
      flutes.push(
        `<line x1="${f(fx)}" y1="${f(y - h / 2 + 5)}" x2="${f(fx)}" y2="${f(y + h / 2 - 5)}" stroke="#4E565E" stroke-width="1.7" stroke-opacity="0.45"/>`
      );
    }
    return `<g>
      <rect x="${f(x0)}" y="${f(y - h * 0.3)}" width="${f(stem + 8)}" height="${f(h * 0.6)}" rx="3" fill="url(#${id}-linkOuter)"/>
      <rect x="${f(capX)}" y="${f(y - h / 2)}" width="${f(capW)}" height="${f(h)}" rx="${f(Math.min(9, h / 3))}" fill="url(#${id}-linkOuter)"/>
      ${flutes.join("")}
      <rect x="${f(capX)}" y="${f(y - h / 2)}" width="${f(capW)}" height="${f(h)}" rx="${f(Math.min(9, h / 3))}" fill="none" stroke="#616970" stroke-width="1.3" stroke-opacity="0.65"/>
      <rect x="${f(capX)}" y="${f(y - h / 2)}" width="${f(capW)}" height="${f(h * 0.28)}" rx="4" fill="#FFF" opacity="0.28"/>
    </g>`;
  };
  return crown(-132, 48, 64, 14) + crown(12, 76, 84, 16);
}

/** Three-link bracelet running off the top and bottom of the frame. */
function bracelet(id: string) {
  const { half, mid, endHalf, rowPitch, rowHeight, seam } = BRACELET;
  const cx = CASE.cx;

  /** One row of three links. Columns are separated by seams; rows only by a hairline. */
  const row = (y: number, h: number, hw: number, mw: number) => {
    const link = (x: number, w: number, fill: string) => `
      <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="4" fill="${fill}"/>
      <rect x="${f(x)}" y="${f(y)}" width="${f(w)}" height="1.4" rx="0.7" fill="#FFFFFF" opacity="0.34"/>
      <rect x="${f(x)}" y="${f(y + h - 1.4)}" width="${f(w)}" height="1.4" rx="0.7" fill="#0E1218" opacity="0.42"/>`;
    return `<g>
      ${link(cx - hw, hw - mw - seam / 2, `url(#${id}-linkOuter)`)}
      ${link(cx + mw + seam / 2, hw - mw - seam / 2, `url(#${id}-linkOuter)`)}
      ${link(cx - mw + seam / 2, mw * 2 - seam, `url(#${id}-linkMid)`)}
    </g>`;
  };

  const runs: string[] = [];
  const push = (y: number, hw: number, mw: number, h = rowHeight) => runs.push(row(y, h, hw, mw));

  for (let y = CASE.cy - 250 - rowPitch; y > -rowHeight - 10; y -= rowPitch) push(y, half, mid);
  for (let y = CASE.cy + 250; y < VIEW.h + 10; y += rowPitch) push(y, half, mid);

  // A single dark backing makes every seam read without banding the rows.
  const backing = `
    <rect x="${f(cx - half)}" y="-10" width="${f(half * 2)}" height="${f(CASE.cy - 190)}" fill="#2A3038"/>
    <rect x="${f(cx - half)}" y="${f(CASE.cy + 190)}" width="${f(half * 2)}" height="${f(VIEW.h)}" fill="#2A3038"/>
    <rect x="${f(cx - endHalf)}" y="${f(CASE.cy - 250 - 52)}" width="${f(endHalf * 2)}" height="50" rx="5" fill="#2A3038"/>
    <rect x="${f(cx - endHalf)}" y="${f(CASE.cy + 202)}" width="${f(endHalf * 2)}" height="50" rx="5" fill="#2A3038"/>`;

  // End links seat the bracelet into the case and are a touch wider.
  const ends = row(CASE.cy - 250 - 50, 46, endHalf, mid + 8) + row(CASE.cy + 204, 46, endHalf, mid + 8);

  const shade = `
    <rect x="${f(cx - half)}" y="-10" width="${f(half * 2)}" height="${f(CASE.cy - 190)}" fill="url(#${id}-braceletShade)"/>
    <rect x="${f(cx - half)}" y="${f(CASE.cy + 190)}" width="${f(half * 2)}" height="${f(VIEW.h)}" fill="url(#${id}-braceletShade)"/>`;

  return backing + runs.join("") + ends + shade;
}

/** The end link caps that sit over the case at 12 and 6. */
function caseEndLinks(id: string) {
  const w = 236;
  const h = 46;
  const cap = (y: number) => `
    <g>
      <rect x="${f(CASE.cx - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="7" fill="url(#${id}-linkOuter)"/>
      <rect x="${f(CASE.cx - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="7" fill="url(#${id}-braceletShade)"/>
      <rect x="${f(CASE.cx - w / 2)}" y="${f(y)}" width="${f(w)}" height="${f(h)}" rx="7" fill="none" stroke="#5A626A" stroke-width="1.3" stroke-opacity="0.55"/>
    </g>`;
  return cap(CASE.cy - CASE.outer.b - 14) + cap(CASE.cy + CASE.outer.b - h + 14);
}

/* ------------------------------------------------------------------ public */

export interface RenderOptions {
  /** Unique prefix so several watches can share one page without id clashes. */
  id: string;
}

export function renderWatchSVG(c: Colorway, opts: RenderOptions): string {
  const { id } = opts;

  const orb = buildOrb(CASE.cx, CASE.cy, CASE.orbRadius)
    .map((cell) => `<path d="${cell.d}" fill="${c.orb === "spectrum" ? spectrumFill(cell.lat) : c.orb}"/>`)
    .join("");

  // Polished steel picks up four dark reflections on the bevel's corners.
  const reflections = [42, 138, 222, 318]
    .map((deg) => {
      const p = rayHit(CASE.bevel.a, CASE.bevel.b, CASE.bevel.n, deg);
      const x = CASE.cx + p.x * 0.9;
      const y = CASE.cy + p.y * 0.9;
      return `<ellipse cx="${f(x)}" cy="${f(y)}" rx="26" ry="10" transform="rotate(${f(deg + 90)} ${f(x)} ${f(y)})" fill="#070910" opacity="0.72"/>`;
    })
    .join("");

  const outerPath = superellipse(CASE.cx, CASE.cy, CASE.outer.a, CASE.outer.b, CASE.outer.n);
  const bevelPath = superellipse(CASE.cx, CASE.cy, CASE.bevel.a, CASE.bevel.b, CASE.bevel.n);
  const chapterPath = superellipse(CASE.cx, CASE.cy, CASE.chapter.a, CASE.chapter.b, CASE.chapter.n);
  const dialPath = superellipse(CASE.cx, CASE.cy, CASE.dial.a, CASE.dial.b, CASE.dial.n);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW.w} ${VIEW.h}" width="${VIEW.w}" height="${VIEW.h}" role="img">
  <defs>${defs(id, c)}</defs>

  <g>${bracelet(id)}</g>
  <g>${crowns(id)}</g>

  <g>
    <path d="${outerPath}" fill="url(#${id}-steel)"/>
    <path d="${outerPath}" fill="url(#${id}-round)"/>
    <path d="${outerPath}" fill="none" stroke="#FFFFFF" stroke-opacity="0.55" stroke-width="1.6"/>

    <path d="${bevelPath}" fill="url(#${id}-bevel)"/>
    <g clip-path="url(#${id}-bevelClip)" filter="url(#${id}-blur)">${reflections}</g>
    <path d="${bevelPath}" fill="none" stroke="#2B3138" stroke-opacity="0.5" stroke-width="1.4"/>

    <path d="${chapterPath}" fill="url(#${id}-chapter)"/>
    <path d="${chapterPath}" fill="none" stroke="#0B0E12" stroke-opacity="0.4" stroke-width="2.2"/>

    ${markers(id)}

    <path d="${dialPath}" fill="url(#${id}-dial)"/>
    <g clip-path="url(#${id}-dialClip)">${orb}</g>
    <path d="${dialPath}" fill="url(#${id}-vignette)"/>
    <path d="${dialPath}" fill="none" stroke="#0B0E12" stroke-opacity="0.26" stroke-width="2"/>

    ${hands(id)}

    <path d="${superellipse(CASE.cx, CASE.cy, CASE.bevel.a - 3, CASE.bevel.b - 3, CASE.bevel.n)}" fill="url(#${id}-crystal)"/>
  </g>

  <g>${caseEndLinks(id)}
  </g>
</svg>`;
}

/** The bare ORBIS orb, for the logotype. */
export function renderOrbMark(size = 100, fill = "currentColor"): string {
  const cells = buildOrb(size / 2, size / 2, size * 0.47);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" aria-hidden="true" focusable="false">${cells
    .map((c) => `<path d="${c.d}" fill="${fill}"/>`)
    .join("")}</svg>`;
}

export { CASE, VIEW, BRACELET, superellipse, rayHit, caseEdgeX };
