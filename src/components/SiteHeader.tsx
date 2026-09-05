"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OrbisLogo } from "./OrbisMark";
import { useCart } from "./cart/cart-store";
import { COLLECTIONS } from "@/lib/catalog/millenium";

const NAV = [
  ...COLLECTIONS.map((c) => ({ href: `/collections/${c.slug}`, label: c.name })),
  { href: "/maison", label: "Maison" },
];

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const { count, setOpen, ready } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Navigating closes the menu. Adjusting during render avoids a second pass.
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenu(false);
  }

  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menu]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[70] transition-[background-color,backdrop-filter,border-color] duration-500 ${
        scrolled || menu
          ? "border-b border-line bg-void/85 backdrop-blur-xl"
          : "border-b border-transparent"
      }`}
    >
      <div className="mx-auto flex h-[4.5rem] max-w-[110rem] items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link href="/" className="u-focus shrink-0 transition-opacity hover:opacity-70" aria-label="ORBIS home">
          <OrbisLogo size={24} />
        </Link>

        <nav aria-label="Collections" className="hidden items-center gap-10 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={pathname.startsWith(item.href) ? "page" : undefined}
              className={`u-focus u-link text-[0.7rem] uppercase tracking-[0.28em] transition-colors duration-300 ${
                pathname.startsWith(item.href) ? "text-text" : "text-muted hover:text-text"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => setOpen(true)}
            className="u-focus flex items-center gap-2 rounded-full px-3 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors duration-300 hover:text-text"
            aria-label={`Open bag${ready && count ? `, ${count} item${count > 1 ? "s" : ""}` : ""}`}
          >
            <span className="hidden sm:inline">Bag</span>
            <span
              className="grid h-5 min-w-5 place-items-center rounded-full border border-line px-1 text-[0.65rem] tabular-nums"
              aria-hidden="true"
            >
              {ready ? count : 0}
            </span>
          </button>

          <button
            onClick={() => setMenu((v) => !v)}
            className="u-focus -mr-2 p-2 text-muted transition-colors hover:text-text md:hidden"
            aria-expanded={menu}
            aria-controls="mobile-nav"
            aria-label={menu ? "Close menu" : "Open menu"}
          >
            <svg width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <path
                d={menu ? "M2 2l16 10M18 2L2 12" : "M0 1h20M0 13h20"}
                stroke="currentColor"
                strokeWidth="1.2"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile navigation: its own layout, not a squeezed desktop bar. */}
      <div
        id="mobile-nav"
        className={`overflow-hidden border-t border-line bg-void/95 backdrop-blur-xl transition-[max-height,opacity] duration-500 [transition-timing-function:var(--ease-orbis)] md:hidden ${
          menu ? "max-h-[70vh] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <nav aria-label="Mobile" className="px-5 py-6">
          {NAV.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className="u-focus block border-b border-line/60 py-5 font-display text-4xl transition-colors last:border-0 hover:text-steel"
              style={{ transitionDelay: menu ? `${i * 40}ms` : "0ms" }}
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
