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
import { allProducts, getProduct } from "@/lib/catalog/millenium";
import { formatPrice } from "@/lib/catalog/types";
import { SITE_NAME, absolute } from "@/lib/site";

export function generateStaticParams() {
  return allProducts().map(({ collection, product }) => ({
    collection: collection.slug,
    product: product.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string; product: string }>;
}): Promise<Metadata> {
  const { collection: cSlug, product: pSlug } = await params;
  const found = getProduct(cSlug, pSlug);
  if (!found) return {};
  const { collection, product } = found;
  const hero = product.images[0];
  const path = `/collections/${collection.slug}/${product.slug}`;
  return {
    title: `${product.name} — ${collection.name.toUpperCase()}`,
    description: product.description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: path,
      title: `ORBIS ${collection.name} ${product.name}`,
      description: product.description,
      images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }],
    },
    twitter: { card: "summary_large_image", images: [hero.src] },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ collection: string; product: string }>;
}) {
  const { collection: cSlug, product: pSlug } = await params;
  const found = getProduct(cSlug, pSlug);
  if (!found) notFound();
  const { collection, product } = found;

  const related = collection.products.filter((p) => p.slug !== product.slug).slice(0, 4);

  const productPath = `/collections/${collection.slug}/${product.slug}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: `ORBIS ${collection.name} ${product.name}`,
      sku: product.reference,
      mpn: product.reference,
      brand: { "@type": "Brand", name: SITE_NAME },
      category: "Wristwatch",
      description: product.description,
      image: product.images.map((i) => absolute(i.src)),
      // Only specification values confirmed by the supplier sheet.
      additionalProperty: product.specs.map((s) => ({
        "@type": "PropertyValue",
        name: s.label,
        value: s.value,
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
        { "@type": "ListItem", position: 1, name: SITE_NAME, item: absolute("/") },
        { "@type": "ListItem", position: 2, name: collection.name, item: absolute(`/collections/${collection.slug}`) },
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
            <li><Link href="/" className="u-focus transition-colors hover:text-text">ORBIS</Link></li>
            <li aria-hidden="true">/</li>
            <li>
              <Link href={`/collections/${collection.slug}`} className="u-focus transition-colors hover:text-text">
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
          <ProductGallery images={product.images} name={product.name} />

          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="u-eyebrow">
              {collection.name} · {product.reference}
            </p>
            <h1 className="u-display mt-4 text-[clamp(3rem,9vw,6rem)]">{product.name}</h1>
            <p className="mt-4 text-lg text-muted">{product.subtitle}</p>

            <p className="mt-8 text-2xl tabular-nums text-steel">
              {formatPrice(product.priceCents)}
            </p>
            <p className="mt-1.5 text-xs text-faint">
              Includes VAT. Complimentary worldwide delivery and returns.
            </p>

            <ColorwaySwitcher collection={collection} current={product} />

            <div className="mt-9" data-buy-anchor>
              <AddToCart
                collection={collection}
                product={product}
                image={product.images[0].src}
              />
            </div>

            <p className="mt-8 max-w-lg leading-relaxed text-muted">{product.description}</p>

            <h2 className="u-eyebrow mt-12">Specification</h2>
            <dl className="mt-5 divide-y divide-line border-y border-line">
              {product.specs.map((spec) => (
                <div key={spec.label} className="grid grid-cols-[9rem_1fr] gap-4 py-4 text-sm">
                  <dt className="u-eyebrow !text-[0.6rem] pt-0.5">{spec.label}</dt>
                  <dd className="text-text">{spec.value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-10 flex items-start gap-4 rounded-sm border border-line p-5">
              <OrbisMark size={26} className="mt-0.5 shrink-0 text-steel" />
              <p className="text-sm leading-relaxed text-muted">
                Every MILLENIUM shares the same 40 mm alloy case, stainless-steel
                bracelet and quartz movement. Only the dial changes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== related */}
      <MobileBuyBar collection={collection} product={product} image={product.images[0].src} />

      <ReferenceNav collection={collection} current={product} />

      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="u-gutter py-20 lg:py-28">
            <Reveal className="flex flex-wrap items-end justify-between gap-6">
              <h2 className="u-display text-[clamp(1.75rem,4vw,3rem)]">
                The rest of {collection.name}
              </h2>
              <Link
                href={`/collections/${collection.slug}`}
                className="u-focus u-link pb-1 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors hover:text-text"
              >
                View collection
              </Link>
            </Reveal>

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 pb-28 sm:grid-cols-2 lg:grid-cols-4 lg:pb-0">
              {related.map((p, i) => (
                <Reveal key={p.slug} delay={i * 80}>
                  <ProductCard
                    collection={collection}
                    product={p}
                    index={collection.products.indexOf(p)}
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
