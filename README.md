# ORBIS

Luxury watch e-commerce for the ORBIS maison. Next.js App Router, TypeScript,
Tailwind v4, statically exported at build time.

```bash
npm install
npm run assets   # render the campaign imagery (Chromium + sharp)
npm run build:app
npm start
```

`npm run build` does both in order.

## How this is put together

```
assets/campaign/            the master photograph for each reference
assets/reference/           the original dial artwork, kept as the source of
                            truth for the ORBIS mark
src/lib/orbis/orb.ts        the ORBIS mark, rebuilt from those originals: an
                            orthographic sphere with two solid inner meridian
                            strokes, two cell-divided limb bands and an
                            equatorial band
src/lib/catalog/shots.ts    the framings derived from each master photograph
scripts/build-assets.mts    crops and optimises the web image set
```

### The campaign

There is **one master photograph per reference** in `assets/campaign/`. Every
framing on the site — campaign, case, dial, setting, card — is a genuine crop of
that frame, never a second pose invented to fill a gallery. `npm run assets`
regenerates the whole web set, so framings are a decision in
`src/lib/catalog/shots.ts` rather than a folder of hand-cut files.

Output lands in `public/products/<collection>/<product>/<role>.webp`
(~2.2 MB for the full 25-image set), together with inline low-quality previews
in `src/lib/catalog/blur.generated.ts`.

### The ORBIS mark

`src/lib/orbis/orb.ts` builds the mark from sphere geometry, with band positions
measured off the original dial artwork rather than estimated. The same function
draws the logo in the header, the dial miniatures in the navigation and the
colourway switcher — so they can never drift apart.

`src/lib/orbis/watch-svg.ts` still renders the full watch as vector art; it is
no longer used for the campaign, but it remains the source for the dial
miniatures.

## Adding a collection

Nothing in the renderer or the pipeline is specific to MILLENIUM.

1. Create `src/lib/catalog/<collection>.ts` exporting a `Collection`: its
   `index`, `tagline`, `intro`, its `world` (name, plate, tone), and its
   products with their `colorway` and `accent`.
2. Put one master photograph per reference in `assets/campaign/<slug>.png`
   (or .webp/.jpg) and the collection's environment plate in `public/world/`.
3. Add it to `COLLECTIONS` in `src/lib/catalog/millenium.ts`.
4. `npm run assets`.

Renaming a reference? Add the old slug to the `redirects()` map in
`next.config.ts` so existing links keep working.

Routes (`/collections/[collection]`, `/collections/[collection]/[product]`),
navigation, the footer, the cart and the sitemap all pick it up automatically.

A future collection can carry its own case geometry by exporting a second
renderer alongside `watch-svg.ts` and selecting it from collection data.

## Checkout

Checkout is an integration point, not a simulation. Set
`NEXT_PUBLIC_CHECKOUT_URL` to your payment provider's hosted checkout and the
button in the bag drawer and on `/cart` becomes a live link. Until it is set the
button is plainly inert and says so — the site never implies an order can be
placed.

No warranty terms, return windows, servicing times or certifications are
asserted anywhere. The Maison page carries deliberately non-specific policy
copy; replace it with your own terms before launch.

## Specifications

`SHARED_SPECS` in `src/lib/catalog/millenium.ts` is a **closed list** of the
eight confirmed supplier values. Nothing may be added to it without a confirmed
source — no finishing techniques, no materials beyond those stated. Product
subtitles and descriptions describe colour only, never material.

## Checks

```bash
npm run audit      # contrast gate, then landmarks, alt text, single h1,
                   # horizontal overflow 320px–4K
npm run contrast   # WCAG AA gate on the text tokens alone
npm run perf       # transfer weight and FCP/LCP per route
npm run shots      # screenshots at desktop and mobile
npm run lint
```

`npm run contrast` fails the build if any text token drops below 4.5:1 against
any surface it can sit on, so the palette cannot regress.

`scripts/cart-test.mjs` drives the shopping flow end to end against a running
build: add, quantity, colourway switching, prev/next navigation, the bag page,
removal, persistence across reload and the mobile menu.
