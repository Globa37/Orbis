/*
 * Turns the campaign photographs into transparent cutouts.
 *
 * The alpha came from Higgsfield's background remover, which works on a
 * 1532x2048 copy; the masks are stored cropped to the watch's bounding box in
 * that space. Scaling the mask up and applying it to the untouched original
 * keeps every watch pixel exactly as photographed — the mask decides what is
 * kept, never what it looks like.
 */
import sharp from "sharp";
import { mkdir } from "node:fs/promises";
import { existsSync } from "node:fs";

const MASK_W = 1532, MASK_H = 2048;
const BBOX = {
  onyx:    [387, 412, 1182, 1773],
  lagoon:  [428, 466, 1132, 1688],
  chrome:  [409, 381, 1175, 1686],
  blush:   [425, 508, 1160, 1632],
  solaris: [422, 411, 1147, 1674],
};
const SRC = {
  onyx: "assets/campaign/onyx.png",
  lagoon: "assets/campaign/lagoon.png",
  chrome: "assets/campaign/chrome.png",
  blush: "assets/campaign/blush.png",
  solaris: "assets/campaign/solaris.webp",
};

await mkdir("public/cutouts", { recursive: true });

for (const [name, [l, t, r, b]] of Object.entries(BBOX)) {
  const src = sharp(SRC[name]);
  const { width, height } = await src.metadata();
  const sx = width / MASK_W, sy = height / MASK_H;
  // The mask is a crop; put it back into a full-frame alpha channel first.
  const left = Math.round(l * sx), top = Math.round(t * sy);
  const w = Math.round((r - l) * sx), h = Math.round((b - t) * sy);

  const maskCrop = await sharp(`assets/cutouts/k_${name}.webp`)
    .resize(w, h, { fit: "fill", kernel: "lanczos3" })
    .toColourspace("b-w").raw().toBuffer();

  const alpha = Buffer.alloc(width * height, 0);
  for (let y = 0; y < h; y++) {
    maskCrop.copy(alpha, (top + y) * width + left, y * w, (y + 1) * w);
  }

  const rgb = await sharp(SRC[name]).removeAlpha().raw().toBuffer();
  const rgba = Buffer.alloc(width * height * 4);
  for (let i = 0, j = 0; i < width * height; i++) {
    rgba[j++] = rgb[i * 3]; rgba[j++] = rgb[i * 3 + 1]; rgba[j++] = rgb[i * 3 + 2];
    rgba[j++] = alpha[i];
  }

  // Trim to the watch itself so layouts can size it without hunting for edges.
  const cut = sharp(rgba, { raw: { width, height, channels: 4 } })
    .extract({ left, top, width: w, height: h });

  for (const px of [1400, 900, 560]) {
    await cut.clone().resize({ width: px })
      .webp({ quality: 88, alphaQuality: 92, effort: 6 })
      .toFile(`public/cutouts/${name}-${px}.webp`);
  }
  console.log(name, `${w}x${h}`);
}

/*
 * The group frame.
 *
 * All five references on one slab under one light — the only photograph in the
 * set that shows the collection rather than a reference, so it is the one the
 * world band opens on. Nothing is cut out of it: it is used as shot.
 */
const GROUP = "assets/campaign/kollektionsbild.png";
if (existsSync(GROUP)) {
  const src = sharp(GROUP);
  const { width, height } = await src.metadata();
  for (const px of [880, 640, 440]) {
    await src.clone().resize({ width: px })
      .webp({ quality: 86, effort: 6 })
      .toFile(`public/products/millenium/collection-${px}.webp`);
  }
  // The placeholder the page shows while the frame is still arriving.
  const lqip = await src.clone().resize({ width: 20 }).webp({ quality: 40 }).toBuffer();
  console.log("collection frame", `${width}x${height}`, "lqip", `data:image/webp;base64,${lqip.toString("base64")}`.length, "chars");
  await sharp(await src.clone().resize({ width: 20 }).webp({ quality: 40 }).toBuffer())
    .toFile("public/products/millenium/collection-lqip.webp");
}
