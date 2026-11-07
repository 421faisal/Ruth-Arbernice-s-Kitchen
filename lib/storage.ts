import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, writeFile, unlink } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

// Photos are resized to a web-friendly size and saved as WebP.
// - Locally / on a normal server: saved in ./uploads and served by app/uploads/[...path]/route.ts
// - On Vercel: set BLOB_READ_WRITE_TOKEN and photos go to Vercel Blob instead.
export const UPLOAD_DIR = path.join(process.cwd(), "uploads");
const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/heif", "image/avif", "image/gif"];

export class UploadError extends Error {}

export async function saveImage(file: File | null | undefined, folder: "menu" | "blog" | "story"): Promise<string | null> {
  if (!file || typeof file === "string" || file.size === 0) return null;
  if (file.size > MAX_BYTES) throw new UploadError("That photo is over 10 MB. Please choose a smaller one.");
  if (file.type && !ALLOWED.includes(file.type)) throw new UploadError("Please upload a JPG, PNG or WebP photo.");

  let output: Buffer;
  try {
    output = await sharp(Buffer.from(await file.arrayBuffer()))
      .rotate() // respect phone camera orientation
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 82 })
      .toBuffer();
  } catch {
    throw new UploadError("We couldn't read that photo. Please try a JPG or PNG.");
  }

  const name = `${folder}/${Date.now()}-${randomUUID().slice(0, 8)}.webp`;

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const { put } = await import("@vercel/blob");
    const blob = await put(name, output, { access: "public", contentType: "image/webp" });
    return blob.url;
  }

  const target = path.join(UPLOAD_DIR, name);
  await mkdir(path.dirname(target), { recursive: true });
  await writeFile(target, output);
  return `/uploads/${name}`;
}

export async function deleteImage(url: string | null | undefined) {
  if (!url) return;
  try {
    if (url.startsWith("/uploads/")) {
      const target = path.join(UPLOAD_DIR, url.slice("/uploads/".length));
      if (target.startsWith(UPLOAD_DIR + path.sep)) await unlink(target);
    } else if (process.env.BLOB_READ_WRITE_TOKEN && url.includes(".blob.vercel-storage.com")) {
      const { del } = await import("@vercel/blob");
      await del(url);
    }
  } catch {
    /* file already gone: nothing to do */
  }
}
