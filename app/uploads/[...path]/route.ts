import { readFile } from "node:fs/promises";
import path from "node:path";
import { UPLOAD_DIR } from "@/lib/storage";

// Serves photos uploaded through the admin (when not using Vercel Blob).
export async function GET(_req: Request, ctx: RouteContext<"/uploads/[...path]">) {
  const { path: parts } = await ctx.params;
  const target = path.join(UPLOAD_DIR, ...parts);
  if (!target.startsWith(UPLOAD_DIR + path.sep) || !target.endsWith(".webp")) {
    return new Response("Not found", { status: 404 });
  }
  try {
    const data = await readFile(target);
    return new Response(new Uint8Array(data), {
      headers: { "Content-Type": "image/webp", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
