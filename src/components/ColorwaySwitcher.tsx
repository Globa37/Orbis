import Link from "next/link";
import { DialSwatch } from "./DialSwatch";
import type { Collection, Product } from "@/lib/catalog/types";

/**
 * Every dial in the collection, selectable from the product page. Each
 * reference keeps its own URL, so this is navigation rather than local state —
 * shareable, indexable, and it survives a reload.
 */
export function ColorwaySwitcher({
  collection,
  current,
}: {
  collection: Collection;
  current: Product;
}) {
  return (
    <section aria-labelledby="dials" className="mt-10">
      <div className="flex items-baseline justify-between gap-4">
        <h2 id="dials" className="u-eyebrow">
          Dial
        </h2>
        <p className="text-sm text-muted">{current.subtitle}</p>
      </div>

      <ul className="mt-4 flex flex-wrap gap-3">
        {collection.products.map((p) => {
          const active = p.slug === current.slug;
          return (
            <li key={p.slug}>
              <Link
                href={`/collections/${collection.slug}/${p.slug}`}
                scroll={false}
                aria-current={active ? "page" : undefined}
                title={`${p.name} — ${p.subtitle}`}
                className={`u-focus group relative grid h-14 w-14 place-items-center rounded-full border transition-[border-color,transform] duration-500 [transition-timing-function:var(--ease-orbis)] ${
                  active
                    ? "border-steel"
                    : "border-line hover:border-muted hover:-translate-y-0.5"
                }`}
              >
                <DialSwatch colorway={p.colorway} id={p.slug} size={40} />
                <span className="sr-only">
                  {p.name} — {p.subtitle}
                  {active ? " (selected)" : ""}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
