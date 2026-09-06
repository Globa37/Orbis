/**
 * Derives the web image set from the campaign photography.
 *
 * One master photograph per reference lives in assets/campaign/. Every framing
 * is a crop of that frame, so the whole collection stays one session — which is
 * how it was shot. Nothing is re-posed here.
 *
 * The casebacks in assets/caseback/ are the exception: the back of the watch is
 * the same part on every reference, so each one is derived once into _shared/
 * rather than copied into all five product folders.
 *
 * That folder is read, not declared. Every image in it becomes a shared framing,
 * ordered by file name and labelled from it, so adding a view to the site means
 * dropping in a file and nothing else. An empty or absent folder simply yields
 * no shared framings.
 */
import { mkdirSync, existsSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import sharp from "sharp";
import { COLLECTIONS } from "../src/lib/catalog/millenium";
import { SHARED_WIDTH, SHOTS, shotHeight, type ShotSpec } from "../src/lib/catalog/shots";

const ROOT = process.cwd();
const OUT = join(ROOT, "public", "products");
const SRC = join(ROOT, "assets", "campaign");
const SHARED_SRC = join(ROOT, "assets", "caseback");

/** Finds the master file for a product, whatever extension it carries. */
function master(slug: string) {
  for (const ext of ["png", "webp", "jpg", "jpeg"]) {
    const p = join(SRC, `${slug}.${ext}`);
    if (existsSync(p)) return p;
  }
  throw new Error(`no campaign master for "${slug}" in assets/campaign/`);
}

const IMAGE_EXT = /\.(png|webp|jpe?g)$/i;

/**
 * Reads assets/caseback/ in file-name order.
 *
 * The file name is the role and, once a leading sort prefix like "02-" is
 * dropped and hyphens become spaces, the caption: "02-caseback-angle.png"
 * sorts second, is served as caseback-angle.webp and reads "Caseback angle".
 */
function sharedSources() {
  if (!existsSync(SHARED_SRC)) return [];
  return readdirSync(SHARED_SRC)
    .filter((f) => IMAGE_EXT.test(f))
    .sort()
    .map((file) => {
      const stem = file.replace(IMAGE_EXT, "");
      const role = stem.replace(/^\d+[-_]/, "");
      const words = role.replace(/[-_]+/g, " ").trim();
      return {
        path: join(SHARED_SRC, file),
        role,
        label: words.charAt(0).toUpperCase() + words.slice(1),
      };
    });
}

function cropBox(srcW: number, srcH: number, s: ShotSpec) {
  const w = Math.round(srcW * s.scale);
  const h = Math.round(w / s.ratio);
  // Clamp so a crop can never run past the edge of the master.
  const maxH = Math.min(h, srcH);
  const maxW = Math.min(w, srcW);
  const left = Math.max(0, Math.min(srcW - maxW, Math.round(srcW * s.centre.x - maxW / 2)));
  const top = Math.max(0, Math.min(srcH - maxH, Math.round(srcH * s.centre.y - maxH / 2)));
  return { left, top, width: maxW, height: maxH };
}

async function main() {
  const blur: Record<string, string> = {};
  const sharedImages: {
    role: string;
    label: string;
    width: number;
    height: number;
    blurDataURL: string;
  }[] = [];
  const shared = sharedSources();
  if (shared.length === 0) {
    process.stdout.write("  no shared framings in assets/caseback/\n");
  }

  for (const collection of COLLECTIONS) {
    for (const product of collection.products) {
      const src = master(product.slug);
      const meta = await sharp(src).metadata();
      const dir = join(OUT, collection.slug, product.slug);
      mkdirSync(dir, { recursive: true });

      for (const s of SHOTS) {
        const box = cropBox(meta.width!, meta.height!, s);
        const pipeline = sharp(src)
          .extract(box)
          .resize(s.w, shotHeight(s), { fit: "cover", kernel: "lanczos3" });

        await pipeline
          .clone()
          .webp({ quality: 84, effort: 6 })
          .toFile(join(dir, `${s.role}.webp`));

        const lqip = await pipeline
          .clone()
          .resize(16, null, { fit: "inside" })
          .blur(1.1)
          .webp({ quality: 28 })
          .toBuffer();
        blur[`${collection.slug}/${product.slug}/${s.role}`] =
          `data:image/webp;base64,${lqip.toString("base64")}`;

        process.stdout.write(`  ${collection.slug}/${product.slug}/${s.role}\n`);
      }
    }

    // Shared framings: derived once per collection, not once per reference.
    for (const s of shared) {
      const dir = join(OUT, collection.slug, "_shared");
      mkdirSync(dir, { recursive: true });

      const meta = await sharp(s.path).metadata();
      const height = Math.round((SHARED_WIDTH * meta.height!) / meta.width!);
      const pipeline = sharp(s.path).resize(SHARED_WIDTH, height, { kernel: "lanczos3" });

      await pipeline
        .clone()
        .webp({ quality: 84, effort: 6 })
        .toFile(join(dir, `${s.role}.webp`));

      const lqip = await pipeline
        .clone()
        .resize(16, null, { fit: "inside" })
        .blur(1.1)
        .webp({ quality: 28 })
        .toBuffer();

      // The same photograph serves every collection, so it is recorded once.
      if (!sharedImages.some((x) => x.role === s.role)) {
        sharedImages.push({
          role: s.role,
          label: s.label,
          width: SHARED_WIDTH,
          height,
          blurDataURL: `data:image/webp;base64,${lqip.toString("base64")}`,
        });
      }

      process.stdout.write(`  ${collection.slug}/_shared/${s.role}\n`);
    }
  }

  writeFileSync(
    join(ROOT, "src", "lib", "catalog", "shared.generated.ts"),
    `// Generated by scripts/build-assets.mts. Do not edit by hand.\n` +
      `/** Framings shared by every reference, discovered from assets/caseback/. */\n` +
      `export interface SharedImage {\n` +
      `  role: string;\n  label: string;\n  width: number;\n  height: number;\n` +
      `  blurDataURL: string;\n}\n\n` +
      `export const SHARED_IMAGES: SharedImage[] = ${JSON.stringify(sharedImages, null, 2)};\n`
  );

  const lines = Object.entries(blur)
    .map(([k, v]) => `  ${JSON.stringify(k)}: ${JSON.stringify(v)},`)
    .join("\n");
  writeFileSync(
    join(ROOT, "src", "lib", "catalog", "blur.generated.ts"),
    `// Generated by scripts/build-assets.mts. Do not edit by hand.\n` +
      `/** Low-quality inline previews, keyed by "<collection>/<product>/<role>". */\n` +
      `export const BLUR: Record<string, string> = {\n${lines}\n};\n`
  );
  console.log(
    `campaign derived from assets/campaign/, ${shared.length} shared framing(s) from assets/caseback/`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
