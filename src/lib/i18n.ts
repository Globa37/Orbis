/**
 * Two languages, one tree of routes.
 *
 * Every page lives under /<lang>/, so both readings are real pages a search
 * engine can index and a visitor can link to, rather than one page that
 * rewrites itself in the browser. German is the default: it is the shop's home
 * market, so "/" hands over to "/de".
 *
 * Copy that belongs to a product rather than to the interface — a reference's
 * description, a specification's value — carries its own pair in the catalogue
 * as a Localized<string>, so a reference is one object with two readings rather
 * than two objects to keep in step.
 */

export const LANGS = ["de", "en"] as const;
export type Lang = (typeof LANGS)[number];
export const DEFAULT_LANG: Lang = "de";

/** A string that exists in both languages. */
export type Localized<T = string> = Record<Lang, T>;

export function isLang(value: string): value is Lang {
  return (LANGS as readonly string[]).includes(value);
}

/** Reads one language out of a localised value. */
export function pick<T>(value: Localized<T>, lang: Lang): T {
  return value[lang];
}

/** How each language names itself, for the switcher. */
export const LANG_NAME: Localized<string> = { de: "Deutsch", en: "English" };
export const LANG_SHORT: Localized<string> = { de: "DE", en: "EN" };

/** BCP 47 tags for <html lang> and for Intl. */
export const LOCALE: Localized<string> = { de: "de-DE", en: "en-GB" };

/** Prefixes a path with the language segment. */
export function path(lang: Lang, rest = "") {
  const tail = rest.startsWith("/") ? rest : rest ? `/${rest}` : "";
  return `/${lang}${tail}`;
}

/* ------------------------------------------------------------- interface */

