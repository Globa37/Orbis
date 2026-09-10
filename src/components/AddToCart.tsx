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

  /*
   * A reference that cannot be shipped does not get a button that looks like it
   * can. Rendering a disabled notice instead of hiding the control keeps the
   * layout and tells the reader why nothing happens, and the state is read from
   * the catalog
