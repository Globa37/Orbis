"use client";

import { MAX_QTY, useCart } from "./cart-store";
import { translator, type Lang } from "@/lib/i18n";

/** Shared between the drawer and the bag page so they can never diverge. */
export function QtyStepper({
  id,
  qty,
  name,
  lang,
}: {
  id: string;
  qty: number;
  name: string;
  lang: Lang;
}) {
  const { setQty } = useCart();
  const t = translator(lang);

  return (
    <div className="flex items-center rounded-full border border-line">
      <button
        onClick={() => setQty(id, qty - 1)}
        className="u-focus h-9 w-9 rounded-l-full text-muted transition-colors hover:text-text"
        aria-label={`${t("decrease")}: ${name}`}
      >
        −
      </button>
      <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        onClick={() => setQty(id, qty + 1)}
        disabled={qty >= MAX_QTY}
        className="u-focus h-9 w-9 rounded-r-full text-muted transition-colors hover:text-text disabled:cursor-not-allowed disabled:text-line"
        aria-label={`${t("increase")}: ${name}`}
      >
        +
      </button>
    </div>
  );
}
