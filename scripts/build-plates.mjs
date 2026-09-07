/*
 * Renders the two world plates the site sits on.
 *
 * These used to be one 7 kB raster that banded badly and read as a soft blob
 * at hero size. Rendering them here instead means the geometry is exact, the
 * gradients are computed at full bit depth before the WebP quantiser sees
 * them, and the output size is a decision rather than whatever a generator
 * happened to emit. A grain pass at the end keeps the smooth falloffs from
 * banding once they are compressed.
 *
 * The light in both plates comes from the upper left, matching the key light
 * in the campaign photographs, so the backdrops and the watches read as one
 * shoot rather than two.
 *
 *   npm run plates
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";

// ---------------------------------------------------------------- noise

/** Deterministic hash → [0,1). Same plate on every machine, every build. */
function hash2(x, y) {
  let h = Math.imul(x | 0, 374761393) ^ Math.imul(y | 0, 668265263);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

const fade = (t) => t * t * (3 - 2 * t);

function valueNoise(x, y) {
  const xi = Math.floor(x), yi = Math.floor(y);
  const xf = fade(x - xi), yf = fade(y - yi);
  const a = hash2(xi, yi), b = hash2(xi + 1, yi);
  const c = hash2(xi, yi + 1), d = hash2(xi + 1, yi + 1);
  return (a + (b - a) * xf) * (1 - yf) + (c + (d - c) * xf) * yf;
}

function fbm(x, y, octaves = 5, gain = 0.5, lac = 2.03) {
  let sum = 0, amp = 1, norm = 0, fx = x, fy = y;
  for (let o = 0; o < octaves; o++) {
    sum += amp * valueNoise(fx, fy);
    norm += amp;
    amp *= gain;
    fx *= lac; fy *= lac;
  }
  return sum / norm;
}

/** Ridged noise reads as crater rims rather than clouds. */
function ridged(x, y, octaves = 4) {
  let sum = 0, amp = 1, norm = 0, fx = x, fy = y;
  for (let o = 0; o < octaves; o++) {
    sum += amp * (1 - Math.abs(valueNoise(fx, fy) * 2 - 1));
    norm += amp;
    amp *= 0.5;
    fx *= 2.07; fy *= 2.07;
  }
  return sum / norm;
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
const smoothstep = (e0, e1, v) => {
  const t = clamp01((v - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

/** sRGB transfer, so the shading maths can stay linear. */
function encode(v) {
  const c = clamp01(v);
  return 255 * (c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
}

// ------------------------------------------------------- MILLENIUM plate

/*
 * A body so large that only the top of its limb crosses the frame, lit hard
 * from above so the surface falls away into the void within a few hundred
 * pixels. The visible strip is thin, which is the point: it reads as scale.
 */
function millenium(W, H) {
  const buf = Buffer.alloc(W * H * 3);
  const R = W * 2.2;                 // radius, in pixels
  const cx = W * 0.5;
  const cy = H * 0.62 + R;           // apex of the limb at 0.62 H

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const dx = x - cx, dy = y - cy;
      const d2 = dx * dx + dy * dy;
      const d = Math.sqrt(d2);
      let r = 0, g = 0, b = 0;

      if (d < R) {
        /*
         * The body is backlit: at this radius the surface normal barely turns
         * across the whole frame, so a Lambert term would light it flat. What
         * is actually visible is a body in its own shadow — near black, with
         * the light spilling round the edge.
         */
        const nx = dx / R, ny = dy / R;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));

        const u = (Math.atan2(nx, nz) + Math.PI) * 1.9;
        const v = Math.acos(clamp01(-ny)) * 2.8;
        const maria = fbm(u * 1.1, v * 1.1, 5);
        const rims = ridged(u * 4.6, v * 4.6, 4);
        const albedo = 0.55 + 0.30 * maria + 0.22 * Math.pow(rims, 3.0);

        // How far below the limb we are, in pixels — the only thing the
        // falloff should depend on at this scale.
        const below = (1 - d / R) * R;
        const spill = Math.exp(-below / (H * 0.028)) * 0.52   // light round the edge
                    + Math.exp(-below / (H * 0.34)) * 0.028;  // the last of it
        const lit = spill * albedo + 0.0065 * albedo;
        r = lit * 0.90; g = lit * 0.95; b = lit * 1.0;

        // The lit edge itself: a hairline, not a band.
        const edge = Math.exp(-below / (H * 0.0055));
        r += edge * 0.62; g += edge * 0.70; b += edge * 0.84;
      } else {
        // ---- sky
        const t = d / R - 1;
        // Atmosphere hugging the lit part of the limb.
        const along = clamp01((-dy / R) * 0.5 + 0.5);
        const halo = Math.exp(-t * 260) * 0.62 + Math.exp(-t * 34) * 0.085;
        const glow = halo * Math.pow(along, 1.5);
        r += glow * 0.50; g += glow * 0.60; b += glow * 0.80;

        // Shafts from the source, broken up so they are not obviously radial.
        const ang = Math.atan2(y - (cy - R) + H * 0.9, x - cx * 0.72);
        const shaft = Math.pow(clamp01(fbm(ang * 7.5, d / W * 1.6, 3) * 1.5 - 0.42), 2.2);
        const shaftFade = smoothstep(H * 0.78, 0, y) * smoothstep(0.62, 0.02, t);
        const s = shaft * shaftFade * 0.018;
        r += s * 0.72; g += s * 0.82; b += s;

        // Stars, only well clear of the glow.
        const sv = hash2(x * 7 + 13, y * 3 + 91);
        if (sv > 0.99965) {
          const mag = (sv - 0.99965) / 0.00035;
          const room = smoothstep(0.02, 0.30, t) * smoothstep(H * 0.72, 0, y);
          const sVal = (0.14 + 0.72 * mag) * room;
          r += sVal * 0.9; g += sVal * 0.94; b += sVal;
        }

        // The void the page sits on, with a breath of nebula in it.
        const neb = fbm(x / W * 2.4, y / H * 2.0, 4);
        r += 0.0045 + neb * 0.0055; g += 0.0060 + neb * 0.0075; b += 0.0098 + neb * 0.0125;
      }

      const i = (y * W + x) * 3;
      buf[i] = encode(r); buf[i + 1] = encode(g); buf[i + 2] = encode(b);
    }
  }
  return buf;
}

// ----------------------------------------------------------- TSUKI plate

/*
 * The moon low over still water: one cold source, its trail laid across the
 * surface, and a shore that stays a suggestion. Nothing here is a symbol —
 * the Japanese reading is in the restraint and the proportion, not in
 * ornament.
 */
function tsuki(W, H) {
  const buf = Buffer.alloc(W * H * 3);
  const horizon = H * 0.545;
  const mx = W * 0.615, my = H * 0.255, mr = W * 0.052;

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let r, g, b;
      const dx = x - mx, dy = y - my;
      const d = Math.hypot(dx, dy);

      if (y < horizon) {
        // ---- sky
        const t = y / horizon;
        r = 0.0022 + 0.0055 * t; g = 0.0034 + 0.0082 * t; b = 0.0062 + 0.0145 * t;

        const sv = hash2(x * 5 + 7, y * 11 + 3);
        if (sv > 0.99955) {
          const mag = (sv - 0.99955) / 0.00045;
          const room = smoothstep(mr * 6, mr * 13, d) * smoothstep(horizon, horizon * 0.25, y);
          const s = (0.10 + 0.55 * mag) * room;
          r += s * 0.92; g += s * 0.95; b += s;
        }
      } else {
        // ---- water
        const t = (y - horizon) / (H - horizon);
        r = 0.0016 + 0.0034 * t; g = 0.0025 + 0.0048 * t; b = 0.0046 + 0.0082 * t;

        /*
         * The moonglade. Perspective widens the column and stretches the
         * ripples as they approach, so the dashes get longer and sparser
         * toward the bottom of the frame.
         */
        const spread = mr * (0.85 + 7.5 * t * t);
        const off = Math.abs(x - mx) / spread;
        if (off < 1.6) {
          const scaleX = 0.016 / (0.10 + t * 1.5);
          const ripple = valueNoise(x * scaleX, (y - horizon) * 0.085 + t * 6);
          const crest = Math.pow(clamp01(ripple * 2.0 - 0.98), 1.9);
          const across = Math.exp(-off * off * 1.5);
          const away = smoothstep(1.0, 0.02, t) * 0.55 + 0.45 * Math.exp(-t * 2.1);
          const s = crest * across * away * 0.40;
          r += s * 0.78; g += s * 0.86; b += s;
        }

        // Mist sitting on the water, thickest right at the shoreline.
        const mist = Math.exp(-(((y - horizon) / (H * 0.055)) ** 2)) * (0.55 + 0.45 * fbm(x / W * 5, y / H * 5, 3));
        r += mist * 0.014; g += mist * 0.019; b += mist * 0.030;
      }

      // ---- the moon itself, drawn over whichever half it falls in
      if (d < mr * 9) {
        const bloom = Math.exp(-Math.pow(d / (mr * 1.25), 1.6)) * 0.115
                    + Math.exp(-Math.pow(d / (mr * 4.2), 1.9)) * 0.024;
        r += bloom * 0.62; g += bloom * 0.72; b += bloom * 0.92;
      }
      if (d < mr) {
        const nx = dx / mr, ny = dy / mr;
        const nz = Math.sqrt(Math.max(0, 1 - nx * nx - ny * ny));
        // Nearly full, lit a little from the left so the discs reads round.
        const lambert = clamp01(nx * -0.30 + ny * -0.22 + nz * 0.93);
        /*
         * Sampled in the projected plane with a sphere warp, not in spherical
         * coordinates: acos/atan2 put a pole right at the limb, and that
         * showed as vertical streaks across the disc.
         */
        const warp = 1 / (0.42 + 0.58 * nz);
        const px = nx * warp, py = ny * warp;
        const maria = fbm(px * 3.1 + 11.3, py * 3.1 + 4.7, 5);
        const rims = ridged(px * 9.5 + 2.9, py * 9.5 + 8.1, 4);
        const albedo = 0.58 + 0.26 * maria + 0.24 * Math.pow(rims, 2.8);
        const lit = (0.30 + 0.70 * Math.pow(lambert, 0.55)) * albedo;
        const edge = smoothstep(0.90, 1.0, d / mr);
        const face = 1 - edge * 0.35;
        r = lit * 0.90 * face; g = lit * 0.95 * face; b = lit * 1.0 * face;
      }

      const i = (y * W + x) * 3;
      buf[i] = encode(r); buf[i + 1] = encode(g); buf[i + 2] = encode(b);
    }
  }
  return buf;
}

