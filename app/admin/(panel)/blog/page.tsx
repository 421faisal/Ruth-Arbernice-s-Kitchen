import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = { title: "Blog" };

export default function AdminBlogPage({ searchParams }: PageProps<"/admin/blog">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <PostList searchParams={searchParams} />
    </Suspense>
  );
}

async function PostList({ searchParams }: { searchParams: PageProps<"/admin/blog">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const posts = await db.post.findMany({ orderBy: [{ updatedAt: "desc" }] });

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream">Blog</h1>
          <p className="mt-1 text-muted">Share specials, news and family stories.</p>
        </div>
        <Link href="/admin/blog/new" className="rounded-full bg-gold px-6 py-2.5 font-semibold text-ink hover:bg-gold-light">
          + Write a post
        </Link>
      </div>
      {sp.saved && <p role="status" className="rounded-lg border border-ok/40 bg-ok/10 px-4 py-3 text-sm text-ok">Post saved!</p>}
      {sp.deleted && <p role="status" className="rounded-lg border border-line bg-ink px-4 py-3 text-sm text-muted">Post deleted.</p>}
      <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-ink">
        {posts.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <Link href={`/admin/blog/${p.id}`} className="font-semibold text-cream hover:text-gold">
                {p.title}
              </Link>
              <p className="text-xs text-muted">
                {p.published ? <span className="text-ok">Published {formatDate(p.publishedAt)}</span> : <span className="text-gold">Draft</span>}
              </p>
            </div>
            <div className="flex gap-3 text-sm">
              {p.published && (
                <Link href={`/blog/${p.slug}`} target="_blank" className="text-muted hover:text-gold">
                  View ↗
                </Link>
              )}
              <Link href={`/admin/blog/${p.id}`} className="text-gold hover:underline">
                Edit
              </Link>
            </div>
          </li>
        ))}
        {posts.length === 0 && <li className="p-4 text-muted">No posts yet.</li>}
      </ul>
    </div>
  );
}
