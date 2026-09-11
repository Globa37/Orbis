import roh from "../data/produkt.json";

export type Produkt = typeof roh;
export const produkt = roh;

const euro = new Intl.NumberFormat("de-DE", {
  style: "currency",
  currency: produkt.waehrung,
});

/** "120,00 €" */
export const preisFormatiert = euro.format(produkt.preis);

/**
 * PAngV: am Preis muss stehen, dass die MwSt. enthalten ist und wie es sich
 * mit dem Versand verhaelt. Solange versandkosten null ist, bleibt hier ein
 * sichtbarer Platzhalter statt einer erfundenen Zahl.
 */
export const versandSatz: { text: string; offen: boolean } =
  produkt.versandkosten === null
    ? { text: "[[VERSANDKOSTEN]]", offen: true }
    : produkt.versandkosten === 0
      ? { text: "versandkostenfrei innerhalb Deutschlands", offen: false }
      : {
          text: `zzgl. ${euro.format(produkt.versandkosten)} Versand innerhalb Deutschlands`,
          offen: false,
        };

/**
 * Der Modellname traegt die Marke meist schon ("Lumora One") — sonst kaeme
 * "Lumora Lumora One" heraus.
 */
export const voll = produkt.modell.startsWith(produkt.marke)
  ? produkt.modell
  : `${produkt.marke} ${produkt.modell}`;

/** Nur die Werte, die wirklich feststehen. null bleibt null. */
export const technischeDaten: { feld: string; wert: string | null }[] = [
  { feld: "Native Auflösung", wert: produkt.aufloesung },
  { feld: "Eingangssignale", wert: produkt.signale },
  { feld: "Helligkeit", wert: `${produkt.lumen} Lumen` },
  { feld: "Projektionstechnik", wert: produkt.technik },
  { feld: "Betriebssystem", wert: produkt.betriebssystem },
  { feld: "Funk", wert: produkt.funk },
  { feld: "Bildgröße", wert: produkt.bildgroesse },
  { feld: "Anschlüsse", wert: produkt.anschluesse },
  { feld: "Betriebsgeräusch", wert: produkt.lautstaerke },
  { feld: "Gewicht", wert: produkt.gewicht },
];

export const kontakt = produkt.email;
export const zahlenLink = produkt.stripePaymentLink;
