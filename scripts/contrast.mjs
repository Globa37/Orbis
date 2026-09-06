/**
 * Gate on WCAG AA contrast for the ORBIS text tokens.
 * Every text colour must clear 4.5:1 against every surface it can sit on.
 */
import { readFileSync } from "node:fs";

const css = readFileSync(new URL("../src/app/globals.css", import.meta.url), "utf8");
const token = (name) => {
  const m = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-fA-F]{6})`));
  if (!m) throw new Error(`missing --color-${name}`);
  return m[1];
};

const lin = (c) => {
  const v = c / 255;
  return v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
};
const lum = (hex) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
};
const ratio = (a, b) => {
  const [x, y] = [lum(a), lum(b)].sort((m, n) => n - m);
  return (x + 0.05) / (y + 0.05);
};

const SURFACES = ["void", "ink", "surface", "raised"];
const TEXTS = ["text", "steel", "muted", "faint"];
const MIN = 4.5;

let failed = 0;
for (const t of TEXTS) {
  const row = SURFACES.map((s) => {
    const r = ratio(token(t), token(s));
    if (r < MIN) failed++;
    return `${s} ${r.toFixed(2)}${r < MIN ? " FAIL" : ""}`;
  });
  console.log(`  ${t.padEnd(6)} ${row.join("  ")}`);
}

if (failed) {
  console.error(`\n${failed} token pair(s) below ${MIN}:1`);
  process.exit(1);
}
console.log(`\nall text tokens clear ${MIN}:1`);
