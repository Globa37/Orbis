import type { MetadataRoute } from "next";
import { COLLECTIONS, allProducts } from "@/lib/catalog/millenium";
import { absolute } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: absolute("/"), lastModified: now, changeFrequency: "monthly", priority: 1 },
    { url: absolute("/maison"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    ...COLLECTIONS.map((c) => ({
      url: absolute(`/collections/${c.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...allProducts().map(({ collection, product }) => ({
      url: absolute(`/collections/${collection.slug}/${product.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
