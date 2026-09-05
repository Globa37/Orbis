/**
 * Renders the MILLENIUM campaign.
 *
 * Every shot is the same vector watch photographed into the same ORBIS plate,
 * so the whole collection reads as one session. Adding a collection means
 * adding data — nothing here is per-product.
 */
import { mkdirSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { chromium } from "playwright";
import { renderWatchSVG, CASE, VIEW } from "../src/lib/orbis/watch-svg";
import { COLLECTIONS } from "../src/lib/catalog/millenium";
import { SHOTS, type ShotSpec } from "../src/lib/catalog/shots";

const CHROME = "/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const ROOT = process.cwd();
const OUT = join(ROOT, "public", "products");
const PLATE = join(ROOT, "public", "world", "orbit-plate.webp");
const SCALE = 2;


/** The case occupies this fraction of the SVG's own height. */
const CASE_RATIO = (CASE.outer.b * 2) / VIEW.h;

function page(svg: string, s: ShotSpec, plateDataUri: string) {
  const svgH = (s.h * s.fill) / CASE_RATIO;
  const svgW = (svgH * VIEW.w) / VIEW.h;
  // Where the case centre sits inside the scaled SVG.
  const cx = (CASE.cx / VIEW.w) * svgW;
  const cy = (CASE.cy / VIEW.h) * svgH;
  const left = s.focus.x * s.w - cx;
  const top = s.focus.y * s.h - cy;
  const transform = s.rotate
    ? `perspective(${s.h * 1.5}px) rotateY(${s.rotate.y}deg) rotateX(${s.rotate.x}deg)`
    : "none";

  return `<!doctype html><meta charset="utf-8"><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:${s.w}px;height:${s.h}px;overflow:hidden;background:#05070a}
  .frame{position:relative;width:${s.w}px;height:${s.h}px;overflow:hidden;isolation:isolate}
  .plate{position:absolute;inset:-12%;background-image:url('${plateDataUri}');
    background-size:cover;background-position:${s.plate.pos};
    filter:blur(${s.plate.blur}px) saturate(0.8) brightness(0.72);
    opacity:${s.plate.opacity};transform:scale(${s.plate.scale})}
  .key{position:absolute;inset:0;background:
    radial-gradient(52% 38% at 33% 20%, rgba(150,178,205,0.13), transparent 64%),
    radial-gradient(70% 52% at 50% ${s.focus.y * 100}%, rgba(118,145,172,0.09), transparent 72%)}
  /* Every frame dissolves into the page ground so nothing reads as a pasted box. */
  .vig{position:absolute;inset:0;background:
    radial-gradient(102% 72% at 50% ${s.focus.y * 100}%, transparent 16%, rgba(5,7,10,0.97) 100%),
    linear-gradient(to bottom, #05070a 0%, rgba(5,7,10,0.35) 11%, transparent 34%, transparent 60%, rgba(5,7,10,0.5) 84%, #05070a 100%),
    linear-gradient(to right, #05070a 0%, rgba(5,7,10,0.3) 6%, transparent 20%, transparent 80%, rgba(5,7,10,0.3) 94%, #05070a 100%)}
  .shadow{position:absolute;left:50%;top:${(s.focus.y + s.fill * 0.52) * 100}%;
    width:${svgW * 0.5}px;height:${svgH * 0.06}px;transform:translate(-50%,-50%);
    background:radial-gradient(closest-side, rgba(0,0,0,0.85), transparent 78%);
    filter:blur(${Math.round(s.h * 0.02)}px);opacity:${s.shadow}}
  .stage{position:absolute;left:${left}px;top:${top}px;width:${svgW}px;height:${svgH}px;
    transform:${transform};transform-style:preserve-3d}
  .stage svg{width:100%;height:100%;display:block;
    filter:drop-shadow(0 ${Math.round(s.h * 0.012)}px ${Math.round(s.h * 0.03)}px rgba(0,0,0,0.7))}
  .refl{position:absolute;left:${left}px;top:${top + svgH}px;width:${svgW}px;height:${svgH * 0.34}px;
    transform:scaleY(-1);transform-origin:top;overflow:hidden;opacity:0.13;
    -webkit-mask-image:linear-gradient(to top, transparent 4%, #000 96%)}
  .refl svg{width:100%;height:${svgH}px;display:block}
  .grain{position:absolute;inset:0;opacity:0.14;mix-blend-mode:overlay;
    background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.55'/%3E%3C/svg%3E")}
  </style>
  <div class="frame">
    <div class="plate"></div>
    <div class="key"></div>
    ${s.shadow ? '<div class="shadow"></div>' : ""}
    ${s.reflection ? `<div class="refl">${svg}</div>` : ""}
    <div class="stage">${svg}</div>
    <div class="vig"></div>
    <div class="grain"></div>
  </div>`;
}

async function main() {
  if (!existsSync(PLATE)) throw new Error(`missing ORBIS plate at ${PLATE}`);
  const plateDataUri = `data:image/webp;base64,${readFileSync(PLATE).toString("base64")}`;

  const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
  const manifest: Record<string, Record<string, { src: string; width: number; height: number }>> = {};
  /** Tiny inline previews so a frame never pops in from nothing. */
  const blur: Record<string, string> = {};

  for (const collection of COLLECTIONS) {
    for (const product of collection.products) {
      const dir = join(OUT, collection.slug, product.slug);
      mkdirSync(dir, { recursive: true });
      const svg = renderWatchSVG(product.colorway, { id: `w-${product.slug}` });
      manifest[`${collection.slug}/${product.slug}`] = {};

      for (const shot of SHOTS) {
        const tab = await browser.newPage({
          viewport: { width: shot.w, height: shot.h },
          deviceScaleFactor: SCALE,
        });
        await tab.setContent(page(svg, shot, plateDataUri), { waitUntil: "load" });
        const png = await tab.screenshot({ type: "png" });
        await tab.close();

        const file = join(dir, `${shot.role}.webp`);
        const resized = sharp(png).resize(shot.w, shot.h);
        await resized.clone().webp({ quality: 82, effort: 6 }).toFile(file);

        const lqip = await resized
          .clone()
          .resize(16, null, { fit: "inside" })
          .blur(1.1)
          .webp({ quality: 28 })
          .toBuffer();
        blur[`${collection.slug}/${product.slug}/${shot.role}`] =
          `data:image/webp;base64,${lqip.toString("base64")}`;
        manifest[`${collection.slug}/${product.slug}`][shot.role] = {
          src: `/products/${collection.slug}/${product.slug}/${shot.role}.webp`,
          width: shot.w,
          height: shot.h,
        };
        process.stdout.write(`  ${collection.slug}/${product.slug}/${shot.role}\n`);
      }
    }
  }

  await browser.close();
  writeFileSync(join(OUT, "manifest.json"), JSON.stringify(manifest, null, 2));

  // Generated, not hand-maintained: regenerating the campaign regenerates these.
  const lines = Object.entries(blur)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join("\n");
  writeFileSync(
    join(ROOT, "src", "lib", "catalog", "blur.generated.ts"),
    `// Generated by scripts/build-assets.mts. Do not edit by hand.\n` +
      `/** Low-quality inline previews, keyed by "<collection>/<product>/<role>". */\n` +
      `export const BLUR: Record<string, string> = {\n${lines}\n};\n`
  );
  console.log("campaign rendered");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
