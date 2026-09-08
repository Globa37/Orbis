import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { OrbisMark } from "@/components/OrbisMark";
import { COLLECTIONS, SHOP_COLLECTIONS, frameImage, getCollection } from "@/lib/catalog";
import type { Collection } from "@/lib/catalog/types";
import {
  LANGS,
  formatPrice,
  isLang,
  path as langPath,
  translator,
  type Lang,
} from "@/lib/i18n";
import { SITE_NAME, absolute, asset } from "@/lib/site";

export function generateStaticParams() {
  return LANGS.flatMap((lang) => COLLECTIONS.map((c) => ({ lang, collection: c.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; collection: string }>;
}): Promise<Metadata> {
  const { lang, collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection || !isLang(lang)) return {};
  const rest = `/collections/${collection.slug}`;
  const hero = collection.products[0]
    ? frameImage(collection.slug, collection.products[0].slug, "lifestyle")
    : null;
  return {
    title: collection.name.toUpperCase(),
    description: collection.intro[lang],
    alternates: {
      canonical: langPath(lang, rest),
      languages: Object.fromEntries(LANGS.map((l) => [l, langPath(l, rest)])),
    },
    openGraph: {
      type: "website",
      url: langPath(lang, rest),
      title: `ORBIS ${collection.name}`,
      description: collection.intro[lang],
      ...(hero && {
        images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt[lang] }],
      }),
    },
    ...(hero && { twitter: { card: "summary_large_image" as const, images: [hero.src] } }),
  };
}

/**
 * The collection's own sky.
 *
 * Each collection owns a plate, so the section overrides the site-wide --plate
 * rather than inheriting the one the root layout set. A collection whose plate
 * has not been shot yet gets no override and keeps the house atmosphere, which
 * is a quieter failure than an empty frame.
 */
