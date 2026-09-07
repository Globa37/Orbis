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
 */
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
      {collection.products.map((product) => (
        <li key={product.slug} className="min-w-[47%] shrink-0 snap-start sm:min-w-[29%] lg:min-w-0">
          <Link
            href={langPath(lang, `/collections/${collection.slug}/${product.slug}`)}
            className="u-focus group block rounded-sm"
          >
            {/* One shared baseline: every watch is bottom-aligned in an equal
                box, so the row reads as a lineup and not as five pictures. */}
            <div className="relative flex h-[34svh] items-end justify-center sm:h-[38svh] lg:h-[30svh] xl:h-[34svh]">
              <Image
                src={asset(`/cutouts/${product.slug}-900.webp`)}
                alt={`ORBIS ${collection.name} ${product.name}`}
                width={913}
                height={1563}
                loading="lazy"
                sizes="(max-width: 640px) 42vw, (max-width: 1024px) 27vw, 18vw"
                className="h-full w-auto max-w-full object-contain transition-transform duration-[900ms] [transition-timing-function:var(--ease-orbis)] group-hover:-translate-y-2"
              />
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-0 h-10 w-[74%] rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.6),transparent)] blur-[6px]"
              />
            </div>
            {/* The line they all stand on. */}
            <span aria-hidden="true" className="mt-4 block h-px w-full bg-line" />
            <span className="mt-4 block font-display text-lg leading-none text-text transition-colors duration-300 group-hover:text-white lg:text-xl">
              {product.name}
            </span>
            <span className="u-num mt-2 block text-[0.62rem] uppercase tracking-[0.24em] text-faint">
              {product.reference}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
