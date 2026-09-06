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
    de: "TSUKI — 月, der Mond — ist die zweite ORBIS-Kollektion. Wo MILLENIUM den Orb unter ein hartes Licht stellt, dreht TSUKI die Quelle weg: Zifferblätter nach japanischer Lesart, in denen die Zeit von einer einzigen kalten Lichtquelle abgelesen wird. Die Kollektion ist angekündigt, noch nicht bestellbar.",
    en: "TSUKI — 月, the moon — is the second ORBIS collection. Where MILLENIUM puts the orb under a hard light, TSUKI turns the source away: dials in a Japanese reading, where the time is taken from a single cold source. The collection is announced, not yet available to order.",
  },
  world: {
    name: { de: "Stilles Wasser", en: "Still Water" },
    // Until the plate is shot, the page draws its own night. See the world
    // section of the README for how to add it.
    plate: null,
    tone: "#060A12",
    body: {
      de: "Kein Stein, keine harte Kante. TSUKI wird über stillem Wasser aufgenommen, das einzige Licht der Mond tief am Horizont, seine Spur als schmaler Silberpfad über die Fläche gelegt. Nebel liegt flach auf dem Wasser, das ferne Ufer bleibt eine Andeutung. Wo Erstes Licht alles freilegt, hält Stilles Wasser fast alles zurück.",
      en: "No stone, no hard edge. TSUKI is shot over still water, the only light a moon low on the horizon, its trail laid across the surface as one narrow silver path. Mist lies flat on the water and the far shore stays a suggestion. Where First Light exposes everything, Still Water withholds almost all of it.",
    },
  },
  products: [],
};
