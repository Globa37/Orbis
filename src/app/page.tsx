import type { Metadata } from "next";
import Link from "next/link";
import { DEFAULT_LANG, LANGS, LANG_NAME } from "@/lib/i18n";
import { asset } from "@/lib/site";

/**
 * The doorstep.
 *
 * Every real page lives under a language segment, so "/" only has to hand over
 * to one. A static export has no server to redirect with, so this does it the
 * two ways a file can, and neither is the metadata API: Next writes anything
 * in `other` as <meta name>, and a refresh only works as <meta http-equiv>,
 * which is a distinction a browser takes literally.
 *
 * So the handover is a script, and under it sit two plain links — for a
 * crawler, for a reader with scripting off, and for anyone who wants the other
 * language rather than the default.
 */
const TARGET = asset(`/${DEFAULT_LANG}/`);

export const metadata: Metadata = {
  robots: { index: false, follow: true },
  alternates: { canonical: `/${DEFAULT_LANG}` },
};

export default function Doorstep() {
  return (
    <div className="grid min-h-[100svh] place-items-center px-6 text-center">
      {/* replace, not assign: the doorstep should not sit in the back history. */}
      <script
        dangerouslySetInnerHTML={{
          __html: `location.replace(${JSON.stringify(TARGET)})`,
        }}
      />
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
