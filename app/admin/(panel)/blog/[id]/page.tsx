import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { PostForm } from "@/components/admin/forms";
import { ConfirmDelete } from "@/components/admin/ui";
import { deletePostAction } from "@/app/admin/actions";

export const metadata: Metadata = { title: "Edit post" };

export default function EditPostPage({ params }: PageProps<"/admin/blog/[id]">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <EditPost params={params} />
    </Suspense>
  );
}

async function EditPost({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await db.post.findUnique({ where: { id } });
  if (!post) notFound();
  return (
    <div className="space-y-6">
      <Link href="/admin/blog" className="text-sm text-gold hover:underline">← Back to blog</Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-cream">Edit post</h1>
        <ConfirmDelete action={deletePostAction} id={post.id} what={`“${post.title}”`} />
      </div>
      <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8">
        <PostForm post={post} />
      </div>
    </div>
  );
}
