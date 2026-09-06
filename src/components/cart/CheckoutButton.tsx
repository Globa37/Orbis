"use client";

/**
 * Checkout is deliberately an integration point, not a simulation.
 *
 * Set NEXT_PUBLIC_CHECKOUT_URL to your payment provider's hosted checkout and
 * this becomes a live link. Until then it is plainly inert — the site never
 * pretends an order can be placed.
 */
import { translator, type Lang } from "@/lib/i18n";

const CHECKOUT_URL = process.env.NEXT_PUBLIC_CHECKOUT_URL;

export function CheckoutButton({ lang, className = "" }: { lang: Lang; className?: string }) {
  const t = translator(lang);
  const base =
    "u-focus block w-full rounded-full px-6 py-4 text-center text-[0.7rem] font-medium uppercase tracking-[0.28em] transition-colors duration-300";

  if (!CHECKOUT_URL) {
    return (
      <>
        <button
          disabled
          aria-describedby="checkout-note"
          className={`${base} cursor-not-allowed bg-raised text-faint ${className}`}
        >
          {t("checkout")}
        </button>
        <p id="checkout-note" className="mt-3 text-center text-xs text-faint">
          {t("checkoutNotConnected")}
        </p>
      </>
    );
  }

  return (
    <a href={CHECKOUT_URL} className={`${base} bg-text text-void hover:bg-white ${className}`}>
      {t("checkout")}
    </a>
  );
}
