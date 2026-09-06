import type { MetadataRoute } from "next";
import { COLLECTIONS, allProducts } from "@/lib/catalog";
import { LANGS, path as langPath } from "@/lib/i18n";
import { absolute } from "@/lib/site";

/*
 * Both this route and robots.ts read only from the catalog, so they are static
 * either way. Saying so explicitly is what lets `npm run export` emit them as
 * files instead of refusing the build.
 */
export const dynamic = "force-static";

/**
 * Every page, in every language, each one declaring the other reading.
 *
 * A search engine that finds the German product page should be told the
 * English one exists and is the same product, which is what the alternates
 * are for — otherwise the two read as duplicates competing with each other.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const paths = [
    { rest: "", priority: 1, frequency: "monthly" as const },
    { rest: "/maison", priority: 0.4, frequency: "yearly" as const },
    ...COLLECTIONS.map((c) => ({
      rest: `/collections/${c.slug}`,
      priority: 0.9,
      frequency: "monthly" as const,
    })),
    ...allProducts().map(({ collection, product }) => ({
      rest: `/collections/${collection.slug}/${product.slug}`,
      priority: 0.8,
      frequency: "monthly" as const,
    })),
  ];

  return paths.flatMap(({ rest, priority, frequency }) =>
    LANGS.map((lang) => ({
      url: absolute(langPath(lang, rest)),
      lastModified: now,
      changeFrequency: frequency,
      priority,
      alternates: {
        languages: Object.fromEntries(LANGS.map((l) => [l, absolute(langPath(l, rest))])),
      },
    }))
  );
}
