"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./cart-store";
import { CheckoutButton } from "./CheckoutButton";
import { QtyStepper } from "./QtyStepper";
import { formatPrice } from "@/lib/catalog/types";

export function CartDrawer() {
  const { lines, open, setOpen, remove, subtotalCents, count } = useCart();
  const panel = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);

  // Trap focus and close on Escape while the drawer is open.
  useEffect(() => {
    if (!open) return;
    closeBtn.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panel.current) return;
      const focusable = panel.current.querySelectorAll<HTMLElement>(
        'a[href],button:not([disabled]),input,select,[tabindex]:not([tabindex="-1"])'
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, setOpen]);

  return (
    <div
      className={`fixed inset-0 z-[80] overflow-hidden ${open ? "" : "pointer-events-none"}`}
      aria-hidden={!open}
    >
      <div
        onClick={() => setOpen(false)}
        className={`absolute inset-0 bg-void/80 backdrop-blur-sm transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[27rem] flex-col border-l border-line bg-ink transition-transform duration-[600ms] [transition-timing-function:var(--ease-orbis)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-line px-6 py-5">
          <h2 className="u-eyebrow !text-text">
            Bag {count > 0 && <span className="text-muted">({count})</span>}
          </h2>
          <button
            ref={closeBtn}
            onClick={() => setOpen(false)}
            className="u-focus -mr-2 p-2 text-muted transition-colors hover:text-text"
            aria-label="Close bag"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
              <path d="M1 1l16 16M17 1L1 17" stroke="currentColor" strokeWidth="1.2" />
            </svg>
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <p className="font-display text-2xl text-muted">Your bag is empty.</p>
            <Link
              href="/collections/millenium"
              onClick={() => setOpen(false)}
              className="u-focus u-eyebrow !text-text u-link"
            >
              Explore Millenium
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 px-6 py-5">
                  <Link
                    href={`/collections/${line.collectionSlug}/${line.productSlug}`}
                    onClick={() => setOpen(false)}
                    className="u-focus relative h-28 w-[5.5rem] shrink-0 overflow-hidden rounded-sm bg-surface"
                  >
                    <Image
                      src={line.image}
                      alt=""
                      fill
                      sizes="88px"
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="u-eyebrow !text-[0.6rem] !tracking-[0.28em]">
                          {line.collectionName}
                        </p>
                        <p className="mt-1 truncate font-display text-xl">{line.name}</p>
                        <p className="mt-0.5 truncate text-xs text-faint">{line.subtitle}</p>
                      </div>
                      <p className="shrink-0 text-sm tabular-nums text-steel">
                        {formatPrice(line.priceCents * line.qty)}
                      </p>
                    </div>
                    <div className="mt-auto flex items-center justify-between pt-3">
                      <QtyStepper id={line.id} qty={line.qty} name={line.name} />
                      <button
                        onClick={() => remove(line.id)}
                        className="u-focus u-link text-[0.7rem] uppercase tracking-[0.2em] text-faint transition-colors hover:text-text"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-6 py-6">
              <div className="flex items-baseline justify-between">
                <span className="u-eyebrow">Subtotal</span>
                <span className="font-display text-2xl tabular-nums">
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <p className="mt-2 text-xs text-faint">
                Shipping and duties calculated at checkout. Complimentary worldwide delivery.
              </p>
              <div className="mt-5">
                <CheckoutButton />
              </div>
              <Link
                href="/cart"
                onClick={() => setOpen(false)}
                className="u-focus u-link mt-5 block text-center text-[0.7rem] uppercase tracking-[0.24em] text-muted transition-colors hover:text-text"
              >
                View bag
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
