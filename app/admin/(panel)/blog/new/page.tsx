import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { PostForm } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Write a post" };

export default function NewPostPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <NewPost />
    </Suspense>
  );
}

async function NewPost() {
  await requireAdmin();
  return (
    <div className="space-y-6">
      <Link href="/admin/blog" className="text-sm text-gold hover:underline">← Back to blog</Link>
      <h1 className="font-serif text-3xl font-bold text-cream">Write a post</h1>
      <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8">
        <PostForm />
      </div>
    </div>
  );
}
