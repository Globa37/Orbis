import type { Localized } from "@/lib/i18n";
import type { Collection, Product, Spec } from "./types";

const PRICE = 8000; // €80.00

/**
 * Verified supplier specifications, shared by every MILLENIUM reference —
 * one watch, five dials.
 *
 * This list is deliberately closed. Nothing may be added here that is not on
 * the confirmed specification sheet or engraved on the watch itself: no
 * finishing techniques, no materials beyond those stated, no warranty detail.
 *
 * "Case back" is the one row not taken from the sheet. It is read straight off
 * the caseback engraving — STAINLESS STEEL BACK — which is legible in the
 * shared caseback photography. The case itself remains alloy; only the back is
 * stated as steel, because only that is what the engraving claims.
 */
export const SHARED_SPECS: Spec[] = [
  { label: { de: "Gehäusedurchmesser", en: "Case diameter" }, value: { de: "40 mm", en: "40 mm" } },
  { label: { de: "Gehäusehöhe", en: "Case thickness" }, value: { de: "12 mm", en: "12 mm" } },
  { label: { de: "Gehäusematerial", en: "Case material" }, value: { de: "Legierung", en: "Alloy" } },
  { label: { de: "Gehäuseboden", en: "Case back" }, value: { de: "Edelstahl", en: "Stainless steel" } },
  { label: { de: "Glas", en: "Crystal" }, value: { de: "Mineralglas", en: "Glass" } },
  { label: { de: "Werk", en: "Movement" }, value: { de: "Quarz", en: "Quartz" } },
  { label: { de: "Wasserdichtigkeit", en: "Water resistance" }, value: { de: "3 bar", en: "3 BAR" } },
  { label: { de: "Armband", en: "Bracelet" }, value: { de: "Edelstahl", en: "Stainless steel" } },
  { label: { de: "Bandbreite", en: "Bracelet width" }, value: { de: "18 mm", en: "18 mm" } },
];

function product(
  slug: string,
  name: string,
  subtitle: Localized,
  reference: string,
  accent: { base: string; glow: string },
  description: Localized,
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
    { de: "Schwarzes Zifferblatt · Silberner Orb", en: "Black dial · Silver orb" },
    "MLN-01",
    { base: "#8E9196", glow: "rgba(160,170,180,0.55)" },
    {
      de: "Die Referenz, die den Ton setzt. Ein tiefschwarzes Zifferblatt gibt dem Licht nichts, woran es sich halten könnte, und so liest sich der silberne Orb als ein einzelner leuchtender Körper, der im Dunkeln hängt. Auf diesem Zifferblatt existiert nichts, was nicht existieren muss.",
      en: "The reference that sets the tone. A deep black dial gives the light nothing to hold on to, so the silver orb reads as a single lit body suspended in the dark. Nothing on this dial exists that does not have to.",
    },
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
    { de: "Lagunenblaues Zifferblatt · Schwarzer Orb", en: "Lagoon dial · Black orb" },
    "MLN-02",
    { base: "#A5DCE3", glow: "rgba(165,220,227,0.5)" },
    {
      de: "Lagunenblau, flach aufgetragen und in Ruhe gelassen. Der schwarze Orb sitzt hart dagegen, und der Kontrast erledigt die ganze Arbeit — die kälteste, klarste Lesart des MILLENIUM-Zifferblatts.",
      en: "Lagoon blue, laid flat and left alone. The black orb sits hard against it, and the contrast does all the work — the coldest, clearest reading of the MILLENIUM dial.",
    },
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
    { de: "Silbernes Zifferblatt · Spektrum-Orb", en: "Silver dial · Spectrum orb" },
    "MLN-03",
    { base: "#D9A441", glow: "rgba(217,164,65,0.45)" },
    {
      de: "Die einzige Referenz, in der der Orb Farbe trägt. Jeder Breitengrad der Kugel nimmt einen anderen Ton an, sodass der Globus von Rot am Pol über Bernstein am Äquator zu tiefem Blau darunter verläuft. Ein silbernes Zifferblatt hält das im Zaum.",
      en: "The only reference in which the orb carries colour. Each latitude of the sphere takes a different tone, so the globe grades from red at the pole through amber at the equator to deep blue below. A silver dial keeps it honest.",
    },
    {
      dial: "#E9EAEB",
      dialShade: "#B9BEC3",
      dialSheen: "#FAFBFB",
      // "spectrum" is the sentinel spectrumFill() keys off; a colour name here
      // is not a paint the orb understands and renders as flat black.
      orb: "spectrum",
      chapterRing: "#D2D7DC",
      chapterRingShade: "#959DA5",
      lightMarkers: false,
    }
  ),
  product(
    "blush",
    "Blush",
    { de: "Rosé-Zifferblatt · Schwarzer Orb", en: "Blush dial · Black orb" },
    "MLN-04",
    { base: "#EDA9C0", glow: "rgba(237,169,192,0.45)" },
    {
      de: "Ein Rosé-Zifferblatt, dem die Wärme entzogen wurde — näher an der Farbe von Staub in großer Höhe als an irgendetwas Dekorativem. Gegen den schwarzen Orb liest es sich grafisch statt weich.",
      en: "A blush dial with the warmth taken out of it — closer to the colour of dust at altitude than to anything decorative. Against the black orb it reads graphic rather than soft.",
    },
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
    { de: "Zinnoberrotes Zifferblatt · Silberner Orb", en: "Vermillion dial · Silver orb" },
    "MLN-05",
    { base: "#B21D22", glow: "rgba(178,29,34,0.5)" },
    {
      de: "Tiefes Zinnoberrot, flach und gesättigt, mit dem silbernen Orb darüber schwebend. Die lauteste Referenz der Kollektion — und immer noch das Zurückhaltendste, was du tragen wirst.",
      en: "Deep vermillion, flat and saturated, with the silver orb floating over it. The loudest reference in the collection, and still the most restrained thing you will wear.",
    },
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
  status: "available",
  tagline: { de: "Fünf Zifferblätter. Ein Orbit.", en: "Five dials. One orbit." },
  intro: {
    de: "MILLENIUM ist die erste ORBIS-Kollektion: ein 40-mm-Gehäuse aus Legierung an einem Edelstahlband, konstant gehalten, und fünf Lesarten desselben Orbs. Gehäuse, Indexe, Zeiger und Band ändern sich nie. Nur das Licht, das auf das Zifferblatt fällt.",
    en: "MILLENIUM is the first ORBIS collection: a 40 mm alloy case on a stainless-steel bracelet, held constant, and five readings of the same orb. The case, the markers, the hands and the bracelet never change. Only the light falling on the dial does.",
  },
  world: {
    name: { de: "Erstes Licht", en: "First Light" },
    plate: "/world/millenium.webp",
    tone: "#05070A",
    body: {
      de: "Eine Lichtquelle, in festem Winkel gehalten. Eine Platte aus kaltem Stein. Jede andere Fläche dem Schatten überlassen. Jede Referenz wurde am selben Ort abgesetzt, gleich ausgeleuchtet und aus derselben Entfernung fotografiert — eine Sitzung, eine Farbstimmung, fünf Zifferblätter.",
      en: "One light source, held at a fixed angle. A slab of cold stone. Every other surface surrendered to shadow. Each reference was set down in the same place, lit the same way and photographed from the same distance — one session, one grade, five dials.",
    },
  },
  products,
};
