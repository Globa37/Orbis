"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LANGS, LANG_SHORT, translator, type Lang } from "@/lib/i18n";

/**
 * Switches language without losing the visitor's place.
 *
 * The language is the first path segment, so the same page in the other
 * reading is the same path with that segment swapped — a product page stays on
 * that product. Only the segment is replaced, never a later one that happens
 * to match.
 */
export function LanguageSwitch({ lang, className = "" }: { lang: Lang; className?: string }) {
  const pathname = usePathname() ?? `/${lang}`;
  const t = translator(lang);

  const swap = (to: Lang) => {
    const rest = pathname.split("/").slice(2).join("/");
    return rest ? `/${to}/${rest}` : `/${to}`;
  };

  return (
    <div className={`flex items-center gap-2 ${className}`} role="group" aria-label={t("language")}>
      {LANGS.map((code, i) => (
        <span key={code} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden="true" className="text-line">/</span>}
          {code === lang ? (
            <span aria-current="true" className="text-[0.65rem] tracking-[0.24em] text-text">
              {LANG_SHORT[code]}
            </span>
          ) : (
            <Link
              href={swap(code)}
              className="u-focus text-[0.65rem] tracking-[0.24em] text-faint transition-colors duration-300 hover:text-text"
            >
              {LANG_SHORT[code]}
            </Link>
          )}
        </span>
      ))}
    </div>
  );
}
