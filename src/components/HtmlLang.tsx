"use client";

import { useEffect } from "react";
import type { Lang } from "@/lib/i18n";
import { LOCALE } from "@/lib/i18n";

/**
 * Keeps <html lang> honest.
 *
 * The language lives in a route segment, but <html> is written by the root
 * layout, which sits above that segment and cannot see it. Rather than
 * duplicate the whole document shell per language, the root ships the default
 * and this corrects it for the other one — which screen readers and the
 * browser's own translation prompt both read.
 */
export function HtmlLang({ lang }: { lang: Lang }) {
  useEffect(() => {
    document.documentElement.lang = LOCALE[lang];
  }, [lang]);
  return null;
}
