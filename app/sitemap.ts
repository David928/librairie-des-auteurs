import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";
import { SITE } from "@/lib/site";

const BASE_URL = SITE.url;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const [{ data: authors }, { data: books }] = await Promise.all([
    supabase.from("authors").select("slug, created_at"),
    supabase.from("books").select("slug, created_at"),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: "daily", priority: 1 },
    { url: `${BASE_URL}/nouveautes`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/dedicaces`, changeFrequency: "daily", priority: 0.8 },
    { url: `${BASE_URL}/auteurs`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/livres`, changeFrequency: "daily", priority: 0.7 },
    { url: `${BASE_URL}/infos`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const authorRoutes: MetadataRoute.Sitemap = (authors ?? []).map((a) => ({
    url: `${BASE_URL}/auteurs/${a.slug}`,
    lastModified: a.created_at,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const bookRoutes: MetadataRoute.Sitemap = (books ?? []).map((b) => ({
    url: `${BASE_URL}/livres/${b.slug}`,
    lastModified: b.created_at,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  return [...staticRoutes, ...authorRoutes, ...bookRoutes];
}
