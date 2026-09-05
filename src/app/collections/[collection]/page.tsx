import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { ProductCard } from "@/components/ProductCard";
import { COLLECTIONS, getCollection } from "@/lib/catalog/millenium";
import { formatPrice } from "@/lib/catalog/types";

export function generateStaticParams() {
  return COLLECTIONS.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ collection: string }>;
}): Promise<Metadata> {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) return {};
  return {
    title: collection.name.toUpperCase(),
    description: collection.intro,
  };
}

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ collection: string }>;
}) {
  const { collection: slug } = await params;
  const collection = getCollection(slug);
  if (!collection) notFound();

  const showcase = collection.products[0].images.find((i) => i.role === "lifestyle")!;

  return (
    <>
      {/* The collection gets its own world, not the site's generic one. */}
      <section className="relative flex min-h-[86svh] items-end overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0" style={{ backgroundPosition: "center 52%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-void/85 via-void/30 to-void" />
        </div>

        <div className="mx-auto w-full max-w-[110rem] px-5 pb-16 pt-36 sm:px-8 lg:px-12 lg:pb-24">
          <Reveal>
            <p className="u-eyebrow">Collection {collection.index} · {collection.products.length} references</p>
          </Reveal>
          <Reveal delay={110}>
            <h1 className="u-display mt-5 text-[clamp(3.5rem,15vw,13rem)]">{collection.name}</h1>
          </Reveal>
          <Reveal delay={220}>
            <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1fr] lg:gap-20">
              <p className="max-w-lg text-[1.0625rem] leading-relaxed text-muted">
                {collection.intro}
              </p>
              <dl className="grid max-w-md grid-cols-2 gap-x-8 gap-y-6 self-end text-sm">
                <div>
                  <dt className="u-eyebrow !text-[0.6rem]">World</dt>
                  <dd className="mt-2 text-text">{collection.world.name}</dd>
                </div>
                <div>
                  <dt className="u-eyebrow !text-[0.6rem]">Case</dt>
                  <dd className="mt-2 text-text">40 mm alloy, steel bracelet</dd>
                </div>
                <div>
                  <dt className="u-eyebrow !text-[0.6rem]">References</dt>
                  <dd className="mt-2 text-text">MLN-01 — MLN-0{collection.products.length}</dd>
                </div>
                <div>
                  <dt className="u-eyebrow !text-[0.6rem]">Price</dt>
                  <dd className="mt-2 text-text">
                    {formatPrice(collection.products[0].priceCents)} each
                  </dd>
                </div>
              </dl>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================================================= grid */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8">
            {collection.products.map((product, i) => (
              <Reveal key={product.slug} delay={(i % 3) * 90}>
                <ProductCard
                  collection={collection}
                  product={product}
                  index={i}
                  priority={i < 3}
                />
              </Reveal>
            ))}

            {/* A quiet placeholder so the grid stays balanced and the roadmap reads. */}
            <Reveal delay={180} className="hidden lg:block">
              <div className="flex aspect-4/5 flex-col items-start justify-end rounded-sm border border-dashed border-line p-8">
                <p className="u-eyebrow">Collection 02</p>
                <p className="mt-3 font-display text-3xl text-muted">In orbit</p>
                <p className="mt-3 max-w-[16rem] text-sm text-faint">
                  A new case, a new world, the same orb.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ======================================================== campaign */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:gap-20">
            <Reveal>
              <Image
                src={showcase.src}
                alt={showcase.alt}
                width={showcase.width}
                height={showcase.height}
                loading="lazy"
                sizes="(max-width: 1024px) 92vw, 55vw"
                className="w-full rounded-sm"
              />
            </Reveal>
            <Reveal delay={120}>
              <p className="u-eyebrow">One session</p>
              <h2 className="u-display mt-5 text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05]">
                Every reference, photographed into the same horizon.
              </h2>
              <p className="mt-7 leading-relaxed text-muted">
                Same key light at thirty-five degrees. Same falloff, same grade, same
                distance from the lens. The only variable in the entire campaign is the
                dial — which is the only variable in the collection.
              </p>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
