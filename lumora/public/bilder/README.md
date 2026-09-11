# Bilder

| Datei | Herkunft |
| --- | --- |
| `lumora-logo.svg` | Wort-Bild-Marke, hier im Projekt entstanden |
| `lumora-mark.svg` | nur das Signet, dient auch als Favicon |
| `lumora-one.png` | **Produktfoto — muss hier abgelegt werden** |

`lumora-one.png` ist die einzige Datei, die von Hand hier hineingehört.
Alles Weitere leitet `npm run bilder` daraus ab (läuft auch vor jedem Build,
also auch auf Vercel):

- `lumora-one-400/640/900/1280/1800.webp` — Breiten fürs `srcset`,
  begrenzt auf das, was die Quelle wirklich hergibt
- `lumora-one-og.jpg` — 1200 × 630 für Open Graph
- `lumora-one.varianten.json` — sagt `Produktfoto.astro`, welche Breiten es gibt

Die abgeleiteten Dateien stehen in `.gitignore` und gehören nicht ins Repo.

Solange `lumora-one.png` fehlt, baut die Seite trotzdem durch — sie zeigt dann
nur an der Stelle des Produktfotos nichts an, und `npm run build` schreibt
einen Hinweis in die Ausgabe.
