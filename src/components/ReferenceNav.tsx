import Link from "next/link";
import type { Collection, Product } from "@/lib/catalog/types";

function Side({
  collectionSlug,
  product,
  dir,
}: {
  collectionSlug: string;
  product: Product;
  dir: "prev" | "next";
}) {
  const next = dir === "next";
  return (
    <Link
      href={`/collections/${collectionSlug}/${product.slug}`}
      rel={next ? "next" : "prev"}
      className={`u-focus group flex min-w-0 flex-1 flex-col gap-1 py-6 sm:py-8 ${
        next ? "sm:items-end sm:text-right" : "items-start"
      }`}
    >
      <span className="u-eyebrow !text-[0.6rem]">{next ? "Next" : "Previous"} reference</span>
      <span className="flex min-w-0 items-center gap-2.5 font-display text-2xl transition-colors duration-300 group-hover:text-steel sm:gap-3 sm:text-3xl lg:text-4xl">
        {!next && (
          <svg
            width="20"
            height="8"
            viewBox="0 0 20 8"
            fill="none"
            aria-hidden="true"
            className="shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-orbis)] group-hover:-translate-x-2"
          >
            <path d="M20 4H2M5 1L2 4l3 3" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}
        <span className="truncate">{product.name}</span>
        {next && (
          <svg
            width="20"
            height="8"
            viewBox="0 0 20 8"
            fill="none"
            aria-hidden="true"
            className="shrink-0 transition-transform duration-500 [transition-timing-function:var(--ease-orbis)] group-hover:translate-x-2"
          >
            <path d="M0 4h18M15 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
          </svg>
        )}
      </span>
    </Link>
  );
}

/** Previous and next reference, so the collection can be walked in order. */
export function ReferenceNav({
  collection,
  current,
}: {
  collection: Collection;
  current: Product;
}) {
  const i = collection.products.findIndex((p) => p.slug === current.slug);
  const prev = collection.products[(i - 1 + collection.products.length) % collection.products.length];
  const next = collection.products[(i + 1) % collection.products.length];

  return (
    <nav
      aria-label="Collection references"
      className="mx-auto flex max-w-[110rem] flex-col items-stretch border-t border-line px-5 sm:flex-row sm:gap-6 sm:px-8 lg:px-12"
    >
      <Side collectionSlug={collection.slug} product={prev} dir="prev" />
      <span className="h-px w-full bg-line sm:h-auto sm:w-px" aria-hidden="true" />
      <Side collectionSlug={collection.slug} product={next} dir="next" />
    </nav>
  );
}
