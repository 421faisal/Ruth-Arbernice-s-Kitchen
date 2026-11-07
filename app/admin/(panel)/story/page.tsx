import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { StoryForm } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Our Story" };

export default function AdminStoryPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <Story />
    </Suspense>
  );
}

async function Story() {
  await requireAdmin();
  const s = await db.settings.findUnique({ where: { id: "site" } });
  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream">Your story</h1>
          <p className="mt-1 text-muted">Tell customers who you are. This appears as “Meet the Owner” on the Our Story page.</p>
        </div>
        <Link href="/story" target="_blank" className="text-sm text-gold hover:underline">
          View the page ↗
        </Link>
      </div>
      <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8">
        <StoryForm
          s={{
            name: s?.ownerName ?? "",
            title: s?.ownerTitle ?? "",
            photoUrl: s?.ownerPhotoUrl ?? null,
            quote: s?.ownerQuote ?? "",
            story: s?.ownerStory ?? "",
          }}
        />
      </div>
    </div>
  );
}
