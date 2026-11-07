import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { CATEGORY_ORDER } from "@/lib/format";
import { MenuItemForm } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Add a dish" };

export default function NewMenuItemPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <NewItem />
    </Suspense>
  );
}

async function NewItem() {
  await requireAdmin();
  const cats = await db.menuItem.findMany({ select: { category: true }, distinct: ["category"] });
  const categories = [...new Set([...CATEGORY_ORDER, ...cats.map((c) => c.category)])];
  return (
    <div className="space-y-6">
      <Link href="/admin/menu" className="text-sm text-gold hover:underline">← Back to menu</Link>
      <h1 className="font-serif text-3xl font-bold text-cream">Add a dish</h1>
      <div className="rounded-2xl border border-line bg-ink p-6 sm:p-8">
        <MenuItemForm categories={categories} />
      </div>
    </div>
  );
}