const DICT = {
  // Navigation and chrome
  maison: { de: "Maison", en: "Maison" },
  collections: { de: "Kollektionen", en: "Collections" },
  bag: { de: "Warenkorb", en: "Bag" },
  openMenu: { de: "Menü öffnen", en: "Open menu" },
  closeMenu: { de: "Menü schließen", en: "Close menu" },
  openBag: { de: "Warenkorb öffnen", en: "Open bag" },
  closeBag: { de: "Warenkorb schließen", en: "Close bag" },
  language: { de: "Sprache", en: "Language" },
  skipToContent: { de: "Zum Inhalt springen", en: "Skip to content" },

  // Home
  collectionN: { de: "Kollektion", en: "Collection" },
  exploreCollection: { de: "Kollektion ansehen", en: "Explore the collection" },
  startWith: { de: "Beginne mit", en: "Start with" },
  scroll: { de: "Scrollen", en: "Scroll" },
  theMaison: { de: "Das Haus", en: "The maison" },
  allFiveReferences: { de: "Alle fünf Referenzen", en: "All five references" },
  worldOf: { de: "Die Welt von", en: "The world of" },
  enterCollection: { de: "Kollektion betreten", en: "Enter the collection" },

  // Collection and product
  references: { de: "Referenzen", en: "References" },
  reference: { de: "Referenz", en: "Reference" },
  dial: { de: "Zifferblatt", en: "Dial" },
  addToBag: { de: "In den Warenkorb", en: "Add to bag" },
  specification: { de: "Technische Daten", en: "Specification" },
  includesVat: {
    de: "Inkl. MwSt. Versand weltweit kostenfrei, Rückgabe inklusive.",
    en: "Includes VAT. Complimentary worldwide delivery and returns.",
  },
  previousReference: { de: "Vorherige Referenz", en: "Previous reference" },
  nextReference: { de: "Nächste Referenz", en: "Next reference" },
  quantity: { de: "Menge", en: "Quantity" },
  decrease: { de: "Menge verringern", en: "Decrease quantity" },
  increase: { de: "Menge erhöhen", en: "Increase quantity" },
  comingSoon: { de: "Bald verfügbar", en: "Coming soon" },
  notYetForSale: {
    de: "Diese Kollektion ist noch nicht bestellbar.",
    en: "This collection is not yet available to order.",
  },

  // Views
  viewCampaign: { de: "Kampagne", en: "Campaign" },
  viewCase: { de: "Gehäuse", en: "Case" },
  viewSetting: { de: "Umgebung", en: "Setting" },
  viewCard: { de: "Karte", en: "Card" },
  viewCaseback: { de: "Gehäuseboden", en: "Caseback" },
  viewCasebackAngle: { de: "Gehäuseboden schräg", en: "Caseback angle" },

  // Bag
  bagEmpty: { de: "Dein Warenkorb ist leer.", en: "Your bag is empty." },
  bagEmptyHint: {
    de: "Fünf Zifferblätter, ein Orbit. Sieh dir MILLENIUM an.",
    en: "Five dials. One orbit. Take a look at MILLENIUM.",
  },
  subtotal: { de: "Zwischensumme", en: "Subtotal" },
  delivery: { de: "Versand", en: "Delivery" },
  deliveryFree: { de: "Kostenfrei, weltweit", en: "Complimentary, worldwide" },
  vatIncluded: { de: "Enthaltene MwSt. (19 %)", en: "VAT included (19%)" },
  total: { de: "Gesamt", en: "Total" },
  remove: { de: "Entfernen", en: "Remove" },
  removeLine: { de: "Aus dem Warenkorb entfernen", en: "Remove from bag" },
  checkout: { de: "Zur Kasse", en: "Proceed to checkout" },
  checkoutNotConnected: {
    de: "Die Kasse ist noch nicht angebunden.",
    en: "Checkout is not yet connected.",
  },
  continueShopping: { de: "Weiter ansehen", en: "Continue looking" },
  addedToBag: { de: "In den Warenkorb gelegt", en: "Added to bag" },
  itemsOne: { de: "Artikel", en: "item" },
  itemsMany: { de: "Artikel", en: "items" },
  clearBag: { de: "Warenkorb leeren", en: "Empty the bag" },
  maxQty: {
    de: "Pro Referenz sind höchstens 10 Stück möglich.",
    en: "Ten pieces per reference is the maximum.",
  },

  // Support
  support: { de: "Support", en: "Support" },
  writeToUs: { de: "Schreib uns", en: "Write to us" },
  openSupport: { de: "Nachricht an den Support", en: "Message support" },
  closeSupport: { de: "Nachricht schließen", en: "Close message" },
  supportIntro: {
    de: "Fragen zu Größe, Verfügbarkeit, Versand oder Service? Schreib uns — wir antworten innerhalb eines Werktags.",
    en: "Questions about sizing, availability, delivery or servicing? Write to us — we answer within one working day.",
  },
  yourEmail: { de: "Deine E-Mail-Adresse", en: "Your email address" },
  yourMessage: { de: "Deine Nachricht", en: "Your message" },
  emailPlaceholder: { de: "name@beispiel.de", en: "name@example.com" },
  messagePlaceholder: {
    de: "Worum geht es?",
    en: "What can we help with?",
  },
  sendMessage: { de: "Nachricht senden", en: "Send message" },
  emailRequired: { de: "Bitte gib eine E-Mail-Adresse an.", en: "Please enter an email address." },
  emailInvalid: { de: "Diese E-Mail-Adresse sieht nicht richtig aus.", en: "That email address does not look right." },
  messageRequired: { de: "Bitte schreib uns ein paar Worte.", en: "Please write us a few words." },
  supportProvisional: {
    de: "Vorläufig: Das Formular öffnet dein E-Mail-Programm mit fertiger Nachricht. Ein echter Versand folgt.",
    en: "Provisional: this opens your mail app with the message ready to send. Real delivery follows.",
  },
  supportOpened: {
    de: "Dein E-Mail-Programm sollte sich jetzt öffnen. Passiert nichts, schreib direkt an",
    en: "Your mail app should be opening. If nothing happens, write to",
  },

  // Maison
  shippingReturns: { de: "Versand & Rückgabe", en: "Shipping & returns" },
  warranty: { de: "Garantie", en: "Warranty" },
  servicing: { de: "Service", en: "Servicing" },
  contact: { de: "Kontakt", en: "Contact" },
  clientCare: { de: "Kundenservice", en: "Client care" },
  world: { de: "Welt", en: "World" },

  // 404
  outOfOrbit: { de: "Außerhalb der Umlaufbahn", en: "Out of orbit" },
  notFoundBody: {
    de: "Diese Seite steht auf keiner unserer Karten.",
    en: "This page is not on any of our maps.",
  },
  returnToOrbis: { de: "Zurück zu ORBIS", en: "Return to ORBIS" },
} satisfies Record<string, Localized<string>>;

export type StringKey = keyof typeof DICT;

/** Returns a reader for one language: `const t = translator(lang); t("bag")`. */
export function translator(lang: Lang) {
  return (key: StringKey) => DICT[key][lang];
}

export type T = ReturnType<typeof translator>;

/* ---------------------------------------------------------------- money */

export const CURRENCY = "EUR";

export function formatPrice(cents: number, lang: Lang): string {
  return new Intl.NumberFormat(LOCALE[lang], {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}
