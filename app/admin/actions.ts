"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { TAGS } from "@/lib/data";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { deleteImage, saveImage, UploadError } from "@/lib/storage";
import { slugify } from "@/lib/format";
import type { DayHours } from "@/lib/hours";

export type ActionState = { ok: boolean; message: string } | null;

const str = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();
const bool = (fd: FormData, key: string) => fd.get(key) === "on" || fd.get(key) === "true";

/** "$12.50" / "12.5" -> 1250, "" -> null (Call for price) */
function parsePrice(raw: string): number | null | "invalid" {
  const cleaned = raw.replace(/[$,\s]/g, "");
  if (cleaned === "") return null;
  if (!/^\d+(\.\d{1,2})?$/.test(cleaned)) return "invalid";
  return Math.round(parseFloat(cleaned) * 100);
}

function errorMessage(e: unknown) {
  if (e instanceof UploadError) return e.message;
  console.error(e);
  return "Something went wrong. Please try again.";
}

// ---------------------------------------------------------------- auth

export async function loginAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  const password = str(fd, "password");
  await new Promise((r) => setTimeout(r, 400)); // slow down guessing
  if (!checkPassword(password)) return { ok: false, message: "That password isn't right. Please try again." };
  await createSession();
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

// ---------------------------------------------------------------- menu

export async function saveMenuItemAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  const name = str(fd, "name");
  if (!name) return { ok: false, message: "Please give the dish a name." };
  const price = parsePrice(str(fd, "price"));
  if (price === "invalid") return { ok: false, message: "Price should look like 12.99 (or leave it empty for “Call for price”)." };

  try {
    const existing = id ? await db.menuItem.findUnique({ where: { id } }) : null;
    let imageUrl = existing?.imageUrl ?? null;
    const uploaded = await saveImage(fd.get("image") as File | null, "menu");
    if (uploaded) {
      await deleteImage(imageUrl);
      imageUrl = uploaded;
    } else if (bool(fd, "removeImage")) {
      await deleteImage(imageUrl);
      imageUrl = null;
    }

    const data = {
      name,
      description: str(fd, "description"),
      category: str(fd, "category") || "Entrées",
      priceCents: price,
      featured: bool(fd, "featured"),
      available: bool(fd, "available"),
      sortOrder: Number(str(fd, "sortOrder")) || 0,
      imageUrl,
    };
    if (existing) await db.menuItem.update({ where: { id }, data });
    else await db.menuItem.create({ data });
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
  updateTag(TAGS.menu);
  redirect("/admin/menu?saved=1");
}

/** Quick price + availability edit from the menu list. */
export async function quickUpdateMenuItemAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  const price = parsePrice(str(fd, "price"));
  if (price === "invalid") return { ok: false, message: "Use a price like 12.99" };
  await db.menuItem.update({ where: { id }, data: { priceCents: price, available: bool(fd, "available") } });
  updateTag(TAGS.menu);
  return { ok: true, message: "Saved" };
}

export async function deleteMenuItemAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const item = await db.menuItem.findUnique({ where: { id } });
  if (item) {
    await deleteImage(item.imageUrl);
    await db.menuItem.delete({ where: { id } });
  }
  updateTag(TAGS.menu);
  redirect("/admin/menu?deleted=1");
}

// ---------------------------------------------------------------- blog

export async function savePostAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const id = str(fd, "id");
  const title = str(fd, "title");
  if (!title) return { ok: false, message: "Please give the post a title." };
  const slug = slugify(str(fd, "slug") || title);
  if (!slug) return { ok: false, message: "Please use letters or numbers in the web address." };

  try {
    const clash = await db.post.findUnique({ where: { slug } });
    if (clash && clash.id !== id) return { ok: false, message: "Another post already uses that web address. Please change it." };

    const existing = id ? await db.post.findUnique({ where: { id } }) : null;
    let coverUrl = existing?.coverUrl ?? null;
    const uploaded = await saveImage(fd.get("cover") as File | null, "blog");
    if (uploaded) {
      await deleteImage(coverUrl);
      coverUrl = uploaded;
    } else if (bool(fd, "removeCover")) {
      await deleteImage(coverUrl);
      coverUrl = null;
    }

    const published = bool(fd, "published");
    const data = {
      title,
      slug,
      excerpt: str(fd, "excerpt"),
      content: String(fd.get("content") ?? ""),
      coverUrl,
      published,
      publishedAt: published ? (existing?.publishedAt ?? new Date()) : existing?.publishedAt ?? null,
    };
    if (existing) await db.post.update({ where: { id }, data });
    else await db.post.create({ data });
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
  updateTag(TAGS.posts);
  redirect("/admin/blog?saved=1");
}

