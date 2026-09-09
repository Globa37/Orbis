import type { Collection } from "./types";

/**
 * The second collection, announced rather than stocked.
 *
 * TSUKI has a world and a premise; it does not yet have photography, confirmed
 * specifications or prices. Its `products` list is deliberately empty and its
 * status is "announced", so the collection page shows the world and says
 * plainly that nothing can be ordered yet, instead of an empty shop or —
 * worse — references invented to fill the grid.
 *
 * Adding a reference here, with its master photograph in assets/campaign/, is
 * all it takes to turn this into a shop: nothing else has to change.
 */
export const TSUKI: Collection = {
  slug: "tsuki",
  name: "Tsuki",
  index: "02",
  status: "announced",
  tagline: { de: "Der Mond auf dem Zifferblatt.", en: "The moon on the dial." },
  intro: {
    de: "TSUKI — 月, der Mond — ist die zweite ORBIS-Kollektion. Wo MILLENIUM den Orb unter ein hartes Licht stellt, nimmt TSUKI die Quelle zurück: Zifferblätter nach japanischer Lesart, in Sumi-Schwarz gehalten, in dem Gold nur dort auftaucht, wo Licht ohnehin hinfällt. Die Kollektion ist angekündigt, noch nicht bestellbar.",
    en: "TSUKI — 月, the moon — is the second ORBIS collection. Where MILLENIUM puts the orb under a hard light, TSUKI pulls the source back: dials in a Japanese reading, held in sumi black, where gold appears only where light would fall anyway. The collection is announced, not yet available to order.",
  },
  world: {
    /*
     * Tsukimi, 月見: the moon viewing. The name is not decoration — it is what
     * the plate shows, and it is the one place where the maison's subject and
     * a Japanese tradition are the same thing. ORBIS photographs celestial
     * bodies; Japan has been looking at this one on purpose since the Heian
     * court.
     */
    name: { de: "Mondschau", en: "Moon Viewing" },
    plate: "/world/tsuki.webp",
    tone: "#100E0B",
    body: {
      de: "Ein Vollmond, hoch genug, dass er nichts mehr berührt. Darunter, im untersten Fünftel, die Dachlinie einer Holzhalle als reine Silhouette, ihre Ziegel nur dort sichtbar, wo das Mondlicht einen schmalen Goldsaum darauf legt. Rechts ein Stand Bambus. Nebel liegt flach am Boden, alles dazwischen bleibt leer. Wo Erstes Licht alles freilegt, zeigt Mondschau eine Dachkante, einen Mond und den Abstand zwischen beiden.",
      en: "A full moon, high enough that it touches nothing. Below it, in the lowest fifth of the frame, the roofline of a wooden hall as pure silhouette, its tiles visible only where the moonlight lays a narrow gold seam along them. A stand of bamboo to the right. Mist lies flat on the ground and everything between is left empty. Where First Light exposes everything, Moon Viewing shows one roof edge, one moon, and the distance between them.",
    },
  },
  products: [],
};
