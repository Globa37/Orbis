import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { SupportDialog } from "@/components/support/SupportDialog";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { PageTransition } from "@/components/PageTransition";
import { HtmlLang } from "@/components/HtmlLang";
import { LANGS, isLang, translator, type Lang } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

const META: Record<Lang, { title: string; description: string; og: string }> = {
  de: {
    title: "ORBIS — Uhren aus einer anderen Welt",
    description:
      "ORBIS baut Objekte für Menschen, die nach oben schauen. MILLENIUM, die erste Kollektion: ein Kissengehäuse, fünf Lesarten desselben Orbs.",
    og: "MILLENIUM, die erste ORBIS-Kollektion. Fünf Zifferblätter. Ein Orbit.",
  },
  en: {
    title: "ORBIS — Luxury watches from another world",
    description:
      "ORBIS builds mechanical objects for people who look up. MILLENIUM, the first collection: one cushion case, five readings of the same orb.",
    og: "MILLENIUM, the first ORBIS collection. Five dials. One orbit.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const m = META[lang];
  return {
    title: { default: m.title, template: "%s · ORBIS" },
    description: m.description,
    alternates: {
      canonical: `/${lang}`,
      languages: { de: "/de", en: "/en" },
    },
    openGraph: {
      locale: lang === "de" ? "de_DE" : "en_GB",
      url: `/${lang}`,
      title: m.title,
      description: m.og,
    },
    twitter: { title: m.title, description: m.og },
  };
}

export default async function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = translator(lang);

  return (
    <>
      <HtmlLang lang={lang} />
      <a
        href="#main"
        className="u-focus sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-white focus:px-5 focus:py-2 focus:text-sm focus:text-void"
      >
        {t("skipToContent")}
      </a>
      <SiteHeader lang={lang} />
      <main id="main">
        <PageTransition>{children}</PageTransition>
      </main>
      <SiteFooter lang={lang} />
      <CartDrawer lang={lang} />
      <SupportDialog lang={lang} />
    </>
  );
}
