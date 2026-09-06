# Shared photography

Images in this folder are shown on **every** reference in every collection —
the parts of the watch that do not change with the dial, such as the caseback
and the bracelet.

## Adding a photograph

Drop the file in. That is the whole step: `npm run assets` (which `npm run
build` runs for you) finds it, derives the web version, and adds it to the end
of every product gallery. Nothing in the code has to change.

- **The file name becomes the caption.** `caseback-angle.png` reads
  "Caseback angle". Hyphens become spaces.
- **A number prefix sets the order** and is dropped from the caption:
  `01-caseback.png` comes before `02-caseback-angle.png`.
- **`.png`, `.jpg` and `.webp`** are all accepted. Upload the largest version
  you have; it is resized to 1400px wide and converted to WebP for the site.
- **Removing a file removes the view.** An empty folder simply means no shared
  photography, which is a valid state.

## What does not belong here

Anything that differs between references. A dial, or a view where the dial
colour is visible, belongs in `assets/campaign/` as that reference's master
photograph — otherwise the Onyx page would be showing you the Lagoon.
