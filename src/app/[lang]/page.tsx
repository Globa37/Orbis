import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { CollectionHero } from "@/components/CollectionHero";
import { OrbisMark } from "@/components/OrbisMark";
import { ProductCard } from "@/components/ProductCard";
import { MILLENIUM, TSUKI } from "@/lib/catalog";
import { LANGS, isLang, path as langPath, translator, type Lang } from "@/lib/i18n";
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
  de: "ORBIS baut Uhren für Menschen, die nach oben schauen. Jedes Zifferblatt trägt denselben Orb — eine in Meridianen gezeichnete Kugel — und jede Kollektion gibt dieser Kugel einen anderen Himmel, vor dem sie steht.",
  en: "ORBIS makes watches for people who look up. Every dial carries the same orb — a sphere drawn in meridians — and every collection gives that sphere a different sky to sit against.",
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
                <h1 className="u-display mt-4 text-[clamp(3rem,9vw,8.5rem)] lg:mt-5">
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
              <p className="mt-8 max-w-xl leading-relaxed text-muted">
                {MILLENIUM.world.body[lang]}
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
              <h2 className="u-display mt-4 text-[clamp(2.5rem,7vw,5.5rem)]">Millenium</h2>
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
      <section className="relative overflow-hidden border-t border-line">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0 opacity-70" style={{ backgroundPosition: "center 30%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-void via-void/45 to-void" />
        </div>
        <div className="u-gutter u-band">
          <Reveal className="max-w-2xl">
            <p className="u-eyebrow">
              {t("worldOf")} {MILLENIUM.name}
            </p>
            <h2 className="u-display mt-5 text-[clamp(2.5rem,7vw,5rem)]">
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
        </div>
      </section>

      {/* ==================================================== next collection */}
      <section className="border-t border-line bg-ink">
        <div className="u-gutter u-band-tight">
          <Reveal className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-24">
            <div>
              <p className="u-eyebrow">
                {t("collectionN")} {TSUKI.index}
              </p>
              <h2 className="u-display mt-4 text-[clamp(2.5rem,7vw,5rem)]">{TSUKI.name}</h2>
              <p className="mt-4 font-display text-2xl text-steel">{TSUKI.tagline[lang]}</p>
            </div>
            <div className="self-end">
              <p className="max-w-lg leading-relaxed text-muted">{TSUKI.intro[lang]}</p>
              <div className="mt-8 flex flex-wrap items-center gap-5">
                <Link
                  href={langPath(lang, `/collections/${TSUKI.slug}`)}
                  className="u-focus rounded-full border border-line px-7 py-3.5 text-[0.7rem] uppercase tracking-[0.28em] text-text transition-colors duration-300 hover:border-steel"
                >
                  {TSUKI.world.name[lang]}
                </Link>
                <span className="text-[0.65rem] uppercase tracking-[0.24em] text-faint">
                  {t("comingSoon")}
                </span>
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