function worldStyle(collection: Collection): CSSProperties | undefined {
  if (!collection.world.plate) return undefined;
  return { "--plate": `url("${asset(collection.world.plate)}")` } as CSSProperties;
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ lang: string; collection: string }>;
}) {
  const { lang, collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection || !isLang(lang)) notFound();
  const t = translator(lang);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `ORBIS ${collection.name}`,
    description: collection.intro[lang],
    url: absolute(langPath(lang, `/collections/${collection.slug}`)),
    isPartOf: { "@type": "WebSite", name: SITE_NAME, url: absolute(langPath(lang)) },
    ...(collection.products.length > 0 && {
      mainEntity: {
        "@type": "ItemList",
        numberOfItems: collection.products.length,
        itemListElement: collection.products.map((p, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: `ORBIS ${collection.name} ${p.name}`,
          url: absolute(langPath(lang, `/collections/${collection.slug}/${p.slug}`)),
        })),
      },
    }),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section
        className="relative flex min-h-[86svh] items-end overflow-hidden"
        style={worldStyle(collection)}
      >
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0" style={{ backgroundPosition: "center 52%" }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-void/30 via-void/12 to-void" />

        <div className="u-gutter w-full pb-16 pt-36 lg:pb-24">
          <Reveal>
            <p className="u-eyebrow flex flex-wrap items-center gap-3">
              <span>
                {t("collectionN")} {collection.index}
              </span>
              {collection.status === "announced" ? (
                <span className="rounded-full border border-line px-2.5 py-1 !tracking-[0.2em] text-faint">
                  {t("comingSoon")}
                </span>
              ) : (
                <span className="text-faint">
                  · {collection.products.length} {t("references")}
                </span>
              )}
            </p>
          </Reveal>
          <Reveal delay={110}>
            <h1 className="u-display u-display-xl mt-5 text-[clamp(3.5rem,15vw,13rem)]">{collection.name}</h1>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <p className="max-w-lg text-[1.0625rem] leading-relaxed text-muted">
                {collection.intro[lang]}
              </p>
              <dl className="grid max-w-md grid-cols-2 gap-x-8 gap-y-6 self-end text-sm">
                <div>
                  <dt className="u-eyebrow !text-[0.6rem]">{t("world")}</dt>
                  <dd className="mt-2 text-text">{collection.world.name[lang]}</dd>
                </div>
                <div>
                  <dt className="u-eyebrow !text-[0.6rem]">{t("references")}</dt>
                  <dd className="mt-2 text-text">
                    {collection.products.length > 0
                      ? `${collection.products[0].reference} — ${
                          collection.products[collection.products.length - 1].reference
                        }`
                      : "—"}
                  </dd>
                </div>
                {collection.products.length > 0 && (
                  <div>
                    <dt className="u-eyebrow !text-[0.6rem]">
                      {collection.products[0].specs[0].label[lang]}
                    </dt>
                    <dd className="mt-2 text-text">
                      {collection.products[0].specs[0].value[lang]}
                    </dd>
                  </div>
                )}
                {collection.products.length > 0 && (
                  <div>
                    <dt className="u-eyebrow !text-[0.6rem]">{t("total")}</dt>
                    <dd className="mt-2 text-text">
                      {formatPrice(collection.products[0].priceCents, lang)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {collection.products.length > 0 ? (
        <Shop collection={collection} lang={lang} />
      ) : (
        <Announced collection={collection} lang={lang} />
      )}
    </>
  );
}

/* ------------------------------------------------------------------ shop */

function Shop({ collection, lang }: { collection: Collection; lang: Lang }) {
  const t = translator(lang);
  const showcase = frameImage(collection.slug, collection.products[0].slug, "lifestyle");

  return (
    <>
      <section className="border-t border-line">
        <div className="u-gutter u-band-tight">
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {collection.products.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 90}>
                <ProductCard
                  collection={collection}
                  product={product}
                  index={i}
                  priority={i < 3}
                  lang={lang}
                />
              </Reveal>
            ))}

            {/* The next collection, so the grid ends on what is coming rather
                than on a gap. Only shown when there is one to point at. */}
            {COLLECTIONS.filter((c) => c.status === "announced").map((next) => (
              <Reveal key={next.slug} delay={180} className="hidden lg:block">
                <Link
                  href={langPath(lang, `/collections/${next.slug}`)}
                  className="u-focus group relative flex aspect-4/5 flex-col items-start justify-end overflow-hidden rounded-sm border border-line/60 p-8 transition-colors duration-500 hover:border-line"
                >
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 400 400"
                    className="pointer-events-none absolute left-1/2 top-[38%] h-72 w-72 -translate-x-1/2 -translate-y-1/2 text-line transition-transform duration-[1400ms] [transition-timing-function:var(--ease-orbis)] group-hover:rotate-12"
                  >
                    <ellipse cx="200" cy="200" rx="150" ry="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 7" />
                    <ellipse cx="200" cy="200" rx="150" ry="56" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 7" />
                    <ellipse cx="200" cy="200" rx="56" ry="150" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="2 7" />
                  </svg>
                  <p className="u-eyebrow relative">
                    {t("collectionN")} {next.index}
                  </p>
                  <p className="relative mt-3 font-display text-3xl text-muted">{next.name}</p>
                  <p className="relative mt-3 max-w-[16rem] text-sm text-faint">
                    {next.tagline[lang]}
                  </p>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-line bg-ink">
        <div className="u-gutter u-band-tight">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <Reveal>
              <Image
                src={showcase.src}
                alt={showcase.alt[lang]}
                width={showcase.width}
                height={showcase.height}
                loading="lazy"
                placeholder="blur"
                blurDataURL={showcase.blurDataURL}
                sizes="(max-width: 1024px) 92vw, 55vw"
                className="w-full rounded-sm"
              />
            </Reveal>
            <Reveal delay={120}>
              <p className="u-eyebrow">
                {t("worldOf")} {collection.name}
              </p>
              <h2 className="u-display u-display-xl mt-5 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05]">
                {collection.world.name[lang]}
              </h2>
              <p className="mt-7 leading-relaxed text-muted">{collection.world.body[lang]}</p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}

/* ------------------------------------------------------------- announced */

/**
 * A collection with a world but no references yet.
 *
 * There is nothing to grid and nothing to price, so the page gives the world
 * the room the products would have taken, says plainly that nothing can be
 * ordered, and points at the collection that can.
 */
function Announced({ collection, lang }: { collection: Collection; lang: Lang }) {
  const t = translator(lang);
  const open = SHOP_COLLECTIONS[0];

  return (
    <section className="border-t border-line bg-ink">
      <div className="u-gutter u-band">
        <div className="grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-24">
          <Reveal>
            <OrbisMark size={44} className="text-steel" />
            <p className="u-eyebrow mt-8">
              {t("worldOf")} {collection.name}
            </p>
            <h2 className="u-display u-display-xl mt-4 text-[clamp(2.25rem,6vw,4rem)] leading-[1.05]">
              {collection.world.name[lang]}
            </h2>
          </Reveal>

          <Reveal delay={120}>
            <p className="text-[1.0625rem] leading-relaxed text-muted">
              {collection.world.body[lang]}
            </p>

            <div className="mt-12 flex flex-col gap-5 rounded-sm border border-line bg-void p-7 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="u-eyebrow !text-text">{t("comingSoon")}</p>
                <p className="mt-2 max-w-sm text-sm text-faint">{t("notYetForSale")}</p>
              </div>
              <Link
                href={langPath(lang, `/collections/${open.slug}`)}
                className="u-focus shrink-0 rounded-full bg-text px-7 py-3.5 text-center text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
              >
                {open.name}
              </Link>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
