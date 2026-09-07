import Image from "next/image";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CollectionHero } from "@/components/CollectionHero";
import { CollectionLineup } from "@/components/CollectionLineup";
import { OrbisMark } from "@/components/OrbisMark";
import { ProductCard } from "@/components/ProductCard";
import { MILLENIUM, TSUKI } from "@/lib/catalog";
import { asset } from "@/lib/site";
import { LANGS, isLang, path as langPath, translator, type Lang } from "@/lib/i18n";
import type { CSSProperties } from "react";
import { notFound } from "next/navigation";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const PILLARS: Record<Lang, { n: string; title: string; body: string }[]> = {
  de: [
    {
      n: "01",
      title: "Ein Gehäuse, konstant gehalten",
      body: "Ein 40-mm-Gehäuse aus Legierung an einem Edelstahlband, über die Kollektion hinweg unverändert. Was sich ändert, ist das Licht, das auf das Zifferblatt fällt.",
    },
    {
      n: "02",
      title: "Der Orb, aus einer Kugel gezeichnet",
      body: "Jedes Zifferblatt trägt dieselbe Marke: ein orthografischer Globus, vier Meridianbänder und ein Äquator, aus Geometrie gesetzt statt von Hand gezeichnet.",
    },
    {
      n: "03",
      title: "Eine Welt je Kollektion",
      body: "MILLENIUM entstand unter Erstem Licht: eine harte Quelle, ein Steinboden, alles Übrige dem Schatten überlassen. TSUKI bekommt ein eigenes Licht — den Mond.",
    },
  ],
  en: [
    {
      n: "01",
      title: "One case, held constant",
      body: "A 40 mm alloy case on a stainless-steel bracelet, unchanged across the collection. What changes is the light that falls on the dial.",
    },
    {
      n: "02",
      title: "The orb, drawn from a sphere",
      body: "Every dial carries the same mark: an orthographic globe, four meridian bands and one equator, laid out by geometry rather than by hand.",
    },
    {
      n: "03",
      title: "A world for each collection",
      body: "MILLENIUM was shot under First Light: one hard source, a stone floor, everything else given up to shadow. TSUKI takes a light of its own — the moon.",
    },
  ],
};

