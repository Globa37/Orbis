import type { CSSProperties } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/site";
import type { Collection } from "@/lib/catalog/types";
import { path as langPath, type Lang } from "@/lib/i18n";

/*
 * The collection as one campaign frame rather than a shop grid.
 *
 * The grid higher up the page is for choosing; this is for seeing the set —
 * five references cut from their own photographs and set down on one line, so
 * the constants across the collection (case, bracelet, proportion) read at a
 * glance and only the dials differ. Same cutouts as the hero, so it costs
 * nothing extra to load.
 *
 * A cutout on a plate has one failure mode: it reads as pasted on. Three
 * things answer that here, in the order the eye notices them —
 *
 *   1. a contact shadow directly under the case, which is what says the watch
 *      is standing on something rather than floating over it;
 *   2. a mirrored copy of the same file below the line, faded and blurred, so
 *      the surface behaves like a surface;
 *   3. a bloom in the dial's own colour behind the watch, so the light in the
 *      scene appears to come off the object instead of stopping at its edge.
 *
 * All three are CSS over the existing cutout — no second render, no extra
 * bytes, and the reflection reuses the file the browser already has.
 */

/* The watch box height, written once. The reflection strip is a fraction of
 * it, and the mirrored image has to be exactly as tall as the original or the
 * two stop lining up. */
const BOX = "h-[34svh] sm:h-[38svh] lg:h-[30svh] xl:h-[34svh]";
const STRIP = "h-[7svh] sm:h-[8svh] lg:h-[6svh] xl:h-[7svh]";

/* The reflection dies out over its own height. Put the mask on the wrapper,
 * not the image: the image is flipped, and a mask on a flipped element flips
 * with it. */
const FADE: CSSProperties = {
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 78%)",
  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.55), transparent 78%)",
};

export function CollectionLineup({
  collection,
  lang,
}: {
  collection: Collection;
  lang: Lang;
}) {
  return (
    /*
     * scroll-pl matches the gutter. Without it the first snap position sits at
     * the padding edge, so the row loads already scrolled past its own inset
     * and the first watch is clipped against the screen edge.
     */
    <ul className="-mx-5 flex snap-x snap-mandatory scroll-pl-5 gap-4 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:scroll-pl-8 sm:px-8 lg:mx-0 lg:grid lg:grid-cols-5 lg:gap-6 lg:overflow-visible lg:px-0">
      {collection.products.map((product) => {
        const src = asset(`/cutouts/${product.slug}-900.webp`);
        const alt = `ORBIS ${collection.name} ${product.name}`;
        return (
          <li
            key={product.slug}
            className="min-w-[47%] shrink-0 snap-start sm:min-w-[29%] lg:min-w-0"
            style={{ ["--accent-glow" as string]: product.accent.glow }}
          >
            <Link
              href={langPath(lang, `/collections/${collection.slug}/${product.slug}`)}
              className="u-focus group block rounded-sm"
            >
              {/* One shared baseline: every watch is bottom-aligned in an equal
                  box, so the row reads as a lineup and not as five pictures. */}
              <div className={`relative flex ${BOX} items-end justify-center`}>
                {/* The dial's colour, thrown back into the scene. Always on,
                    just barely — hover only lifts it. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 opacity-25 blur-2xl transition-opacity duration-[900ms] [transition-timing-function:var(--ease-orbis)] group-hover:opacity-60"
                  style={{
                    background:
                      "radial-gradient(52% 38% at 50% 44%, var(--accent-glow), transparent 72%)",
                  }}
                />
                <Image
                  src={src}
                  alt={alt}
                  width={913}
                  height={1563}
                  loading="lazy"
                  sizes="(max-width: 640px) 42vw, (max-width: 1024px) 27vw, 18vw"
                  className="relative h-full w-auto max-w-full object-contain transition-transform duration-[900ms] [transition-timing-function:var(--ease-orbis)] group-hover:-translate-y-2"
                />
                {/* Contact shadow. Tight and dark right under the bracelet,
                    gone within a finger's width — a hard light source close
                    above, which is how the references were lit. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 h-8 w-[64%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.72),transparent)] blur-[5px]"
                />
              </div>

              {/* The surface. The same file, flipped and dimmed: positioned at
                  the top of its strip so the visible part is the bottom of the
                  watch, which is the only part a reflection would show. */}
              <div
                aria-hidden="true"
                className={`relative ${STRIP} overflow-hidden`}
                style={FADE}
              >
                <Image
                  src={src}
                  alt=""
                  width={913}
                  height={1563}
                  loading="lazy"
                  sizes="(max-width: 640px) 42vw, (max-width: 1024px) 27vw, 18vw"
                  aria-hidden="true"
                  className={`absolute left-1/2 top-0 ${BOX} w-auto max-w-none -translate-x-1/2 -scale-y-100 object-contain opacity-20 blur-[2px] transition-opacity duration-[900ms] [transition-timing-function:var(--ease-orbis)] group-hover:opacity-30`}
                />
              </div>

              {/* The line they all stand on. */}
              <span aria-hidden="true" className="mt-1 block h-px w-full bg-line" />
              <span className="mt-4 block font-display text-lg leading-none text-text transition-colors duration-300 group-hover:text-white lg:text-xl">
                {product.name}
              </span>
              <span className="u-num mt-2 block text-[0.62rem] uppercase tracking-[0.24em] text-faint">
                {product.reference}
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
