"use client";

import Image from "next/image";
import { useState } from "react";
import type { ProductImage } from "@/lib/catalog/types";
import { shotLabel } from "@/lib/catalog/shots";

/**
 * A showroom rather than a carousel: the active frame stays large, the
 * alternatives sit beside it, and nothing moves unless the visitor asks.
 */
export function ProductGallery({ images, name }: { images: ProductImage[]; name: string }) {
  const [active, setActive] = useState(0);
  const current = images[active];

  return (
    <div className="flex min-w-0 flex-col-reverse gap-4 lg:flex-row lg:gap-6 lg:self-start">
      <div
        role="tablist"
        aria-label={`${name} views`}
        className="flex min-w-0 gap-3 overflow-x-auto pb-1 [scrollbar-width:none] lg:w-24 lg:flex-col lg:overflow-visible lg:pb-0"
      >
        {images.map((img, i) => (
          <button
            key={img.role}
            role="tab"
            aria-selected={i === active}
            aria-controls="gallery-frame"
            onClick={() => setActive(i)}
            className={`u-focus relative aspect-[4/5] w-20 shrink-0 overflow-hidden rounded-sm border transition-colors duration-300 lg:w-full ${
              i === active ? "border-steel" : "border-line hover:border-muted"
            }`}
          >
            <Image
              src={img.src}
              alt=""
              fill
              sizes="96px"
              loading="lazy"
              className="object-cover"
            />
            <span className="sr-only">{shotLabel(img.role)}</span>
          </button>
        ))}
      </div>

      <figure id="gallery-frame" className="group relative min-w-0 flex-1 overflow-hidden rounded-sm bg-surface">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          width={current.width}
          height={current.height}
          priority={active === 0}
          placeholder="blur"
          blurDataURL={current.blurDataURL}
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="w-full animate-[orbis-fade_600ms_var(--ease-orbis)] transition-transform duration-[1200ms] [transition-timing-function:var(--ease-orbis)] group-hover:scale-[1.04]"
        />
        <figcaption className="pointer-events-none absolute bottom-4 left-5 text-[0.65rem] uppercase tracking-[0.26em] text-faint">
          {shotLabel(current.role)}
        </figcaption>
      </figure>
    </div>
  );
}
