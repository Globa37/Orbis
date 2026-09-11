# Lumora One — Landingpage

Statische Single-Product-Seite für einen Mini-Beamer. Ein Produkt, kein Shop,
kein CMS, keine Datenbank. Astro + Tailwind, Deployment auf Vercel, Zahlung
über einen Stripe Payment Link.

```
npm install
npm run dev      # http://localhost:4321
npm run build    # Bilder ableiten -> bauen -> offene Platzhalter auflisten
npm run preview  # gebauten Stand ansehen
npm run check    # astro check (Typen + Templates)
```

## Was wo liegt

```
src/data/produkt.json     alle Produktwerte an genau einer Stelle
src/lib/produkt.ts        leitet daraus Preis, Versandsatz und Datenblatt ab
src/pages/index.astro     die Landingpage
src/pages/danke.astro     Success-URL von Stripe
src/pages/{impressum,datenschutz,agb,widerruf,versand}.astro
public/bilder/            Logo, Signet und das Produktfoto (siehe README dort)
scripts/bilder.mjs        WebP-Breiten + OG-Bild aus dem Produktfoto
scripts/platzhalter.mjs   listet nach dem Build alle offenen [[…]] auf
```

Produktwerte werden **nicht** in Seiten geschrieben, sondern in
`src/data/produkt.json` gepflegt. Alles andere zieht sich die Werte von dort.

## Offene Platzhalter

Alles, was im Prompt `null` war, steht als `[[PLATZHALTER]]` in der Seite —
gelb hinterlegt, damit es niemandem durchrutscht. `npm run build` listet am
Ende auf, was noch offen ist. Vor dem Livegang muss die Liste leer sein.

Produktwerte gehören in `src/data/produkt.json`:

| Feld | wofür |
| --- | --- |
| `versandkosten` | Zahl in Euro, oder `0` für versandkostenfrei. Steht am Preis, in den AGB und unter Versand. |
| `bildgroesse`, `anschluesse`, `lautstaerke`, `gewicht` | Zeilen im Datenblatt |
| `email` | Kontaktadresse in Fuß, Impressum, AGB, Widerruf, Danke-Seite |
| `stripePaymentLink` | siehe unten |

Firmenangaben stehen direkt in den Rechtsseiten (Firmenname, Anschrift,
Telefon, Registereintrag, USt-IdNr., Aufsichtsbehörde). Die sind bewusst nicht
in der JSON — sie gehören ins Impressum und werden dort einmal gepflegt.

## Stripe

1. Im Stripe-Dashboard einen **Payment Link** für den Lumora One anlegen.
2. Dort unter „Nach der Zahlung" die Success-URL auf `https://<domain>/danke`
   setzen — die Seite dafür existiert bereits.
3. Den Link in `src/data/produkt.json` unter `stripePaymentLink` eintragen.

Solange der Link fehlt, ist der Kaufbutton sichtbar deaktiviert und weist auf
die fehlende Konfiguration hin. Es liegt **kein** Secret Key im Repo, und es
gibt kein Backend — der Button ist ein Link, mehr nicht.

## Was nicht wegoptimiert werden darf

Diese Punkte sind Vorgabe, nicht Geschmack:

- Der Kaufbutton heißt **„Zahlungspflichtig bestellen"** (§ 312j Abs. 3 BGB).
  Die Beschriftung steht als Konstante in `src/components/Kaufbutton.astro`.
- Preis inkl. MwSt., Versandkosten und Lieferzeit stehen direkt beieinander —
  das erledigt `Preisblock.astro`, deshalb nicht von Hand nachbauen.
- Die Rechtsseiten sind aus dem Fuß jeder Seite verlinkt.
- Nirgends mit **4K als Auflösung** werben. Nativ sind es 1080p; „bis 4K"
  betrifft nur das Eingangssignal und wird auf der Seite ausdrücklich erklärt.
- Der Abschnitt über die **200 Lumen** bleibt drin, auch wenn er wie ein
  Nachteil klingt. Er spart Rücksendungen.

## Technik

- Responsiv bis 360 px, feste Kaufleiste unten auf Mobil
  (`Kaufleiste.astro`, nur unterhalb `sm`).
- Sichtbarer Tastaturfokus über `:focus-visible` in `global.css`,
  „Zum Inhalt springen" als erstes fokussierbares Element.
- `prefers-reduced-motion: reduce` schaltet Übergänge und weiches Scrollen ab.
- Schrift (Inter) wird selbst ausgeliefert, keine Verbindung zu Google Fonts.
- Kein Analytics, keine Cookies — deshalb auch kein Cookie-Banner.
- Meta-Tags, Open Graph und `Product`-JSON-LD sitzen in `Basis.astro` bzw.
  auf der Startseite.

## Deployment auf Vercel

Das Projekt liegt im Unterordner `lumora/` eines Repos, das noch ein zweites
Projekt enthält. In den Vercel-Projekteinstellungen deshalb:

- **Root Directory:** `lumora`
- Framework Preset: Astro (wird in der Regel erkannt)
- Build Command und Output (`dist`) kommen aus `package.json` bzw. Astro

`vercel.json` setzt `cleanUrls` und schaltet nachgestellte Schrägstriche ab,
damit `/impressum` und nicht `/impressum.html` in der Adresszeile steht.
