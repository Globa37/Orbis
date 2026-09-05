import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { OrbisMark } from "@/components/OrbisMark";
import { ProductCard } from "@/components/ProductCard";
import { MILLENIUM } from "@/lib/catalog/millenium";

const PILLARS = [
  {
    n: "01",
    title: "One case, held constant",
    body: "A 38.5 mm polished cushion in stainless steel, unchanged across the collection. What changes is the light that falls on the dial.",
  },
  {
    n: "02",
    title: "The orb, drawn from a sphere",
    body: "Every dial carries the same mark: an orthographic globe, four meridian bands and one equator, laid out by geometry rather than by hand.",
  },
  {
    n: "03",
    title: "A world for each collection",
    body: "MILLENIUM was photographed against The Long Horizon. The next collection will have a sky of its own.",
  },
];

export default function HomePage() {
  const hero = MILLENIUM.products[0];
  const heroImage = hero.images.find((i) => i.role === "lifestyle")!;

  return (
    <>
      {/* ============================================================== hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/45 to-void" />
          <div className="absolute inset-0 bg-[radial-gradient(115%_78%_at_50%_40%,transparent_14%,rgba(5,7,10,0.92)_100%)]" />
        </div>

        <div className="mx-auto flex w-full max-w-[110rem] flex-1 flex-col justify-end px-5 pb-12 pt-20 sm:px-8 lg:px-12 lg:pb-20 lg:pt-32">
          <div className="flex flex-col items-stretch gap-6 lg:grid lg:items-end lg:gap-16 lg:[grid-template-columns:1.1fr_0.9fr]">
            <div className="order-2 lg:order-none">
              <Reveal>
                <p className="u-eyebrow">Collection {MILLENIUM.index}</p>
              </Reveal>
              <Reveal delay={120}>
                <h1 className="u-display mt-4 text-[clamp(3.25rem,14vw,13rem)] lg:mt-5">
                  Millenium
                </h1>
              </Reveal>
              <Reveal delay={240}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted lg:mt-7 lg:text-[1.0625rem]">
                  {MILLENIUM.tagline} A single cushion case, five readings of the
                  same orb, photographed against {MILLENIUM.world.name}.
                </p>
              </Reveal>
              <Reveal delay={340}>
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5 lg:mt-10">
                  <Link
                    href={`/collections/${MILLENIUM.slug}`}
                    className="u-focus rounded-full bg-text px-8 py-4 text-center text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
                  >
                    Explore the collection
                  </Link>
                  <Link
                    href={`/collections/${MILLENIUM.slug}/${hero.slug}`}
                    className="u-focus u-link self-center px-2 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors duration-300 hover:text-text sm:py-4"
                  >
                    Start with {hero.name}
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal
              delay={120}
              className="u-halo relative order-1 -mx-5 -mt-6 mb-0 sm:-mx-8 lg:order-none lg:mx-0 lg:mt-0"
            >
              <Image
                src={heroImage.src}
                alt={heroImage.alt}
                width={heroImage.width}
                height={heroImage.height}
                priority
                fetchPriority="high"
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="u-feather relative h-[40svh] w-full object-cover object-center sm:h-[44svh] lg:h-auto lg:object-contain"
              />
            </Reveal>
          </div>
        </div>

        <div aria-hidden="true" className="mx-auto w-full max-w-[110rem] px-5 pb-8 sm:px-8 lg:px-12">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.28em] text-faint">
            <span className="h-px w-10 bg-line" />
            Scroll
          </div>
        </div>
      </section>

      {/* ======================================================= manifesto */}
      <section className="border-t border-line">
        <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-36">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <Reveal>
              <OrbisMark size={44} className="text-steel" />
              <p className="u-eyebrow mt-8">The maison</p>
            </Reveal>
            <Reveal delay={100}>
              <p className="u-display text-[clamp(1.9rem,4.2vw,3.5rem)] leading-[1.08]">
                ORBIS makes watches for people who look up. Every dial carries the
                same orb — a sphere drawn in meridians — and every collection gives
                that sphere a different sky to sit against.
              </p>
              <p className="mt-8 max-w-xl leading-relaxed text-muted">
                {MILLENIUM.intro}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================= pillars */}
      <section className="border-t border-line bg-ink">
        <div className="mx-auto max-w-[110rem] px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="grid gap-px overflow-hidden rounded-sm bg-line md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal key={p.n} delay={i * 110} className="bg-ink p-8 lg:p-12">
                <span className="text-[0.65rem] tabular-nums tracking-[0.28em] text-faint">{p.n}</span>
                <h2 className="mt-6 font-display text-2xl leading-tight lg:text-3xl">{p.title}</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== collection */}
      <section className="border-t border-line" id="collection">
        <div className="mx-auto max-w-[110rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="u-eyebrow">Collection {MILLENIUM.index}</p>
              <h2 className="u-display mt-4 text-[clamp(2.5rem,7vw,5.5rem)]">Millenium</h2>
            </div>
            <Link
              href={`/collections/${MILLENIUM.slug}`}
              className="u-focus u-link pb-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors hover:text-text"
            >
              All five references
            </Link>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 xl:gap-x-5">
            {MILLENIUM.products.map((product, i) => (
              <Reveal key={product.slug} delay={i * 80}>
                <ProductCard collection={MILLENIUM} product={product} index={i} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================== world */}
      <section className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0 opacity-70" style={{ backgroundPosition: "center 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-void via-void/45 to-void" />
        </div>
        <div className="mx-auto max-w-[110rem] px-5 py-32 sm:px-8 lg:px-12 lg:py-44">
          <Reveal className="max-w-2xl">
            <p className="u-eyebrow">The world of Millenium</p>
            <h2 className="u-display mt-5 text-[clamp(2.5rem,7vw,5rem)]">{MILLENIUM.world.name}</h2>
            <p className="mt-7 max-w-lg leading-relaxed text-muted">
              A planet seen edge-on, almost entirely in shadow, with one cold arc of
              light along its limb. Every MILLENIUM reference was photographed into
              that same horizon — one session, one grade, five dials.
            </p>
            <Link
              href={`/collections/${MILLENIUM.slug}`}
              className="u-focus u-link mt-9 inline-block text-[0.7rem] uppercase tracking-[0.28em] text-text"
            >
              Enter the collection
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
