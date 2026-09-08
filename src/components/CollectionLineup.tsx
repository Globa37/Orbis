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
 * Each watch stands on a plinth. Four layers make a cutout sit in a scene
 * instead of floating over it, stacked in the order the eye reads them —
 *
 *   1. a plinth: a shallow lit ellipse at the baseline, which gives the watch
 *      a surface to stand on rather than a line to hover above;
 *   2. a contact shadow on that surface, tight and dark under the bracelet;
 *   3. a mirrored copy of the same file below it, faded and blurred;
 *   4. a bloom in the dial's own colour, so light appears to come off the
 *      object rather than stopping at its cut edge.
 *
 * Pointing at a watch lights its plinth in that dial's colour and lifts the
 * watch off it slightly. The light and the lift share one timing, so the two
 * read as a single movement rather than two effects firing at once.
 *
 * All of it is CSS over the existing cutout: no second render, no extra bytes,
 * and the reflection reuses the file the browser already has.
 */

/* The watch box height, written once. The reflection strip is a fraction of
 * it, and the mirrored image has to be exactly as tall as the original or the
 * two stop lining up. */
const BOX = "h-[34svh] sm:h-[38svh] lg:h-[30svh] xl:h-[34svh]";
const STRIP = "h-[7svh] sm:h-[8svh] lg:h-[6svh] xl:h-[7svh]";

/* One timing for every moving part, so the lift and the light travel together
 * instead of racing each other. */
const EASE = "duration-[900ms] [transition-timing-function:var(--ease-orbis)]";

/* The reflection dies out over its own height. Put the mask on the wrapper,
 * not the image: the image is flipped, and a mask on a flipped element flips
 * with it. */
const FADE: CSSProperties = {
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 78%)",
  WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,0.5), transparent 78%)",
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
            style={
              {
                "--accent-glow": product.accent.glow,
                "--accent-base": product.accent.base,
              } as CSSProperties
            }
          >
            <Link
              href={langPath(lang, `/collections/${collection.slug}/${product.slug}`)}
              className="u-focus group block rounded-sm"
            >
              {/* One shared baseline: every watch is bottom-aligned in an equal
                  box, so the row reads as a lineup and not as five pictures. */}
              <div className={`relative flex ${BOX} items-end justify-center`}>
                {/* The dial's colour thrown back into the air around the watch.
                    Always on, just barely — hover only lifts it. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-0 opacity-25 blur-2xl transition-opacity ${EASE} group-hover:opacity-60 group-focus-visible:opacity-60`}
                  style={{
                    background:
                      "radial-gradient(52% 38% at 50% 44%, var(--accent-glow), transparent 72%)",
                  }}
                />

                {/* The plinth's own light, under its surface. Off at rest, so
                    the row stays quiet until something is pointed at. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-4 left-1/2 h-16 w-[86%] -translate-x-1/2 rounded-[50%] opacity-0 blur-xl transition-opacity ${EASE} group-hover:opacity-90 group-focus-visible:opacity-90`}
                  style={{
                    background:
                      "radial-gradient(closest-side, var(--accent-glow), transparent 72%)",
                  }}
                />

                <Image
                  src={src}
                  alt={alt}
                  width={913}
                  height={1563}
                  loading="lazy"
                  sizes="(max-width: 640px) 42vw, (max-width: 1024px) 27vw, 18vw"
                  className={`relative h-full w-auto max-w-full object-contain transition-transform ${EASE} group-hover:-translate-y-2 group-focus-visible:-translate-y-2`}
                />

                {/* Contact shadow. Tight and dark right under the bracelet,
                    gone within a finger's width — a hard light source close
                    above, which is how the references were lit. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute bottom-0 h-8 w-[64%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.72),transparent)] blur-[5px]"
                />

                {/* The plinth. A shallow ellipse straddling the baseline: its
                    top half reads as the surface the watch stands on, and the
                    hairline along its leading edge catches the key light —
                    white at rest, the dial's colour on hover. */}
                <span
                  aria-hidden="true"
                  className={`pointer-events-none absolute -bottom-2 left-1/2 h-6 w-[74%] -translate-x-1/2 rounded-[50%] shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-shadow ${EASE} group-hover:shadow-[inset_0_1px_0_var(--accent-base)] group-focus-visible:shadow-[inset_0_1px_0_var(--accent-base)]`}
                  style={{
                    background:
                      "radial-gradient(closest-side, rgba(255,255,255,0.13), rgba(255,255,255,0.03) 58%, transparent)",
                  }}
                />
              </div>

              {/* The surface below the plinth. Same file, flipped and dimmed,
                  positioned at the top of its strip so the visible part is the
                  bottom of the watch — the only part a reflection would show. */}
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
                  className={`absolute left-1/2 top-0 ${BOX} w-auto max-w-none -translate-x-1/2 -scale-y-100 object-contain opacity-20 blur-[2px] transition-opacity ${EASE} group-hover:opacity-30`}
                />
              </div>

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
