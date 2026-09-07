import Link from "next/link";
import { OrbisMark } from "@/components/OrbisMark";
import { DEFAULT_LANG, path as langPath, translator } from "@/lib/i18n";

/*
 * The global 404, which sits above the language segments and so cannot know
 * which language the visitor was reading. It answers in the default one and
 * sends them back to that language's home.
 */
export default function NotFound() {
  const t = translator(DEFAULT_LANG);
  return (
    <section className="relative grid min-h-[100svh] place-items-center overflow-hidden px-5 text-center">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="u-plate u-drift absolute inset-0 opacity-55" />
        <div className="absolute inset-0 bg-gradient-to-b from-void via-void/60 to-void" />
      </div>
      <div>
        <OrbisMark size={48} className="mx-auto text-steel" />
        <p className="u-eyebrow mt-8">{t("outOfOrbit")}</p>
        <h1 className="u-display u-display-xl mt-5 text-[clamp(3rem,12vw,8rem)]">404</h1>
        <p className="mx-auto mt-6 max-w-sm leading-relaxed text-muted">
          {t("notFoundBody")}
        </p>
        <Link
          href={langPath(DEFAULT_LANG)}
          className="u-focus mt-10 inline-block rounded-full bg-text px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
        >
          {t("returnToOrbis")}
        </Link>
      </div>
    </section>
  );
}
