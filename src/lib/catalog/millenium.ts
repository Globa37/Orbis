import type { Collection, Product, ProductImage } from "./types";
import { GALLERY_ORDER, imagePath, shot, shotHeight } from "./shots";
import { BLUR } from "./blur.generated";

const PRICE = 8000; // €80.00

/**
 * Verified supplier specifications, shared by every MILLENIUM reference —
 * one watch, five dials.
 *
 * This list is deliberately closed. Nothing may be added here that is not on
 * the confirmed specification sheet: no finishing techniques, no materials
 * beyond those stated, no case-back or warranty detail.
 */
const SHARED_SPECS = [
  { label: "Case diameter", value: "40 mm" },
  { label: "Case thickness", value: "12 mm" },
  { label: "Case material", value: "Alloy" },
  { label: "Crystal", value: "Glass" },
  { label: "Movement", value: "Quartz" },
  { label: "Water resistance", value: "3 BAR" },
  { label: "Bracelet", value: "Stainless steel" },
  { label: "Bracelet width", value: "18 mm" },
];

function product(
  slug: string,
  name: string,
  subtitle: string,
  reference: string,
  accent: { base: string; glow: string },
  description: string,
  colorway: Product["colorway"]
): Product {
  return {
    slug,
    name,
    subtitle,
    reference,
    priceCents: PRICE,
    colorway,
    accent,
    description,
    specs: SHARED_SPECS,
    images: [],
  };
}

const products: Product[] = [
  product(
    "onyx",
    "Onyx",
    "Black dial · Silver orb",
    "MLN-01",
    { base: "#8E9196", glow: "rgba(160,170,180,0.55)" },
    "The reference that sets the tone. A deep black dial gives the light nothing to hold on to, so the silver orb reads as a single lit body suspended in the dark. Nothing on this dial exists that does not have to.",
    {
      dial: "#0E0F12",
      dialShade: "#050506",
      dialSheen: "#1C1E22",
      orb: "#8E9196",
      chapterRing: "#1A1C20",
      chapterRingShade: "#0A0B0D",
      lightMarkers: true,
    }
  ),
  product(
    "lagoon",
    "Lagoon",
    "Lagoon dial · Black orb",
    "MLN-02",
    { base: "#A5DCE3", glow: "rgba(165,220,227,0.5)" },
    "Lagoon blue, laid flat and left alone. The black orb sits hard against it, and the contrast does all the work — the coldest, clearest reading of the MILLENIUM dial.",
    {
      dial: "#A9DDE4",
      dialShade: "#7FBFC9",
      dialSheen: "#C4E9EE",
      orb: "#0C0D10",
      chapterRing: "#C9CFD5",
      chapterRingShade: "#8A929A",
      lightMarkers: false,
    }
  ),
  product(
    "chrome",
    "Chrome",
    "Silver dial · Spectrum orb",
    "MLN-03",
    { base: "#D9A441", glow: "rgba(217,164,65,0.45)" },
    "The only reference in which the orb carries colour. Each latitude of the sphere takes a different tone, so the globe grades from red at the pole through amber at the equator to deep blue below. A silver dial keeps it honest.",
    {
      dial: "#E9EAEB",
      dialShade: "#B9BEC3",
      dialSheen: "#FAFBFB",
      orb: "chrome",
      chapterRing: "#D2D7DC",
      chapterRingShade: "#959DA5",
      lightMarkers: false,
    }
  ),
  product(
    "blush",
    "Blush",
    "Blush dial · Black orb",
    "MLN-04",
    { base: "#EDA9C0", glow: "rgba(237,169,192,0.45)" },
    "A blush dial with the warmth taken out of it — closer to the colour of dust at altitude than to anything decorative. Against the black orb it reads graphic rather than soft.",
    {
      dial: "#EDA9C0",
      dialShade: "#C4809A",
      dialSheen: "#F7C8D8",
      orb: "#0C0D10",
      chapterRing: "#D2D7DC",
      chapterRingShade: "#959DA5",
      lightMarkers: false,
    }
  ),
  product(
    "solaris",
    "Solaris",
    "Vermillion dial · Silver orb",
    "MLN-05",
    { base: "#B21D22", glow: "rgba(178,29,34,0.5)" },
    "Deep vermillion, flat and saturated, with the silver orb floating over it. The loudest reference in the collection, and still the most restrained thing you will wear.",
    {
      dial: "#B21D22",
      dialShade: "#7C1216",
      dialSheen: "#C8353A",
      orb: "#9A9DA2",
      chapterRing: "#D2D7DC",
      chapterRingShade: "#959DA5",
      lightMarkers: false,
    }
  ),
];

export const MILLENIUM: Collection = {
  slug: "millenium",
  name: "Millenium",
  index: "01",
  tagline: "Five dials. One orbit.",
  intro:
    "MILLENIUM is the first ORBIS collection: a 40 mm alloy case on a stainless-steel bracelet, held constant, and five readings of the same orb. The case, the markers, the hands and the bracelet never change. Only the light falling on the dial does.",
  world: {
    name: "First Light",
    plate: "/world/millenium-horizon.webp",
    tone: "#05070A",
  },
  products,
};

/** Attaches the rendered campaign to every product. */
function withImages(collection: Collection): Collection {
  for (const product of collection.products) {
    product.images = GALLERY_ORDER.map((role): ProductImage => {
      const s = shot(role);
      return {
        role,
        src: imagePath(collection.slug, product.slug, role),
        width: s.w,
        height: shotHeight(s),
        alt: `ORBIS ${collection.name} ${product.name} — ${s.label.toLowerCase()} view. ${product.subtitle}.`,
        blurDataURL: BLUR[`${collection.slug}/${product.slug}/${role}`] ?? "",
      };
    });
  }
  return collection;
}

export const COLLECTIONS: Collection[] = [MILLENIUM].map(withImages);

export function cardImage(collectionSlug: string, productSlug: string) {
  const s = shot("card");
  return {
    src: imagePath(collectionSlug, productSlug, "card"),
    width: s.w,
    height: shotHeight(s),
    blurDataURL: BLUR[`${collectionSlug}/${productSlug}/card`] ?? "",
  };
}

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getProduct(collectionSlug: string, productSlug: string) {
  const collection = getCollection(collectionSlug);
  const product = collection?.products.find((p) => p.slug === productSlug);
  return collection && product ? { collection, product } : undefined;
}

export function allProducts() {
  return COLLECTIONS.flatMap((c) => c.products.map((p) => ({ collection: c, product: p })));
}