// --------------------------------------------------------------- output

/*
 * Grain, added after encoding. Smooth falloffs over a near-black ground are
 * exactly what WebP bands on; a little uncorrelated noise gives the quantiser
 * something to dither against and costs about a kilobyte.
 */
function grain(buf, W, H, amount) {
  for (let i = 0, p = 0; i < buf.length; i += 3, p++) {
    const n = (hash2(p, p * 2 + 1) - 0.5) * amount;
    buf[i] = clamp01((buf[i] + n) / 255) * 255;
    buf[i + 1] = clamp01((buf[i + 1] + n) / 255) * 255;
    buf[i + 2] = clamp01((buf[i + 2] + n) / 255) * 255;
  }
  return buf;
}

await mkdir("public/world", { recursive: true });

const plates = [
  { name: "orbit-plate", w: 2560, h: 1160, render: millenium, grain: 3.2, q: 82 },
  { name: "still-water", w: 2560, h: 1440, render: tsuki, grain: 2.6, q: 82 },
];

for (const p of plates) {
  const raw = grain(p.render(p.w, p.h), p.w, p.h, p.grain);
  await sharp(raw, { raw: { width: p.w, height: p.h, channels: 3 } })
    .webp({ quality: p.q, effort: 6, smartSubsample: true })
    .toFile(`public/world/${p.name}.webp`);
  // A small blurred copy is what the CSS falls back to on a slow connection.
  await sharp(raw, { raw: { width: p.w, height: p.h, channels: 3 } })
    .resize({ width: 32 }).webp({ quality: 55 })
    .toFile(`public/world/${p.name}-lqip.webp`);
  console.log(p.name, `${p.w}x${p.h}`);
}
