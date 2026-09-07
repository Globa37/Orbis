import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Reveal } from "@/components/Reveal";
import { OrbisMark } from "@/components/OrbisMark";
import { SupportButton } from "@/components/support/SupportButton";
import { SHOP_COLLECTIONS } from "@/lib/catalog";
import {
  LANGS,
  isLang,
  path as langPath,
  translator,
  type Lang,
  type StringKey,
} from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const HEAD: Record<Lang, { title: string; intro: string; description: string }> = {
  de: {
    title: "Ein Orb, eine Kollektion nach der anderen.",
    intro:
      "ORBIS ist ein kleines Uhrenhaus. Wir veröffentlichen eine Kollektion nach der anderen, halten das Gehäuse über sie hinweg konstant und geben jeder Kollektion eine eigene Welt, in die hinein sie fotografiert wird.",
    description:
      "Wie ORBIS gefertigt, versandt und gewartet wird. Ein Orb, eine Kollektion nach der anderen.",
  },
  en: {
    title: "One orb, one collection at a time.",
    intro:
      "ORBIS is a small watchmaking house. We release one collection at a time, hold the case constant across it, and give each collection a world of its own to be photographed into.",
    description:
      "How ORBIS is made, shipped and serviced. One orb, one collection at a time.",
  },
};

const SECTIONS: { id: string; key: StringKey; body: Record<Lang, string> }[] = [
  {
    id: "shipping",
    key: "shippingReturns",
    body: {
      de: "Bestellungen gehen versichert und mit Unterschrift heraus, der Versand ist weltweit kostenfrei. Ungetragene Rückgaben nehmen wir in der Originalverpackung an. Die vollständigen Bedingungen werden an der Kasse bestätigt.",
      en: "Orders are dispatched insured and signed-for, with complimentary worldwide delivery. Unworn returns are accepted in their original packaging. Full terms are confirmed at checkout.",
    },
  },
  {
    id: "warranty",
    key: "warranty",
    body: {
      de: "Jede ORBIS ist durch eine internationale Garantie gegen Fertigungsfehler abgedeckt, hinterlegt auf ihre Referenznummer. Die vollständigen Garantiebedingungen liegen jeder Uhr bei.",
      en: "Each ORBIS is covered by an international warranty against manufacturing defect, registered to its reference number. Full warranty terms accompany every watch.",
    },
  },
  {
    id: "servicing",
    key: "servicing",
    body: {
      de: "Der Service läuft über das ORBIS-Atelier. Schreib uns mit deiner Referenznummer, dann organisieren wir Abholung und Rücksendung.",
      en: "Servicing is handled through the ORBIS atelier. Write to us with your reference number and we will arrange collection and return.",
    },
  },
  {
    id: "contact",
    key: "contact",
    body: {
      de: "Schriftliche Anfragen beantworten wir innerhalb eines Werktags. Für Größe, Verfügbarkeit oder alles andere: schreib dem Atelier.",
      en: "Written enquiries are answered within one working day. For sizing, availability or anything else, write to the atelier.",
    },
  },
];

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = translator(lang);
  return {
    title: t("maison"),
    description: HEAD[lang].description,
    alternates: {
      canonical: langPath(lang, "/maison"),
      languages: Object.fromEntries(LANGS.map((l) => [l, langPath(l, "/maison")])),
    },
  };
}

export default async function MaisonPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = translator(lang);
  const head = HEAD[lang];
  const shop = SHOP_COLLECTIONS[0];

  return (
    <>
      <section className="relative overflow-hidden border-b border-line">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="u-plate u-drift absolute inset-0 opacity-60" style={{ backgroundPosition: "center 24%" }} />
          <div className="absolute inset-0 bg-gradient-to-b from-void via-void/55 to-void" />
        </div>
        <div className="u-gutter pb-20 pt-40 lg:pb-28 lg:pt-48">
          <Reveal>
            <OrbisMark size={42} className="text-steel" />
            <p className="u-eyebrow mt-8">{t("theMaison")}</p>
            <h1 className="u-display u-display-xl mt-5 max-w-4xl text-[clamp(2.5rem,8vw,6rem)]">{head.title}</h1>
            <p className="mt-8 max-w-xl leading-relaxed text-muted">{head.intro}</p>
          </Reveal>
        </div>
      </section>

      <section className="u-gutter py-20 lg:py-28">
        <div className="grid gap-px overflow-hidden rounded-sm bg-line md:grid-cols-2">
          {SECTIONS.map((s, i) => (
            <Reveal key={s.id} delay={i * 90} className="bg-void p-8 lg:p-12">
              <h2 id={s.id} className="scroll-mt-28 font-display text-3xl">
                {t(s.key)}
              </h2>
              <p className="mt-5 max-w-md leading-relaxed text-muted">{s.body[lang]}</p>
              {s.id === "contact" && (
                <div className="mt-6 flex flex-wrap items-center gap-5">
                  <SupportButton lang={lang} className="-ml-2" />
                  <a
                    href="mailto:atelier@orbis.watch"
                    className="u-focus u-link text-[0.7rem] uppercase tracking-[0.28em] text-text"
                  >
                    atelier@orbis.watch
                  </a>
                </div>
              )}
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-20 border-t border-line pt-16 text-center">
          <p className="u-display text-[clamp(1.75rem,4vw,3rem)]">{shop.tagline[lang]}</p>
          <Link
            href={langPath(lang, `/collections/${shop.slug}`)}
            className="u-focus mt-8 inline-block rounded-full bg-text px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
          >
            {t("exploreCollection")}
          </Link>
        </Reveal>
      </section>
    </>
  );
}
