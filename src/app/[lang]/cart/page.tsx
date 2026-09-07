import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CartView } from "@/components/cart/CartView";
import { LANGS, isLang, translator } from "@/lib/i18n";

export function generateStaticParams() {
  return LANGS.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!isLang(lang)) return {};
  const t = translator(lang);
  return {
    title: t("bag"),
    // A bag is personal and always different; there is nothing here to index.
    robots: { index: false, follow: true },
    alternates: { canonical: `/${lang}/cart` },
  };
}

export default async function CartPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const t = translator(lang);

  return (
    <div className="u-gutter pb-24 pt-32 lg:pt-40">
      <h1 className="u-display u-display-xl text-[clamp(2.5rem,8vw,5.5rem)]">{t("bag")}</h1>
      <CartView lang={lang} />
    </div>
  );
}