export async function deletePostAction(fd: FormData) {
  await requireAdmin();
  const id = str(fd, "id");
  const post = await db.post.findUnique({ where: { id } });
  if (post) {
    await deleteImage(post.coverUrl);
    await db.post.delete({ where: { id } });
  }
  updateTag(TAGS.posts);
  redirect("/admin/blog?deleted=1");
}

// ---------------------------------------------------------------- settings

export async function saveSettingsAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  const hours: DayHours[] = Array.from({ length: 7 }, (_, d) => ({
    closed: !bool(fd, `open_${d}`),
    open: str(fd, `from_${d}`) || "11:00",
    close: str(fd, `to_${d}`) || "17:00",
  }));
  const bad = hours.findIndex((h) => !h.closed && h.close <= h.open);
  if (bad !== -1) return { ok: false, message: "One of the days closes before it opens. Please check the hours." };

  const urls = ["facebookUrl", "instagramUrl", "tiktokUrl", "linkedinUrl", "doordashUrl", "ubereatsUrl"].map((k) => [k, normalizeUrl(str(fd, k))] as const);
  const badUrl = urls.find(([, v]) => v === null);
  if (badUrl) return { ok: false, message: "One of the links doesn't look like a web address. Paste the full link, e.g. https://www.doordash.com/store/…" };

  const data = {
    phone: str(fd, "phone"),
    address: str(fd, "address"),
    city: str(fd, "city"),
    state: str(fd, "state").toUpperCase() || "NC",
    zip: str(fd, "zip"),
    announcement: str(fd, "announcement"),
    orderNote: str(fd, "orderNote"),
    deliveryEnabled: bool(fd, "deliveryEnabled"),
    ...(Object.fromEntries(urls) as Record<string, string>),
    whatsappNumber: str(fd, "whatsappNumber").replace(/\D/g, ""),
    hoursJson: JSON.stringify(hours),
  };
  await db.settings.upsert({ where: { id: "site" }, update: data, create: { id: "site", ...data } });
  updateTag(TAGS.settings);
  return { ok: true, message: "Saved! The website is updated." };
}

/** "" stays "", "facebook.com/x" becomes "https://facebook.com/x", anything that isn't a link returns null. */
function normalizeUrl(raw: string): string | null {
  if (!raw) return "";
  const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const u = new URL(withScheme);
    return u.hostname.includes(".") ? u.toString() : null;
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------- owner story

export async function saveStoryAction(_prev: ActionState, fd: FormData): Promise<ActionState> {
  await requireAdmin();
  try {
    const current = await db.settings.findUnique({ where: { id: "site" } });
    let ownerPhotoUrl = current?.ownerPhotoUrl ?? null;
    const uploaded = await saveImage(fd.get("photo") as File | null, "story");
    if (uploaded) {
      await deleteImage(ownerPhotoUrl);
      ownerPhotoUrl = uploaded;
    } else if (bool(fd, "removePhoto")) {
      await deleteImage(ownerPhotoUrl);
      ownerPhotoUrl = null;
    }
    const data = {
      ownerName: str(fd, "ownerName"),
      ownerTitle: str(fd, "ownerTitle"),
      ownerQuote: str(fd, "ownerQuote"),
      ownerStory: String(fd.get("ownerStory") ?? ""),
      ownerPhotoUrl,
    };
    await db.settings.upsert({ where: { id: "site" }, update: data, create: { id: "site", ...data } });
  } catch (e) {
    return { ok: false, message: errorMessage(e) };
  }
  updateTag(TAGS.settings);
  return { ok: true, message: "Your story is saved and live on the Our Story page." };
}
