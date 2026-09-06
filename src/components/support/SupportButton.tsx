"use client";

import { translator, type Lang } from "@/lib/i18n";
import { useSupport } from "./support-store";

/** The envelope in the header. Opens the message panel. */
export function SupportButton({ lang, className = "" }: { lang: Lang; className?: string }) {
  const t = translator(lang);
  const { setOpen } = useSupport();

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      aria-label={t("openSupport")}
      className={`u-focus rounded-full p-2 text-muted transition-colors duration-300 hover:text-text ${className}`}
    >
      <svg width="19" height="19" viewBox="0 0 20 20" fill="none" aria-hidden="true">
        {/* An envelope drawn as one closed body plus the flap's two folds. */}
        <rect x="1.5" y="4" width="17" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.1" />
        <path d="M1.9 4.9 10 11l8.1-6.1" stroke="currentColor" strokeWidth="1.1" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
