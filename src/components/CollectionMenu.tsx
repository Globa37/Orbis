"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { DialSwatch } from "./DialSwatch";
import { formatPrice } from "@/lib/catalog/types";
import type { Collection } from "@/lib/catalog/types";

/**
 * The collection opens under the navigation as a row of dials rather than a
 * list of words. Hover or keyboard focus both open it; it closes on Escape,
 * on leaving, and whenever focus moves out of the group.
 */
export function CollectionMenu({
  collection,
  active,
}: {
  collection: Collection;
  active: boolean;
}) {
  const [open, setOpen] = useState(false);
  const group = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);

  const show = () => {
    window.clearTimeout(closeTimer.current);
    setOpen(true);
  };
  // A short grace period so crossing the gap to the panel does not close it.
  const hide = () => {
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpen(false), 120);
  };

  return (
    <div
      ref={group}
      className="relative"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={(e) => {
        if (!group.current?.contains(e.relatedTarget as Node)) setOpen(false);
      }}
      onKeyDown={(e) => {
        if (e.key === "Escape") setOpen(false);
      }}
    >
      <Link
        href={`/collections/${collection.slug}`}
        aria-expanded={open}
        aria-current={active ? "page" : undefined}
        className={`u-focus u-link block py-6 text-[0.7rem] uppercase tracking-[0.28em] transition-colors duration-300 ${
          active ? "text-text" : "text-muted hover:text-text"
        }`}
      >
        {collection.name}
      </Link>

      <div
        className={`absolute left-1/2 top-full z-10 -translate-x-1/2 pt-1 transition-[opacity,transform] duration-500 [transition-timing-function:var(--ease-orbis)] ${
          open ? "pointer-events-auto translate-y-0 opacity-100" : "pointer-events-none -translate-y-1 opacity-0"
        }`}
      >
        <div className="rounded-sm border border-line bg-ink/95 p-5 shadow-[0_30px_70px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          <ul className="flex gap-1">
            {collection.products.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/collections/${collection.slug}/${p.slug}`}
                  tabIndex={open ? 0 : -1}
                  className="u-focus group flex w-[7.25rem] flex-col items-center gap-3 rounded-sm px-2 py-3 transition-colors duration-300 hover:bg-raised"
                >
                  <span className="transition-transform duration-500 [transition-timing-function:var(--ease-orbis)] group-hover:-translate-y-0.5">
                    <DialSwatch colorway={p.colorway} id={`nav-${p.slug}`} size={46} />
                  </span>
                  <span className="text-center">
                    <span className="block font-display text-lg leading-none">{p.name}</span>
                    <span className="u-num mt-1.5 block text-[0.7rem] text-faint">
                      {formatPrice(p.priceCents)}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 border-t border-line pt-3 text-center">
            <Link
              href={`/collections/${collection.slug}`}
              tabIndex={open ? 0 : -1}
              className="u-focus u-link text-[0.65rem] uppercase tracking-[0.28em] text-muted transition-colors hover:text-text"
            >
              View the collection
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
