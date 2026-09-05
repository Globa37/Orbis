import type { Collection, Product, ProductImage } from "./types";
import { GALLERY_ORDER, imagePath, shot } from "./shots";

const PRICE = 8000; // €80.00

/** Spec sheet shared by every MILLENIUM reference — one watch, five dials. */
const SHARED_SPECS = [
  { label: "Case", value: "38.5 mm cushion, polished stainless steel" },
  { label: "Thickness", value: "10.2 mm" },
  { label: "Crystal", value: "Domed sapphire, anti-reflective" },
  { label: "Dial", value: "Applied ORBIS orb, twelve applied markers" },
  { label: "Hands", value: "Faceted dauphine, rhodium-plated" },
  { label: "Movement", value: "Quartz, two-hand" },
  { label: "Bracelet", value: "Three-link steel, brushed and polished" },
  { label: "Water resistance", value: "5 ATM" },
];

function product(
  slug: string,
  name: string,
  subtitle: string,
  reference: string,
  accent: { base: string; glow: string },
  description: string,
  colorway: Product["colorway"],
  dialSpec: string
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
    specs: [
      SHARED_SPECS[0],
      SHARED_SPECS[1],
      SHARED_SPECS[2],
      { label: "Dial", value: dialSpec },
      ...SHARED_SPECS.slice(4),
    ],
    images: [],
  };
}

const products: Product[] = [
  product(
    "noir",
    "Noir",
    "Onyx dial · Rhodium orb",
    "MLN-01",
    { base: "#8E9196", glow: "rgba(160,170,180,0.55)" },
    "The reference that sets the tone. A vertically brushed onyx dial swallows the light, so the rhodium orb reads as a single illuminated body suspended in the dark. Nothing on this dial exists that does not have to.",
    {
      dial: "#0E0F12",
      dialShade: "#050506",
      dialSheen: "#1C1E22",
      orb: "#8E9196",
      chapterRing: "#1A1C20",
      chapterRingShade: "#0A0B0D",
      lightMarkers: true,
    },
    "Vertically brushed onyx, rhodium orb"
  ),
  product(
    "celeste",
    "Celeste",
    "Glacier dial · Obsidian orb",
    "MLN-02",
    { base: "#A5DCE3", glow: "rgba(165,220,227,0.5)" },
    "Glacier blue lacquer, laid flat and left alone. The obsidian orb sits hard against it, and the contrast does all the work — the coldest, clearest reading of the MILLENIUM dial.",
    {
      dial: "#A9DDE4",
      dialShade: "#7FBFC9",
      dialSheen: "#C4E9EE",
      orb: "#0C0D10",
      chapterRing: "#C9CFD5",
      chapterRingShade: "#8A929A",
      lightMarkers: false,
    },
    "Glacier blue lacquer, obsidian orb"
  ),
  product(
    "spectrum",
    "Spectrum",
    "Silver dial · Spectrum orb",
    "MLN-03",
    { base: "#D9A441", glow: "rgba(217,164,65,0.45)" },
    "The only reference in which the orb carries colour. Each latitude of the sphere is enamelled a different tone, so the globe grades from red at the pole through amber at the equator to deep blue below. A silver dial keeps it honest.",
    {
      dial: "#E9EAEB",
      dialShade: "#B9BEC3",
      dialSheen: "#FAFBFB",
      orb: "spectrum",
      chapterRing: "#D2D7DC",
      chapterRingShade: "#959DA5",
      lightMarkers: false,
    },
    "Silver sunburst, latitude-graded enamel orb"
  ),
  product(
    "aurora",
    "Aurora",
    "Rosé dial · Obsidian orb",
    "MLN-04",
    { base: "#EDA9C0", glow: "rgba(237,169,192,0.45)" },
    "A rosé dial with the warmth taken out of it — closer to the colour of dust at altitude than to anything decorative. Against the obsidian orb it reads graphic rather than soft.",
    {
      dial: "#EDA9C0",
      dialShade: "#C4809A",
      dialSheen: "#F7C8D8",
      orb: "#0C0D10",
      chapterRing: "#D2D7DC",
      chapterRingShade: "#959DA5",
      lightMarkers: false,
    },
    "Rosé lacquer, obsidian orb"
  ),
  product(
    "solaris",
    "Solaris",
    "Vermillion dial · Rhodium orb",
    "MLN-05",
    { base: "#B21D22", glow: "rgba(178,29,34,0.5)" },
    "Deep vermillion, flat and saturated, with the rhodium orb floating over it. The loudest reference in the collection, and still the most restrained thing you will wear.",
    {
      dial: "#B21D22",
      dialShade: "#7C1216",
      dialSheen: "#C8353A",
      orb: "#9A9DA2",
      chapterRing: "#D2D7DC",
      chapterRingShade: "#959DA5",
      lightMarkers: false,
    },
    "Vermillion lacquer, rhodium orb"
  ),
];

export const MILLENIUM: Collection = {
  slug: "millenium",
  name: "Millenium",
  index: "01",
  tagline: "Five dials. One orbit.",
  intro:
    "MILLENIUM is the first ORBIS collection: a single cushion case, held constant, and five readings of the same orb. The case, the markers, the hands and the bracelet never change. Only the light falling on the dial does.",
  world: {
    name: "The Long Horizon",
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
        height: s.h,
        alt: `ORBIS ${collection.name} ${product.name} — ${s.label.toLowerCase()} view. ${product.subtitle}.`,
      };
    });
  }
  return collection;
}

export const COLLECTIONS: Collection[] = [MILLENIUM].map(withImages);

export function cardImage(collectionSlug: string, productSlug: string) {
  const s = shot("card");
  return { src: imagePath(collectionSlug, productSlug, "card"), width: s.w, height: s.h };
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
