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

The unusual part of this project is that **the product photography is generated,
not photographed** — and it is generated from geometry, not from a diffusion
model, so it can never drift away from the real watch.

```
src/lib/orbis/orb.ts        the ORBIS mark: an orthographic sphere, drawn as
                            meridian bands subdivided by parallels
src/lib/orbis/watch-svg.ts  the MILLENIUM watch: case, bezel, chapter ring,
                            markers, hands, crowns and bracelet, all derived
                            from a handful of superellipse parameters
src/lib/catalog/shots.ts    the campaign framings (hero, angle, detail,
                            lifestyle, card) — one source of truth
scripts/build-assets.mts    photographs every product into every framing
```

The renderer takes a `Colorway` and returns SVG. A colourway only changes dial
colour, orb colour and chapter-ring tone — **the case, markers, hands, crowns
and bracelet are shared by every reference and cannot be altered per product.**
That is deliberate: it is what makes the collection read as one watch in five
dials, and it makes a whole campaign reproducible from `npm run assets`.

### The campaign

`scripts/build-assets.mts` composites each vector watch into the ORBIS
environment plate (`public/world/orbit-plate.webp`) using one lighting and
grading recipe: a single key at 35° from upper left, the same falloff, the same
edge dissolve into `#05070a`. Only the framing changes between shots. Because
every reference passes through the identical pipeline, the collection is
guaranteed to look like one session.

Output lands in `public/products/<collection>/<product>/<role>.webp`
(~900 KB for the entire 25-image campaign).

## Adding a collection

Nothing in the renderer or the pipeline is specific to MILLENIUM.

1. Create `src/lib/catalog/<collection>.ts` exporting a `Collection`: its
   `index`, `tagline`, `intro`, its `world` (name, plate, tone), and its
   products with their `colorway` and `accent`.
2. Drop the collection's environment plate in `public/world/`.
3. Add it to `COLLECTIONS` in `src/lib/catalog/millenium.ts`.
4. `npm run assets`.

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
