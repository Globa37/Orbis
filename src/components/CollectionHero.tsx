"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { asset } from "@/lib/site";

/*
 * The homepage opens on the collection rather than on one watch: five cutouts
 * of the campaign photographs, any of which can be brought forward. The
 * cutouts are the real frames with the background removed, so the watches are
 * the photographs — only the studio floor is gone.
 */
export type HeroRef = {
  slug: string;
  name: string;
  subtitle: string;
  reference: string;
  href: string;
  accent: string;
};

export function CollectionHero({
  refs,
  labels,
}: {
  refs: HeroRef[];
  labels: { pick: string; view: string };
}) {
  const [active, setActive] = useState(0);
  const current = refs[active];

  return (
    <div className="flex flex-col items-center">
      {/* The selected reference, held at a constant size so switching between
          them reads as one camera rather than five. */}
      <div className="relative flex h-[40svh] w-full items-end justify-center sm:h-[46svh] lg:h-[46svh]">
        {refs.map((r, i) => (
          <Image
            key={r.slug}
            src={asset(`/cutouts/${r.slug}-1400.webp`)}
            alt={`ORBIS Millenium ${r.name}`}
            width={913}
            height={1563}
            priority={i === 0}
            sizes="(max-width: 640px) 62vw, (max-width: 1024px) 42vw, 30vw"
            aria-hidden={i !== active}
            className={`absolute bottom-0 h-full w-auto object-contain transition-[opacity,transform] duration-[900ms] [transition-timing-function:var(--ease-orbis)] ${
              i === active
                ? "opacity-100 [transform:translateY(0)_scale(1)]"
                : "pointer-events-none opacity-0 [transform:translateY(10px)_scale(0.97)]"
            }`}
          />
        ))}
        {/* Contact shadow, so the watch stands on something. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute bottom-0 h-16 w-[46%] max-w-sm rounded-[50%] bg-[radial-gradient(closest-side,rgba(0,0,0,0.72),transparent)] blur-md"
        />
      </div>

      <p className="u-eyebrow mt-6 text-center" id="hero-pick">
        {labels.pick}
      </p>

      {/* The picker itself. Radio semantics: one choice out of five. */}
      <div
        role="radiogroup"
        aria-labelledby="hero-pick"
        className="mt-4 grid w-full max-w-md grid-cols-5 items-end gap-1 sm:gap-2"
      >
        {refs.map((r, i) => (
          <button
            key={r.slug}
            type="button"
            role="radio"
            aria-checked={i === active}
            onClick={() => setActive(i)}
            className="u-focus group flex min-w-0 flex-col items-center rounded-sm px-0.5 pb-2 pt-2 sm:px-2"
          >
            <Image
              src={asset(`/cutouts/${r.slug}-560.webp`)}
              alt=""
              width={560}
              height={959}
              sizes="92px"
              className={`h-14 w-auto object-contain transition-[opacity,transform] duration-500 sm:h-16 ${
                i === active
                  ? "opacity-100"
                  : "opacity-45 group-hover:opacity-80 group-hover:[transform:translateY(-2px)]"
              }`}
            />
            <span
              className={`mt-2 truncate text-[0.55rem] uppercase tracking-[0.12em] transition-colors duration-300 sm:text-[0.65rem] sm:tracking-[0.2em] ${
                i === active ? "text-text" : "text-faint group-hover:text-muted"
              }`}
            >
              {r.name}
            </span>
            <span
              aria-hidden="true"
              className="mt-2 h-px w-full transition-[background-color,transform] duration-500"
              style={{
                backgroundColor: i === active ? r.accent : "transparent",
                transform: i === active ? "scaleX(1)" : "scaleX(0.2)",
              }}
            />
          </button>
        ))}
      </div>

      {/* What was picked, and the way into it. */}
      <div className="mt-6 flex flex-col items-center gap-3 text-center">
        <p className="text-sm leading-relaxed text-muted">{current.subtitle}</p>
        <Link
          href={current.href}
          className="u-focus rounded-full bg-text px-8 py-4 text-[0.7rem] font-medium uppercase tracking-[0.28em] text-void transition-colors duration-300 hover:bg-white"
        >
          {labels.view} {current.name}
        </Link>
        <span className="u-num text-[0.65rem] uppercase tracking-[0.28em] text-faint">
          {current.reference}
        </span>
      </div>
    </div>
  );
}
