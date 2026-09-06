import type { Colorway } from "@/lib/orbis/watch-svg";

export type ImageRole = "hero" | "detail" | "angle" | "lifestyle" | "caseback" | "caseback-angled";

export interface ProductImage {
  role: ImageRole;
  src: string;
  width: number;
  height: number;
  alt: string;
  /** Inline low-quality preview so the frame never pops in from nothing. */
  blurDataURL: string;
}

export interface Product {
  slug: string;
  /** Reference name, e.g. "Noir". */
  name: string;
  /** Marketing subtitle, e.g. "Black dial · Silver orb". Colour only — never a material claim. */
  subtitle: string;
  reference: string;
  priceCents: number;
  colorway: Colorway;
  /** Two-stop accent used for this reference's UI moments. */
  accent: { base: string; glow: string };
  description: string;
  /** Verified specification rows, rendered in order. Never extend without a confirmed source. */
  specs: { label: string; value: string }[];
  images: ProductImage[];
}

export interface Collection {
  slug: string;
  name: string;
  /** e.g. "01" — shown as an index in navigation. */
  index: string;
  tagline: string;
  /** Long-form introduction on the collection page. */
  intro: string;
  /** The world this collection inhabits, used for its environment art. */
  world: {
    name: string;
    /** Ultra-wide plate behind the collection hero. */
    plate: string;
    /** Background tone the plate blends into. */
    tone: string;
  };
  products: Product[];
}

export const CURRENCY = "EUR";

export function formatPrice(cents: number, locale = "de-DE"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
