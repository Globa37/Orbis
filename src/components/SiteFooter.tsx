import Link from "next/link";
import { OrbisMark } from "./OrbisMark";
import { COLLECTIONS } from "@/lib/catalog/millenium";

const CARE = [
  { label: "Shipping & returns", href: "/maison#shipping" },
  { label: "Warranty", href: "/maison#warranty" },
  { label: "Servicing", href: "/maison#servicing" },
  { label: "Contact", href: "/maison#contact" },
];

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="u-gutter py-16 lg:py-24">
        <div className="grid gap-14 lg:grid-cols-[1.4fr_1fr_1fr_1.2fr]">
          <div>
            <OrbisMark size={34} className="text-steel" />
            <p className="mt-6 max-w-xs font-display text-2xl leading-tight text-text">
              Luxury watches from another world.
            </p>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-faint">
              Assembled in small series. Every ORBIS carries the same orb, and no two
              collections carry the same sky.
            </p>
          </div>

          <nav aria-labelledby="f-collections">
            <h2 id="f-collections" className="u-eyebrow">Collections</h2>
            <ul className="mt-5 space-y-3">
              {COLLECTIONS.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/collections/${c.slug}`}
                    className="u-focus u-link text-sm text-muted transition-colors hover:text-text"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
              <li className="text-sm text-faint">Collection 02 — in orbit</li>
            </ul>
          </nav>

          <nav aria-labelledby="f-care">
            <h2 id="f-care" className="u-eyebrow">Client care</h2>
            <ul className="mt-5 space-y-3">
              {CARE.map((c) => (
                <li key={c.label}>
                  <Link
                    href={c.href}
                    className="u-focus u-link text-sm text-muted transition-colors hover:text-text"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="u-eyebrow">Dispatches</h2>
            <p className="mt-5 text-sm leading-relaxed text-faint">
              New collections, released one orbit at a time.
            </p>
            <form className="mt-5 flex items-center border-b border-line pb-2">
              <label htmlFor="email" className="sr-only">Email address</label>
              <input
                id="email"
                type="email"
                required
                placeholder="Email address"
                className="u-focus w-full bg-transparent text-sm text-text placeholder:text-faint"
              />
              <button
                type="submit"
                className="u-focus shrink-0 pl-3 text-[0.7rem] uppercase tracking-[0.28em] text-muted transition-colors hover:text-text"
              >
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 flex flex-col-reverse gap-4 border-t border-line pt-8 text-xs text-faint sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} ORBIS. All rights reserved.</p>
          <p className="u-wordmark !tracking-[0.5em] text-[0.65rem]">Orbis</p>
        </div>
      </div>
    </footer>
  );
}
