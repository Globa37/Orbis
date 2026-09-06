import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_LANG, LANGS, LANG_NAME } from "@/lib/i18n";
import { asset } from "@/lib/site";

/**
 * The doorstep.
 *
 * Every real page lives under a language segment, so "/" only has to hand over
 * to one. A static export has no server to redirect with, so this does it the
 * two ways a file can: a meta refresh the browser acts on, and a pair of plain
 * links for anyone the refresh does not reach — a crawler, a reader with
 * scripting off, someone who wants the other language.
 */
export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: `/${DEFAULT_LANG}` },
  other: { refresh: `0; url=${asset(`/${DEFAULT_LANG}/`)}` },
};

export default function Doorstep() {
  return (
    <div className="grid min-h-[100svh] place-items-center px-6 text-center">
      <div>
        <p className="u-eyebrow">ORBIS</p>
        <ul className="mt-8 flex items-center justify-center gap-6">
          {LANGS.map((lang) => (
            <li key={lang}>
              <Link
                href={`/${lang}`}
                className="u-focus u-link text-[0.7rem] uppercase tracking-[0.28em] text-text"
              >
                {LANG_NAME[lang]}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
