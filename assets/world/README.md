# World plates

An ultra-wide backdrop per collection: the sky the collection is photographed
into. It sits behind the collection's hero, graded down almost to black, so a
headline can be read over it.

## Adding one

Drop the file in, named after the collection's slug — `tsuki.png` becomes
`/world/tsuki.webp`, which is what `TSUKI.world.plate` points at. `npm run
assets` resizes it to 2000px wide and converts it; the source can be as large
as you like.

A collection whose plate is missing keeps the house atmosphere instead, so the
page is never broken by an absent file — set `world.plate` to `null` in the
collection until the plate exists.

## What makes a usable plate

- **Very wide.** 21:9 or wider. It is cropped hard on a phone.
- **Dark, with the top two thirds almost empty.** The collection name is set
  over it at display size; a busy upper half makes that unreadable.
- **No watch in it.** This is the world, not the product. The references carry
  the product photography.
