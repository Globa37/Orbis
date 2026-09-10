"use client";

import { useState } from "react";
import { useCart } from "./cart/cart-store";
import { translator, type Lang } from "@/lib/i18n";
import type { Collection, Product } from "@/lib/catalog/types";

export function AddToCart({
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
  const [added, setAdded] = useState(false);

  if (product.soldOut) {
    return (
      <p
        className="w-full rounded-full border border-line px-8 py-4 text-center text-[0.7rem] font-medium uppercase tracking-[0.28em] text-faint sm:w-auto sm:min-w-[16rem]"
        role="status"
      >
        {t("soldOut")}
      </p>
    );
  }

  return (
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
        window.setTimeout(() => setAdded(false), 2200);
      }}
      className="u-focus group relative w-full overflow-hidden rounded-full bg-text px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white sm:w-auto sm:min-w-[16rem]"
    >
      <span className={`block transition-transform duration-500 [transition-timing-function:var(--ease-orbis)] ${added ? "-translate-y-8" : ""}`}>
        {t("addToBag")}
      </span>
      <span
        aria-hidden={!added}
        className={`absolute inset-0 grid place-items-center transition-transform duration-500 [transition-timing-function:var(--ease-orbis)] ${
          added ? "translate-y-0" : "translate-y-8"
        }`}
      >
        {t("addedToBag")}
      </span>
      <span className="sr-only" role="status">
        {added ? `${product.name}: ${t("addedToBag")}` : ""}
      </span>
    </button>
  );
}
