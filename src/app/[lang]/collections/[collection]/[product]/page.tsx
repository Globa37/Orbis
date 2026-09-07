import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { MobileBuyBar } from "@/components/MobileBuyBar";
import { ColorwaySwitcher } from "@/components/ColorwaySwitcher";
import { ReferenceNav } from "@/components/ReferenceNav";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { OrbisMark } from "@/components/OrbisMark";
import { allProducts, getProduct } from "@/lib/catalog";
import { LANGS, formatPrice, isLang, path as langPath, translator } from "@/lib/i18n";
import { SITE_NAME, absolute } from "@/lib/site";

export function generateStaticParams() {
  return LANGS.flatMap((lang) =>
    allProducts().map(({ collection, product }) => ({
      lang,
      collection: collection.slug,
      product: product.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; collection: string; product: string }>;
}): Promise<Metadata> {
  const { lang, collection: cSlug, product: pSlug } = await params;
  const found = getProduct(cSlug, pSlug);
  if (!found || !isLang(lang)) return {};
  const { collection, product } = found;
  const hero = product.images[0];
  const rest = `/collections/${collection.slug}/${product.slug}`;
  return {
    title: `${product.name} — ${collection.name.toUpperCase()}`,
    description: product.description[lang],
    alternates: {
      canonical: langPath(lang, rest),
      languages: Object.fromEntries(LANGS.map((l) => [l, langPath(l, rest)])),
    },
    openGraph: {
      type: "website",
      url: langPath(lang, rest),
      title: `ORBIS ${collection.name} ${product.name}`,
      description: product.description[lang],
      images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt[lang] }],
    },
    twitter: { card: "summary_large_image", images: [hero.src] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; collection: string; product: string }>;
}) {
  const { lang, collection: cSlug, product: pSlug } = await params;
  const found = getProduct(cSlug, pSlug);
  if (!found || !isLang(lang)) notFound();
  const { collection, product } = found;
  const t = translator(lang);

  const related = collection.products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const productPath = langPath(lang, `/collections/${collection.slug}/${product.slug}`);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `ORBIS ${collection.name} ${product.name}`,
      sku: product.reference,
      mpn: product.reference,
      brand: { "@type": "Brand", name: SITE_NAME },
      category: "Wristwatch",
      description: product.description[lang],
      image: product.images.map((i) => absolute(i.src)),
      // Only specification values confirmed by the supplier sheet.
      additionalProperty: product.specs.map((s) => ({
        "@type": "PropertyValue",
        name: s.label[lang],
        value: s.value[lang],
      })),
      offers: {
        "@type": "Offer",
        url: absolute(productPath),
        price: (product.priceCents / 100).toFixed(2),
        priceCurrency: "EUR",
        availability: "https://schema.org/InStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absolute(langPath(lang)) },
        { "@type": "ListItem", position: 2, name: collection.name, item: absolute(langPath(lang, `/collections/${collection.slug}`)) },
        { "@type": "ListItem", position: 3, name: product.name, item: absolute(productPath) },
      ],
    },
  ];

  return (
    <div style={{ ["--accent" as string]: product.accent.base, ["--accent-glow" as string]: product.accent.glow }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="u-gutter pt-28 lg:pt-32">
        <nav aria-label="Breadcrumb" className="text-[0.7rem] uppercase tracking-[0.24em] text-faint">
          <ol className="flex flex-wrap items-center gap-2">
            <li>
              <Link href={langPath(lang)} className="u-focus transition-colors hover:text-text">
                ORBIS
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link
                href={langPath(lang, `/collections/${collection.slug}`)}
                className="u-focus transition-colors hover:text-text"
              >
                {collection.name}
              </Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page" className="text-muted">{product.name}</li>
          </ol>
        </nav>
      </div>

      {/* ========================================================= showroom */}
      <section className="u-gutter py-10 lg:py-14">
        <div className="grid min-w-0 gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-16 xl:gap-24">
          <ProductGallery images={product.images} name={product.name} lang={lang} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="u-eyebrow">
              {collection.name} · {product.reference}
            </p>
            <h1 className="u-display u-display-xl mt-4 text-[clamp(3rem,9vw,6rem)]">{product.name}</h1>
            <p className="mt-4 text-lg text-muted">{product.subtitle[lang]}</p>

            <p className="mt-8 text-2xl tabular-nums text-steel">
              {formatPrice(product.priceCents, lang)}
            </p>
            <p className="mt-1.5 text-xs text-faint">{t("includesVat")}</p>

            <ColorwaySwitcher collection={collection} current={product} lang={lang} />

            <div className="mt-9" data-buy-anchor>
              <AddToCart
                collection={collection}
                product={product}
                image={product.images[0].src}
                lang={lang}
              />
            </div>

            <p className="mt-8 max-w-lg leading-relaxed text-muted">{product.description[lang]}</p>

            <h2 className="u-eyebrow mt-12">{t("specification")}</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {product.specs.map((spec) => (
                <div key={spec.label.en} className="grid grid-cols-[9rem_1fr] gap-4 py-4 text-sm">
                  <dt className="u-eyebrow !text-[0.6rem] pt-0.5">{spec.label[lang]}</dt>
                  <dd className="text-text">{spec.value[lang]}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex items-start gap-4 rounded-sm border border-line p-5">
              <OrbisMark size={26} className="mt-0.5 shrink-0 text-steel" />
              <p className="text-sm leading-relaxed text-muted">
                {collection.intro[lang]}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== related */}
      <MobileBuyBar
        collection={collection}
        product={product}
        image={product.images[0].src}
        lang={lang}
      />

      <ReferenceNav collection={collection} current={product} lang={lang} />

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="u-gutter py-20 lg:py-28">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="u-display text-[clamp(1.75rem,4vw,3rem)]">
                {collection.name}
              </h2>
              <Link
                href={langPath(lang, `/collections/${collection.slug}`)}
                className="u-focus u-link pb-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors hover:text-text"
              >
                {t("exploreCollection")}
              </Link>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 pb-28 sm:grid-cols-2 lg:grid-cols-4 lg:pb-0">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <ProductCard
                    collection={collection}
                    product={p}
                    index={collection.products.indexOf(p)}
                    lang={lang}
                  />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
