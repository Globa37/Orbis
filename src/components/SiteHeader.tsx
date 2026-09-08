"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OrbisLogo } from "./OrbisMark";
import { useCart } from "./cart/cart-store";
import { COLLECTIONS } from "@/lib/catalog";
import { CollectionMenu } from "./CollectionMenu";
import { DialSwatch } from "./DialSwatch";
import { LanguageSwitch } from "./LanguageSwitch";
import { SupportButton } from "./support/SupportButton";
import { path, translator, type Lang } from "@/lib/i18n";

export function SiteHeader({ lang }: { lang: Lang }) {
  const t = translator(lang);
  const [scrolled, setScrolled] = useState(false);
  const [bump, setBump] = useState(0);
  const [menu, setMenu] = useState(false);
  const { count, setOpen, ready } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // A short scale pulse whenever the count changes, so adding registers.
  const [seenCount, setSeenCount] = useState(count);
  if (seenCount !== count) {
    setSeenCount(count);
    if (count > seenCount) setBump((n) => n + 1);
  }

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
      <div className="u-gutter flex h-[4.5rem] items-center justify-between">
        <Link
          href={path(lang)}
          className="u-focus shrink-0 transition-opacity hover:opacity-70"
          aria-label="ORBIS"
        >
          <OrbisLogo size={24} />
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-10 md:flex">
          {COLLECTIONS.map((c) => (
            <CollectionMenu
              key={c.slug}
              collection={c}
              lang={lang}
              active={pathname.startsWith(path(lang, `/collections/${c.slug}`))}
            />
          ))}
                    <Link
            href={path(lang, "/maison")}
            aria-current={pathname.startsWith(path(lang, "/maison")) ? "page" : undefined}
            className={`u-focus u-link text-[0.7rem] uppercase tracking-[0.28em] transition-colors duration-300 ${
              pathname.startsWith(path(lang, "/maison")) ? "text-text" : "text-muted hover:text-text"
            }`}
          >
            {t("maison")}
          </Link>
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <LanguageSwitch lang={lang} className="mr-1 hidden sm:flex" />
          <SupportButton lang={lang} />
          <button
            onClick={() => setOpen(true)}
            className="u-focus flex items-center gap-2 rounded-full px-3 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors duration-300 hover:text-text"
            aria-label={
              ready && count
                ? `${t("openBag")}, ${count} ${count > 1 ? t("itemsMany") : t("itemsOne")}`
                : t("openBag")
            }
          >
            <span className="hidden sm:inline">{t("bag")}</span>
            <span
              key={bump}
              className="grid h-5 min-w-5 place-items-center rounded-full border border-line px-1 text-[0.65rem] tabular-nums data-[bump]:animate-[orbis-bump_600ms_var(--ease-orbis)]"
              data-bump={bump > 0 ? "" : undefined}
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
            aria-label={menu ? t("closeMenu") : t("openMenu")}
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
        <nav aria-label={t("collections")} className="px-5 py-6">
          {COLLECTIONS.map((c) => (
            <div key={c.slug} className="border-b border-line/60 pb-6">
              <Link
                href={path(lang, `/collections/${c.slug}`)}
                className="u-focus flex items-baseline gap-3 py-4 font-display text-4xl transition-colors hover:text-steel"
              >
                {c.name}
                {c.status === "announced" && (
                  <span className="font-sans text-[0.6rem] uppercase tracking-[0.24em] text-faint">
                    {t("comingSoon")}
                  </span>
                )}
              </Link>
              {/* The dials themselves, so the collection is browsable from the menu. */}
              <ul className="-mx-1 flex gap-1 overflow-x-auto pb-1 [scrollbar-width:none]">
                {c.products.map((p) => (
                  <li key={p.slug}>
                    <Link
                      href={path(lang, `/collections/${c.slug}/${p.slug}`)}
                      className="u-focus flex w-[4.6rem] shrink-0 flex-col items-center gap-2 rounded-sm px-1 py-2"
                    >
                      <DialSwatch colorway={p.colorway} id={`m-${p.slug}`} size={40} />
                      <span className="text-[0.7rem] text-muted">{p.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Link
            href={path(lang, "/maison")}
            className="u-focus block py-5 font-display text-4xl transition-colors hover:text-steel"
          >
            {t("maison")}
          </Link>
          <LanguageSwitch lang={lang} className="mt-6 sm:hidden" />
        </nav>
      </div>
    </header>
  );
}
