import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { CATEGORY_ORDER } from "@/lib/format";
import { MenuItemForm } from "@/components/admin/forms";
import { ConfirmDelete } from "@/components/admin/ui";
import { deleteMenuItemAction } from "../../../actions";

export const metadata: Metadata = { title: "Edit dish" };

export default function EditMenuItemPage({ params }: PageProps<"/admin/menu/[id]">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <EditItem params={params} />
    </Suspense>
  );
}

async function EditItem({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const [item, cats] = await Promise.all([
    db.menuItem.findUnique({ where: { id } }),
    db.menuItem.findMany({ select: { category: true }, distinct: ["category"] }),
  ]);
  if (!item) notFound();
  const categories = [...new Set([...CATEGORY_ORDER, ...cats.map((c) => c.category)])];

  return (
    <div className="space-y-6">
      <Link href="/admin/menu" className="text-sm text-gold hover:underline">← Back to menu</Link>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-serif text-3xl font-bold text-cream">Edit {item.name}</h1>
        <ConfirmDelete action={deleteMenuItemAction} id={item.id} what={item.name} />
      </div>
      <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8">
        <MenuItemForm item={item} categories={categories} />
      </div>
    </div>
  );
}
