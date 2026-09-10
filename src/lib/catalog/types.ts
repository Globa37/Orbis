import type { Localized } from "@/lib/i18n";
import type { Colorway } from "@/lib/orbis/watch-svg";

/** The framings cropped from a reference's own master photograph. */
export type CropRole = "hero" | "angle" | "lifestyle";

/**
 * A framing's identity. Crops use the fixed roles above; a shared photograph
 * carries its own file name as its role, so new shared images can be added by
 * dropping a file in without touching this union.
 */
export type ImageRole = CropRole | (string & {});

export interface Product {
  slug: string;
  /** Reference name, e.g. "Onyx". A proper noun, so it is not translated. */
  name: string;
  /** Marketing subtitle. Colour only — never a material claim. */
  subtitle: Localized;
  reference: string;
  priceCents: number;
  /** Ausverkauft: nicht bestellbar, bleibt aber im Katalog sichtbar. */
  soldOut?: boolean;
  colorway: Colorway;
  /** Two-stop accent used for this reference's UI moments. */
  accent: { base: string; glow: string };
  description: Localized;
  /** Verified specification rows, rendered in order. Never extend without a confirmed source. */
  specs: Spec[];
  images: ProductImage[];
}
/**
 * Whether a collection can be bought yet.
 *
 * A collection is announced before it is photographed and priced, and the site
 * has to be able to say so plainly rather than showing an empty shop. Nothing
 * in an "announced" collection is purchasable, and the interface says why.
 */
export type CollectionStatus = "available" | "announced";

export interface Collection {
  slug: string;
  /** Collection name, e.g. "Millenium". A proper noun. */
  name: string;
  /** e.g. "01" — shown as an index in navigation. */
  index: string;
  status: CollectionStatus;
  tagline: Localized;
  /** Long-form introduction on the collection page. */
  intro: Localized;
  /** The world this collection inhabits, used for its environment art. */
  world: {
    name: Localized;
    /** Ultra-wide plate behind the collection hero, or null until it is shot. */
    plate: string | null;
    /** Background tone the plate blends into. */
    tone: string;
    /** How the world was lit and shot, in the collection's own words. */
    body: Localized;
  };
  products: Product[];
}
