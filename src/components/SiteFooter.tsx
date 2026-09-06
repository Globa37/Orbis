import Link from "next/link";
import { OrbisMark } from "./OrbisMark";
import { SupportButton } from "./support/SupportButton";
import { COLLECTIONS } from "@/lib/catalog";
import { path, translator, type Lang, type StringKey } from "@/lib/i18n";

const CARE: { key: StringKey; hash: string }[] = [
  { key: "shippingReturns", hash: "#shipping" },
  { key: "warranty", hash: "#warranty" },
  { key: "servicing", hash: "#servicing" },
  { key: "contact", hash: "#contact" },
];

const LINE: Record<Lang, { promise: string; body: string; rights: string }> = {
  de: {
    promise: "Uhren aus einer anderen Welt.",
    body: "In kleinen Serien gefertigt. Jede ORBIS trägt denselben Orb, und keine zwei Kollektionen tragen denselben Himmel.",
    rights: "Alle Rechte vorbehalten.",
  },
  en: {
    promise: "Luxury watches from another world.",
    body: "Assembled in small series. Every ORBIS carries the same orb, and no two collections carry the same sky.",
    rights: "All rights reserved.",
  },
};

export function SiteFooter({ lang }: { lang: Lang }) {
  const t = translator(lang);
  const copy = LINE[lang];

  return (
    <footer className="border-t border-line bg-ink">
      <div className="u-gutter py-16 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <OrbisMark size={34} className="text-steel" />
            <p className="mt-6 max-w-xs font-display text-2xl leading-tight text-text">
              {copy.promise}
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-faint">{copy.body}</p>
          </div>

          <nav aria-labelledby="f-collections">
            <h2 id="f-collections" className="u-eyebrow">
              {t("collections")}
            </h2>
            <ul className="mt-5 space-y-3">
              {COLLECTIONS.map((c) => (
                <li key={c.slug} className="flex items-baseline gap-2">
                  <Link
                    href={path(lang, `/collections/${c.slug}`)}
                    className="u-focus u-link text-sm text-muted transition-colors hover:text-text"
                  >
                    {c.name}
                  </Link>
                  {c.status === "announced" && (
                    <span className="text-[0.65rem] uppercase tracking-[0.2em] text-faint">
                      {t("comingSoon")}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="f-care">
            <h2 id="f-care" className="u-eyebrow">
              {t("clientCare")}
            </h2>
            <ul className="mt-5 space-y-3">
              {CARE.map((c) => (
                <li key={c.key}>
                  <Link
                    href={path(lang, `/maison${c.hash}`)}
                    className="u-focus u-link text-sm text-muted transition-colors hover:text-text"
                  >
                    {t(c.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="u-eyebrow">{t("support")}</h2>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-faint">{t("supportIntro")}</p>
            <div className="mt-5 flex items-center gap-3">
              <SupportButton lang={lang} className="-ml-2" />
              <a
                href="mailto:atelier@orbis.watch"
                className="u-focus u-link text-sm text-muted transition-colors hover:text-text"
              >
                atelier@orbis.watch
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-line pt-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ORBIS. {copy.rights}</p>
          <p className="u-wordmark !tracking-[0.5em] text-[0.65rem]">Orbis</p>
        </div>
      </div>
    </footer>
  );
}
