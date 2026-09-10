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
          id:
