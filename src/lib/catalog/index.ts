import type { Collection, CropRole, Product, ProductImage } from "./types";
import {
  GALLERY_ORDER,
  SHARED_IMAGES,
  imagePath,
  sharedImagePath,
  shot,
  shotHeight,
  shotLabel,
} from "./shots";
import { BLUR } from "./blur.generated";
import { MILLENIUM } from "./millenium";
import { TSUKI } from "./tsuki";

/**
 * Fills in a collection's imagery from what the build derived.
 *
 * An announced collection has no references yet, so this simply returns it
 * untouched — the loop below has nothing to walk.
 */
function withImages(collection: Collection): Collection {
  for (const product of collection.products) {
    product.images = GALLERY_ORDER.map((role): ProductImage => {
      const s = shot(role);
      return {
        role,
        src: imagePath(collection.slug, product.slug, role),
        width: s.w,
        height: shotHeight(s),
        alt: {
          de: `ORBIS ${collection.name} ${product.name} — Ansicht ${s.label.de}. ${product.subtitle.de}.`,
          en: `ORBIS ${collection.name} ${product.name} — ${s.label.en.toLowerCase()} view. ${product.subtitle.en}.`,
        },
        blurDataURL: BLUR[`${collection.slug}/${product.slug}/${role}`] ?? "",
      };
    });

    // The shared framings close the gallery. They come from whatever the build
    // found in assets/caseback/, so an empty folder simply adds nothing here.
    for (const s of SHARED_IMAGES) {
      product.images.push({
        role: s.role,
        src: sharedImagePath(collection.slug, s.role),
        width: s.width,
        height: s.height,
        alt: {
          de: `ORBIS ${collection.name} — ${shotLabel(s.role, "de")}, geteilt von jeder Referenz der Kollektion.`,
          en: `ORBIS ${collection.name} — ${shotLabel(s.role, "en").toLowerCase()}, shared by every reference in the collection.`,
        },
        blurDataURL: s.blurDataURL,
      });
    }
  }
  return collection;
}

export const COLLECTIONS: Collection[] = [MILLENIUM, TSUKI].map(withImages);

/** The collections a visitor can actually buy from. */
export const SHOP_COLLECTIONS = COLLECTIONS.filter((c) => c.status === "available");

export { MILLENIUM, TSUKI };

export function cardImage(collectionSlug: string, productSlug: string) {
  const s = shot("card");
  return {
    src: imagePath(collectionSlug, productSlug, "card"),
    width: s.w,
    height: shotHeight(s),
    blurDataURL: BLUR[`${collectionSlug}/${productSlug}/card`] ?? "",
  };
}

/**
 * One framing of a reference, for pages that want a single frame rather than
 * the gallery. Kept separate from product.images so a framing can leave
 * GALLERY_ORDER — as "lifestyle" has — without breaking a page that uses it.
 */
export function frameImage(collectionSlug: string, productSlug: string, role: CropRole) {
  const found = getProduct(collectionSlug, productSlug);
  if (!found) throw new Error(`unknown reference ${collectionSlug}/${productSlug}`);
  const { collection, product } = found;
  const s = shot(role);
  return {
    role,
    src: imagePath(collectionSlug, productSlug, role),
    width: s.w,
    height: shotHeight(s),
    alt: {
      de: `ORBIS ${collection.name} ${product.name} — Ansicht ${s.label.de}. ${product.subtitle.de}.`,
      en: `ORBIS ${collection.name} ${product.name} — ${s.label.en.toLowerCase()} view. ${product.subtitle.en}.`,
    },
    blurDataURL: BLUR[`${collectionSlug}/${productSlug}/${role}`] ?? "",
  };
}

export function getCollection(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getProduct(collectionSlug: string, productSlug: string) {
  const collection = getCollection(collectionSlug);
  const product = collection?.products.find((p) => p.slug === productSlug);
  return collection && product ? { collection, product } : undefined;
}

export function allProducts(): { collection: Collection; product: Product }[] {
  return COLLECTIONS.flatMap((c) => c.products.map((p) => ({ collection: c, product: p })));
}
