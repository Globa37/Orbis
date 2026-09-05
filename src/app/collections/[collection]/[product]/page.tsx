import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { ProductCard } from "@/components/ProductCard";
import { ProductGallery } from "@/components/ProductGallery";
import { Reveal } from "@/components/Reveal";
import { OrbisMark } from "@/components/OrbisMark";
import { allProducts, getProduct } from "@/lib/catalog/millenium";
import { formatPrice } from "@/lib/catalog/types";

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
  const { collection, product } = await params;
  const found = getProduct(collection, product);
  if (!found) return {};
  return {
    title: `${found.product.name} — ${found.collection.name.toUpperCase()}`,
    description: found.product.description,
    openGraph: {
      images: [{ url: found.product.images[0].src }],
    },
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

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `ORBIS ${collection.name} ${product.name}`,
    sku: product.reference,
    brand: { "@type": "Brand", name: "ORBIS" },
    description: product.description,
    image: product.images.map((i) => i.src),
    offers: {
      "@type": "Offer",
      price: (product.priceCents / 100).toFixed(2),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div style={{ ["--accent" as string]: product.accent.base, ["--accent-glow" as string]: product.accent.glow }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="mx-auto max-w-[110rem] px-5 pt-28 sm:px-8 lg:px-12 lg:pt-32">
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
      <section className="mx-auto max-w-[110rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
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

            <div className="mt-9">
              <AddToCart
                collection={collection}
                product={product}
                image={product.images[0].src}
              />
            </div>

            <p className="mt-8 max-w-lg leading-relaxed text-muted">{product.description}</p>

            <dl className="mt-10 divide-y divide-line border-y border-line">
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
                Assembled in small series and delivered in the ORBIS presentation case
                with a two-year international warranty.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================== related */}
      {related.length > 0 && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
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

            <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
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
