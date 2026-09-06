"use client";

import { useEffect, useState } from "react";
import { useCart } from "./cart/cart-store";
import { formatPrice, translator, type Lang } from "@/lib/i18n";
import type { Collection, Product } from "@/lib/catalog/types";

/**
 * On a phone the buy action scrolls away almost immediately. This brings it
 * back once the main action has left the viewport, and never before — so it
 * does not cover the product while the visitor is still looking at it.
 */
export function MobileBuyBar({
  collection,
  product,
  image,
  lang,
}: {
  collection: Collection;
  product: Product;
  image: string;
  lang: Lang;
}) {
  const { add } = useCart();
  const t = translator(lang);
  const [shown, setShown] = useState(false);
  const [added, setAdded] = useState(false);

  // Watch the real buy action rather than a marker of our own, so the bar
  // appears exactly when that button leaves the screen.
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    const anchor = document.querySelector("[data-buy-anchor]");
    if (!anchor) return;
    const io = new IntersectionObserver(
      ([entry]) => setShown(!entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }
    );
    io.observe(anchor);
    return () => io.disconnect();
  }, []);

  return (
    <>
      <div
        className={`fixed inset-x-0 bottom-0 z-[60] transition-transform duration-500 [transition-timing-function:var(--ease-orbis)] lg:hidden ${
          shown ? "translate-y-0" : "translate-y-full"
        }`}
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {/* Content dissolves into the bar instead of being cut off by it. */}
        <div
          aria-hidden="true"
          className="pointer-events-none h-10 bg-gradient-to-t from-void to-transparent"
        />
        <div className="flex items-center gap-4 border-t border-line bg-void px-5 py-3">
          <div className="min-w-0 flex-1">
            <p className="truncate font-display text-lg leading-tight">{product.name}</p>
            <p className="u-num text-sm text-steel">{formatPrice(product.priceCents, lang)}</p>
          </div>
          <button
            onClick={() => {
              add({
                id: `${collection.slug}:${product.slug}`,
                collectionSlug: collection.slug,
                productSlug: product.slug,
                name: product.name,
                collectionName: collection.name,
                subtitle: product.subtitle,
                reference: product.reference,
                priceCents: product.priceCents,
                image,
              });
              setAdded(true);
              window.setTimeout(() => setAdded(false), 2000);
            }}
            className="u-focus shrink-0 rounded-full bg-text px-6 py-3 text-[0.7rem] font-medium uppercase tracking-[0.24em] text-void transition-colors duration-300 active:bg-white"
          >
            {added ? t("addedToBag") : t("addToBag")}
          </button>
        </div>
      </div>
    </>
  );
}
