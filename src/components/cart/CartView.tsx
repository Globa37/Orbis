"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "./cart-store";
import { CheckoutButton } from "./CheckoutButton";
import { QtyStepper } from "./QtyStepper";
import { formatPrice, path, translator, type Lang } from "@/lib/i18n";
import { SHOP_COLLECTIONS } from "@/lib/catalog";

export function CartView({ lang }: { lang: Lang }) {
  const { lines, subtotalCents, vatCents, count, ready, remove, clear, atMax } = useCart();
  const t = translator(lang);
  const shop = SHOP_COLLECTIONS[0];

  // The bag lives in the browser, so the server cannot know what is in it.
  // This holds the space until it does, rather than flashing "empty" first.
  if (!ready) {
    return (
      <div className="mt-12 h-48 animate-[orbis-fade_600ms_var(--ease-orbis)] rounded-sm border border-line" />
    );
  }

  if (lines.length === 0) {
    return (
      <div className="mt-14 border-t border-line py-20 text-center">
        <p className="font-display text-3xl text-muted">{t("bagEmpty")}</p>
        <p className="mx-auto mt-4 max-w-sm text-sm text-faint">{t("bagEmptyHint")}</p>
        <Link
          href={path(lang, `/collections/${shop.slug}`)}
          className="u-focus mt-8 inline-block rounded-full bg-text px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
        >
          {t("exploreCollection")}
        </Link>
      </div>
    );
  }

  return (
    <div className="mt-12 grid gap-12 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] lg:gap-20">
      <div>
        <ul className="divide-y divide-line border-y border-line">
          {lines.map((line) => (
            <li key={line.id} className="flex gap-5 py-7 sm:gap-8">
              <Link
                href={path(lang, `/collections/${line.collectionSlug}/${line.productSlug}`)}
                className="u-focus relative aspect-4/5 w-24 shrink-0 overflow-hidden rounded-sm bg-surface sm:w-32"
              >
                <Image src={line.image} alt="" fill sizes="128px" className="object-cover" />
              </Link>

              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="u-eyebrow !text-[0.6rem]">
                      {line.collectionName} · {line.reference}
                    </p>
                    <Link
                      href={path(lang, `/collections/${line.collectionSlug}/${line.productSlug}`)}
                      className="u-focus mt-1.5 block truncate font-display text-2xl transition-colors hover:text-steel sm:text-3xl"
                    >
                      {line.name}
                    </Link>
                    <p className="mt-1 truncate text-sm text-faint">{line.subtitle[lang]}</p>
                  </div>
                  <p className="shrink-0 tabular-nums text-steel">
                    {formatPrice(line.priceCents * line.qty, lang)}
                  </p>
                </div>

                <div className="mt-auto flex items-center justify-between gap-4 pt-5">
                  <QtyStepper id={line.id} qty={line.qty} name={line.name} lang={lang} />
                  <button
                    onClick={() => remove(line.id)}
                    aria-label={`${t("removeLine")}: ${line.name}`}
                    className="u-focus u-link text-[0.7rem] uppercase tracking-[0.22em] text-faint transition-colors hover:text-text"
                  >
                    {t("remove")}
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>

        {atMax && <p className="mt-4 text-xs text-faint">{t("maxQty")}</p>}

        <button
          onClick={clear}
          className="u-focus u-link mt-6 text-[0.7rem] uppercase tracking-[0.22em] text-faint transition-colors hover:text-text"
        >
          {t("clearBag")}
        </button>
      </div>

      <aside aria-labelledby="summary" className="lg:sticky lg:top-32 lg:self-start">
        <h2 id="summary" className="u-eyebrow">
          {t("bag")}
        </h2>
        <dl className="mt-6 space-y-4 border-y border-line py-6 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">
              {count > 1 ? t("itemsMany") : t("itemsOne")}{" "}
              <span className="tabular-nums">({count})</span>
            </dt>
            <dd className="tabular-nums">{formatPrice(subtotalCents, lang)}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">{t("delivery")}</dt>
            <dd className="text-muted">{t("deliveryFree")}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-faint">{t("vatIncluded")}</dt>
            <dd className="tabular-nums text-faint">{formatPrice(vatCents, lang)}</dd>
          </div>
        </dl>
        <div className="mt-6 flex items-baseline justify-between gap-4">
          <span className="u-eyebrow !text-text">{t("total")}</span>
          <span className="font-display text-3xl tabular-nums">
            {formatPrice(subtotalCents, lang)}
          </span>
        </div>

        <div className="mt-8">
          <CheckoutButton lang={lang} />
        </div>

        <Link
          href={path(lang, `/collections/${shop.slug}`)}
          className="u-focus u-link mt-6 inline-block text-[0.7rem] uppercase tracking-[0.24em] text-muted transition-colors hover:text-text"
        >
          {t("continueShopping")}
        </Link>
      </aside>
    </div>
  );
}
