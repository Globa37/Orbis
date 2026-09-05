"use client";

import { useCart } from "./cart-store";

/** Shared between the drawer and the bag page so they can never diverge. */
export function QtyStepper({ id, qty, name }: { id: string; qty: number; name: string }) {
  const { setQty } = useCart();
  return (
    <div className="flex items-center rounded-full border border-line">
      <button
        onClick={() => setQty(id, qty - 1)}
        className="u-focus h-9 w-9 rounded-l-full text-muted transition-colors hover:text-text"
        aria-label={`Decrease quantity of ${name}`}
      >
        −
      </button>
      <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
        {qty}
      </span>
      <button
        onClick={() => setQty(id, qty + 1)}
        className="u-focus h-9 w-9 rounded-r-full text-muted transition-colors hover:text-text"
        aria-label={`Increase quantity of ${name}`}
      >
        +
      </button>
    </div>
  );
}
