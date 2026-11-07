import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { db } from "./db";
import { parseHours } from "./hours";

// Public, cached reads. Admin actions call updateTag(...) with these tags after every change,
// so visitors see edits right away while pages stay fast and prerendered.
export const TAGS = { menu: "menu", posts: "posts", settings: "settings" } as const;

export async function getSettings() {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.settings);
  const s = await db.settings.findUnique({ where: { id: "site" } });
  return {
    phone: s?.phone ?? "",
    address: s?.address ?? "",
    city: s?.city ?? "",
    state: s?.state || "NC",
    zip: s?.zip ?? "",
    announcement: s?.announcement ?? "",
    orderNote: s?.orderNote ?? "",
    deliveryEnabled: s?.deliveryEnabled ?? false,
    delivery: {
      doordash: s?.doordashUrl ?? "",
      ubereats: s?.ubereatsUrl ?? "",
    },
    hours: parseHours(s?.hoursJson),
    social: {
      facebook: s?.facebookUrl ?? "",
      instagram: s?.instagramUrl ?? "",
      tiktok: s?.tiktokUrl ?? "",
      whatsapp: s?.whatsappNumber ?? "",
      linkedin: s?.linkedinUrl ?? "",
    },
    owner: {
      name: s?.ownerName ?? "",
      title: s?.ownerTitle ?? "",
      photoUrl: s?.ownerPhotoUrl ?? null,
      quote: s?.ownerQuote ?? "",
      story: s?.ownerStory ?? "",
    },
  };
}

/** "Charlotte, NC" (or just "North Carolina" until the owner adds a city). */
export function locationLabel(s: Pick<SiteSettings, "city" | "state">) {
  if (s.city) return `${s.city}, ${s.state || "NC"}`;
  return s.state === "NC" || !s.state ? "North Carolina" : s.state;
}
export type SiteSettings = Awaited<ReturnType<typeof getSettings>>;

export async function getMenu() {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.menu);
  return db.menuItem.findMany({ where: { available: true }, orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
}

export async function getFeaturedMenu() {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.menu);
  return db.menuItem.findMany({
    where: { available: true, featured: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
    take: 6,
  });
}

export async function getPublishedPosts(limit?: number) {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.posts);
  return db.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: { id: true, title: true, slug: true, excerpt: true, coverUrl: true, publishedAt: true },
  });
}

export async function getPostBySlug(slug: string) {
  "use cache";
  cacheLife("days");
  cacheTag(TAGS.posts);
  return db.post.findFirst({ where: { slug, published: true } });
}
