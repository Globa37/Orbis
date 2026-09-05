import Image from "next/image";
import Link from "next/link";
import { cardImage } from "@/lib/catalog/millenium";
import { formatPrice } from "@/lib/catalog/types";
import type { Collection, Product } from "@/lib/catalog/types";

export function ProductCard({
  collection,
  product,
  priority = false,
  index,
}: {
  collection: Collection;
  product: Product;
  priority?: boolean;
  index: number;
}) {
  const card = cardImage(collection.slug, product.slug);
  const hover = product.images.find((i) => i.role === "angle") ?? product.images[0];

  return (
    <article
      className="group relative"
      style={{ ["--accent" as string]: product.accent.base, ["--accent-glow" as string]: product.accent.glow }}
    >
      <Link
        href={`/collections/${collection.slug}/${product.slug}`}
        className="u-focus block"
        aria-label={`${product.name} — ${product.subtitle}, ${formatPrice(product.priceCents)}`}
      >
        <div className="relative overflow-hidden rounded-sm bg-surface">
          {/* An accent bloom that only appears on hover — the dial colour, not a border. */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background: `radial-gradient(65% 45% at 50% 46%, ${product.accent.glow}, transparent 70%)`,
              mixBlendMode: "soft-light",
            }}
          />
          <Image
            src={card.src}
            alt={`ORBIS ${collection.name} ${product.name}. ${product.subtitle}.`}
            width={card.width}
            height={card.height}
            priority={priority}
            loading={priority ? undefined : "lazy"}
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 44vw, (max-width: 1536px) 30vw, 22vw"
            className="w-full transition-[transform,opacity] duration-[900ms] [transition-timing-function:var(--ease-orbis)] group-hover:scale-[1.03] group-hover:opacity-0"
          />
          {/* The three-quarter frame cross-fades in: the same watch, turned. */}
          <Image
            src={hover.src}
            alt=""
            aria-hidden="true"
            width={hover.width}
            height={hover.height}
            loading="lazy"
            sizes="(max-width: 640px) 86vw, (max-width: 1024px) 44vw, (max-width: 1536px) 30vw, 22vw"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-[transform,opacity] duration-[900ms] [transition-timing-function:var(--ease-orbis)] group-hover:scale-[1.03] group-hover:opacity-100"
          />
          <span className="pointer-events-none absolute left-4 top-4 z-30 text-[0.65rem] tabular-nums tracking-[0.24em] text-faint">
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>

        <div className="mt-5 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="u-eyebrow !text-[0.6rem]">{collection.name}</p>
            <h3 className="mt-1.5 font-display text-[1.75rem] leading-none">{product.name}</h3>
            <p className="mt-2 truncate text-sm text-faint">{product.subtitle}</p>
          </div>
          <p className="shrink-0 pt-4 text-sm tabular-nums text-steel">
            {formatPrice(product.priceCents)}
          </p>
        </div>

        <span className="mt-4 inline-flex items-center gap-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors duration-300 group-hover:text-text">
          Discover
          <svg width="14" height="8" viewBox="0 0 14 8" fill="none" aria-hidden="true" className="transition-transform duration-500 [transition-timing-function:var(--ease-orbis)] group-hover:translate-x-1.5">
            <path d="M0 4h12M9 1l3 3-3 3" stroke="currentColor" strokeWidth="1" />
          </svg>
        </span>
      </Link>
    </article>
  );
}