const MANIFESTO: Record<Lang, string> = {
  de: "Uhren für Menschen, die nach oben schauen. Jedes Zifferblatt trägt denselben Orb — und jede Kollektion gibt ihm einen anderen Himmel.",
  en: "Watches for people who look up. Every dial carries the same orb — and every collection gives it a sky of its own.",
};

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = translator(lang);

  return (
    <>
      {/* ============================================================== hero */}
      <section className="relative flex min-h-[100svh] flex-col justify-end overflow-hidden">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-b from-void/90 via-void/45 to-void" />
          <div className="absolute inset-0 bg-[radial-gradient(115%_78%_at_50%_40%,transparent_14%,rgba(5,7,10,0.92)_100%)]" />
        </div>

        <div className="u-gutter flex w-full flex-1 flex-col justify-end pb-12 pt-20 sm:px-8 lg:px-12 lg:pb-16 lg:pt-28">
          <div className="flex flex-col items-stretch gap-10 lg:grid lg:items-center lg:gap-16 lg:[grid-template-columns:0.92fr_1.08fr]">
            <div className="order-2 lg:order-none">
              <Reveal>
                <p className="u-eyebrow">
                  {t("collectionN")} {MILLENIUM.index}
                </p>
              </Reveal>
              <Reveal delay={120}>
                <h1 className="u-display u-display-xl mt-4 text-[clamp(3rem,9vw,8.5rem)] lg:mt-5">
                  Millenium
                </h1>
              </Reveal>
              <Reveal delay={240}>
                <p className="mt-5 max-w-md text-base leading-relaxed text-muted lg:mt-7 lg:text-[1.0625rem]">
                  {MILLENIUM.tagline[lang]} {MILLENIUM.intro[lang]}
                </p>
              </Reveal>
              <Reveal delay={340}>
                <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center sm:gap-5 lg:mt-10">
                  <Link
                    href={langPath(lang, `/collections/${MILLENIUM.slug}`)}
                    className="u-focus u-link self-center px-2 py-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors duration-300 hover:text-text sm:py-4"
                  >
                    {t("exploreCollection")}
                  </Link>
                </div>
              </Reveal>
            </div>

            <Reveal delay={120} className="order-1 lg:order-none">
              <CollectionHero

                labels={{ pick: t("pickReference"), view: t("startWith") }}
                refs={MILLENIUM.products.map((p) => ({
                  slug: p.slug,
                  name: p.name,
                  subtitle: p.subtitle[lang],
                  reference: p.reference,
                  accent: p.accent.base,
                  href: langPath(lang, `/collections/${MILLENIUM.slug}/${p.slug}`),
                }))}
              />
            </Reveal>
          </div>
        </div>

        <div aria-hidden="true" className="u-gutter w-full pb-8">
          <div className="flex items-center gap-3 text-[0.65rem] uppercase tracking-[0.28em] text-faint">
            <span className="h-px w-10 bg-line" />
            {t("scroll")}
          </div>
        </div>
      </section>

      {/* ======================================================= manifesto */}
      <section className="border-t border-line">
        <div className="u-gutter u-band">
          <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <Reveal>
              <OrbisMark size={44} className="text-steel" />
              <p className="u-eyebrow mt-8">{t("theMaison")}</p>
            </Reveal>
            <Reveal delay={100}>
              <p className="u-display text-[clamp(1.9rem,4.2vw,3.5rem)] leading-[1.08]">
                {MANIFESTO[lang]}
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ========================================================= pillars */}
      <section className="border-t border-line bg-ink">
        <div className="u-gutter u-band-tight">
          <div className="grid gap-px overflow-hidden rounded-sm bg-line md:grid-cols-3">
            {PILLARS[lang].map((p, i) => (
              <Reveal
                key={p.n}
                delay={i * 110}
                className="group relative overflow-hidden bg-ink p-8 lg:p-12"
              >
                {/* A single orbital arc, drawn once per pillar and lit on hover. */}
                <svg
                  aria-hidden="true"
                  viewBox="0 0 400 400"
                  className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 text-line transition-[color,transform] duration-[1400ms] [transition-timing-function:var(--ease-orbis)] group-hover:rotate-12 group-hover:text-steel/25"
                >
                  <ellipse cx="200" cy="200" rx="190" ry="190" fill="none" stroke="currentColor" strokeWidth="1" />
                  <ellipse cx="200" cy="200" rx="190" ry="72" fill="none" stroke="currentColor" strokeWidth="1" />
                  <ellipse cx="200" cy="200" rx="72" ry="190" fill="none" stroke="currentColor" strokeWidth="1" />
                </svg>
                <span className="u-num relative text-[0.65rem] tracking-[0.28em] text-faint">{p.n}</span>
                <h2 className="relative mt-6 font-display text-2xl leading-tight lg:text-3xl">{p.title}</h2>
                <p className="relative mt-4 max-w-sm text-sm leading-relaxed text-muted">{p.body}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================================== collection */}
      <section className="border-t border-line" id="collection">
        <div className="u-gutter u-band">
          <Reveal className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="u-eyebrow">
                  {t("collectionN")} {MILLENIUM.index}
                </p>
              <h2 className="u-display u-display-xl mt-4 text-[clamp(2.5rem,7vw,5.5rem)]">Millenium</h2>
            </div>
            <Link
              href={langPath(lang, `/collections/${MILLENIUM.slug}`)}
              className="u-focus u-link pb-2 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors hover:text-text"
            >
              {t("allFiveReferences")}
            </Link>
          </Reveal>

          <div className="mt-14 grid grid-cols-1 gap-x-6 gap-y-16 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-5 2xl:gap-x-7">
            {MILLENIUM.products.map((product, i) => (
              <Reveal key={product.slug} delay={i * 80}>
                <ProductCard collection={MILLENIUM} product={product} index={i} lang={lang} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================== world */}
      {/*
        The world band doubles as the collection's campaign frame: the grid
        above is for choosing a reference, this is for seeing the five as one
        set — which is the whole argument of MILLENIUM, since only the dial
        changes across it.
      */}
      <section className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0 opacity-80" style={{ backgroundPosition: "center 22%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-void via-void/35 to-void" />
        </div>
        <div className="u-gutter u-band">
          <div className="grid gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-20">
            <Reveal>
              <p className="u-eyebrow">
                {t("worldOf")} {MILLENIUM.name}
              </p>
              <h2 className="u-display u-display-xl mt-5 text-[clamp(2.5rem,7vw,5rem)]">
                {MILLENIUM.world.name[lang]}
              </h2>
              <p className="mt-7 max-w-lg leading-relaxed text-muted">
                {MILLENIUM.world.body[lang]}
              </p>
              <Link
                href={langPath(lang, `/collections/${MILLENIUM.slug}`)}
                className="u-focus u-link mt-9 inline-block text-[0.7rem] uppercase tracking-[0.28em] text-text"
              >
                {t("enterCollection")}
              </Link>
            </Reveal>

            {/* The one frame in the set that shows the collection rather than a
                reference: all five on the same slab, under the same light. */}
            <Reveal delay={120}>
              <Image
                src={asset("/products/millenium/collection-880.webp")}
                alt={
                  lang === "de"
                    ? "Die fünf MILLENIUM-Referenzen nebeneinander auf einer Steinplatte, unter einer einzigen harten Lichtquelle."
                    : "The five MILLENIUM references side by side on a stone slab under a single hard light."
                }
                width={880}
                height={1168}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 46vw"
                /* The frame is tall; cropped to 4:5 it keeps the shaft and the
                   slab without leaving the text column stranded beside it. */
                className="aspect-[4/5] w-full rounded-sm object-cover object-[50%_47%]"
              />
            </Reveal>
          </div>

          <Reveal delay={140} className="mt-16 lg:mt-24">
            <p className="u-eyebrow mb-8">{t("theCompleteCollection")}</p>
            <CollectionLineup collection={MILLENIUM} lang={lang} />
          </Reveal>
        </div>
      </section>

      {/* ==================================================== next collection */}
      {/*
        TSUKI gets its own sky rather than a paragraph at the foot of the page.
        The plate, the tone and the rhythm are its own; the type, the hairlines
        and the eyebrow are the house's, so the two collections read as two
        rooms in one building.
      */}
      <section
        className="relative overflow-hidden border-t border-line"
        style={{ "--plate": `url("${asset("/world/still-water.webp")}")` } as CSSProperties}
      >
        {/*
          The tone belongs on this layer, not on the section: a background
          colour on the section paints over its own negatively-stacked
          children, which is what was hiding the plate.
        */}
        <div aria-hidden="true" className="absolute inset-0 -z-10" style={{ backgroundColor: TSUKI.world.tone }}>
          {/* Narrow viewports put the moon above the type, wide ones beside it. */}
          <div className="u-plate u-drift absolute inset-0 [background-position:68%_16%] lg:[background-position:58%_34%]" />
          {/* The scrim follows: vertical where the type sits under the moon,
              horizontal where it sits next to it. */}
          <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_0%,rgba(6,10,18,0.50)_20%,rgba(6,10,18,0.93)_38%,rgba(6,10,18,0.96)_100%)] lg:hidden" />
          <div className="absolute inset-0 hidden lg:block lg:bg-[linear-gradient(96deg,rgba(6,10,18,0.93)_0%,rgba(6,10,18,0.78)_34%,rgba(6,10,18,0.12)_62%,transparent_88%)]" />
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[#060A12] to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#060A12] to-transparent" />
        </div>

        <div className="u-gutter pb-[clamp(6rem,15vw,15rem)] pt-[clamp(11rem,26vw,15rem)]">
          <Reveal className="max-w-xl">
            <p className="u-eyebrow">
              {t("collectionN")} {TSUKI.index}
            </p>
            {/* The character sits beside the name at the same optical weight as
                a reference number — a mark, not decoration. */}
            <div className="mt-5 flex items-baseline gap-6">
              <h2 className="u-display u-display-xl text-[clamp(2.75rem,8vw,6.5rem)]">{TSUKI.name}</h2>
              <span
                lang="ja"
                aria-hidden="true"
                className="font-display text-[clamp(1.25rem,3vw,2.25rem)] leading-none text-steel/70"
              >
                月
              </span>
            </div>
            <p className="mt-4 font-display text-[clamp(1.25rem,2.6vw,1.9rem)] leading-snug text-steel">
              {TSUKI.tagline[lang]}
            </p>

            {/* One hairline, set where a shoji frame would put it. */}
            <span aria-hidden="true" className="mt-10 block h-px w-24 bg-steel/35" />

            <p className="u-eyebrow mt-8 text-steel/80">{TSUKI.world.name[lang]}</p>

            <p className="mt-5 max-w-lg leading-relaxed text-muted">{TSUKI.intro[lang]}</p>

            <div className="mt-10 flex flex-wrap items-center gap-x-6 gap-y-4">
              <Link
                href={langPath(lang, `/collections/${TSUKI.slug}`)}
                className="u-focus rounded-full border border-steel/40 px-8 py-4 text-[0.7rem] uppercase tracking-[0.28em] text-text transition-colors duration-300 hover:border-steel hover:bg-steel/10"
              >
                {t("enterCollection")}
              </Link>
              <span className="text-[0.65rem] uppercase tracking-[0.24em] text-faint">
                {t("comingSoon")}
              </span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
