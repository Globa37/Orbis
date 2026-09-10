# ORBIS — Projektnotizen

## Referenz-Prototyp (Handyversion)

https://claude.ai/code/artifact/5f905b53-0055-44cd-b2bf-9da3485da623

Der Artifact „ORBIS Kollektionen" ist die **Handyversion, die dem Auftraggeber
gefällt** — sie ist die gestalterische Referenz für Mobile, nicht die
Produktionsseite. Vor größeren Änderungen an der mobilen Darstellung dort
nachsehen (`Artifact` mit `action: "read"` und dieser URL).

Was der Prototyp festlegt:

- Eine durchgehende Spalte, `max-width: 34rem`, alles zentriert.
- Sticky Masthead: Logo · DE/EN · Support · Warenkorb mit Zähler.
- Darunter ein **sticky Zifferblatt-Umschalter**: fünf runde Dial-SVGs
  (Onyx, Lagoon, Chrome, Blush, Solaris), `aria-pressed` auf dem aktiven.
- Pro Referenz: horizontal snappende Galerie, Name, Untertitel, Preis,
  Kaufen-Button, Fließtext, Spezifikationsliste.
- TSUKI als eigener Abschnitt am Ende mit „Bald verfügbar"-Badge.
- Bottom Sheets für Warenkorb und Support.
- Dieselben Tokens wie die Produktionsseite (`--void #05070a`, Bodoni Moda,
  Jost), dieselbe Zeichensprache.

Der Link ist geteilt; Betrachter sehen eine gepinnte ältere Fassung, nicht
zwingend den Live-Stand.

## Harte inhaltliche Vorgaben

Diese gelten dauerhaft und wurden mehrfach bestätigt:

- **Die Uhren werden nie verändert.** Zifferblatt, Zahlen, Zeiger, Gehäuse,
  Armband, Krone, Materialien, Farben, Proportionen, Logo, Gravuren. Freisteller
  entstehen ausschließlich als Maske auf dem unveränderten Originalfoto
  (`scripts/build-cutouts.mjs`), nie durch Neuzeichnen oder img2img.
- **Nur diese acht Spezifikationen** existieren, siehe `SHARED_SPECS` in
  `src/lib/catalog/millenium.ts`: Gehäusedurchmesser 40 mm, Gehäusehöhe 12 mm,
  Werk Quarz, Wasserdichtigkeit 3 bar, Gehäusematerial Legierung, Armband
  Edelstahl, Bandbreite 18 mm, Glas Glas. **Keine weiteren erfinden.** Keine
  Verpackungs-, Herkunfts-, Batterie-, OEM-, Gewichts- oder Lieferantenangaben.
- Das Werk ist **Quarz** — niemals als mechanisch oder automatisch beschreiben.
- **Keine erfundenen Garantien, Rückgabefristen, Servicezeiten oder
  Zertifizierungen.**
- Die Bildtexte dürfen nur beschreiben, was die Fotos tatsächlich zeigen.

## Aufbau

- Next.js App Router, `[lang]`-Segment für `de`/`en`.
- Katalog in `src/lib/catalog/`; eine Kollektion mit `status: "announced"` und
  leerer `products`-Liste zeigt ihre Welt statt eines leeren Shops.
- Jede Kollektion besitzt ein `world.plate`; Collection-Page **und** die
  TSUKI-Section der Startseite setzen daraus `--plate`, `.u-plate` liest es.
  Nie einen Plate-Pfad in einer Seite hartkodieren — sonst zeigt das Bild etwas
  anderes als der Text daneben.
- Die Welt-Plates sind Fotografien in `assets/world/`, aus denen der
  Assets-Workflow `public/world/*.webp` ableitet. Die früheren prozeduralen
  Plates (`build-plates.mjs`) sind damit abgelöst und entfernt.
- `.u-display-xl` fixiert Bodonis `opsz`-Achse für große Titel — ohne das
  brechen die Haarstriche auf dunklem Grund weg. Nicht durch mehr Schriftstärke
  ersetzen.

## Befehle

```
npm run build      # assets + next build
npm run cutouts    # Freisteller + Kollektionsfoto aus assets/campaign/
npm run assets     # leitet die Web-Bilder aus assets/ ab (läuft auch in CI)
npm run audit      # Kontrast-Gate + Struktur-/Overflow-Prüfung (braucht :3254)
```

Neue Fotos lassen sich direkt über die GitHub-Weboberfläche nach `assets/`
hochladen: `.github/workflows/assets.yml` führt `npm run assets` aus und
committet die abgeleiteten Dateien selbst.

## Ablauf nach jeder Änderung

1. Änderung umsetzen.
2. Prüfen: `npx tsc --noEmit`, `npx eslint src scripts`, `npm run build`,
   Routen in beiden Sprachen und auf mehreren Breiten durchklicken.
3. Committen und nach `claude/orbis-luxury-ecommerce-fosivo` pushen — das ist
   der Default-Branch des Repos und der Production-Branch bei Vercel.
4. Prüfen, ob Vercel den neuen Stand deployt hat.

Hinweis: `vercel.com` und die Higgsfield-Ergebnis-CDNs sind aus der
Ausführungsumgebung heraus gesperrt (403 am Proxy). Der Deploy-Status lässt
sich von hier aus **nicht** verifizieren — das muss der Auftraggeber im
Dashboard nachsehen.
