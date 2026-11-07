import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { sortCategories } from "@/lib/format";
import { QuickPriceForm } from "@/components/admin/forms";

export const metadata: Metadata = { title: "Menu & prices" };

export default function AdminMenuPage({ searchParams }: PageProps<"/admin/menu">) {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <MenuList searchParams={searchParams} />
    </Suspense>
  );
}

async function MenuList({ searchParams }: { searchParams: PageProps<"/admin/menu">["searchParams"] }) {
  await requireAdmin();
  const sp = await searchParams;
  const items = await db.menuItem.findMany({ orderBy: [{ sortOrder: "asc" }, { name: "asc" }] });
  const categories = sortCategories([...new Set(items.map((i) => i.category))]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-cream">Menu &amp; prices</h1>
          <p className="mt-1 text-muted">Change a price and press Save. Click a dish name to edit its photo and details.</p>
        </div>
        <Link href="/admin/menu/new" className="rounded-full bg-gold px-6 py-2.5 font-semibold text-ink hover:bg-gold-light">
          + Add a dish
        </Link>
      </div>

      {sp.saved && <p role="status" className="rounded-lg border border-ok/40 bg-ok/10 px-4 py-3 text-sm text-ok">Saved! The menu on the website is updated.</p>}
      {sp.deleted && <p role="status" className="rounded-lg border border-line bg-ink px-4 py-3 text-sm text-muted">Dish deleted.</p>}

      {categories.map((cat) => (
        <section key={cat} className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-gold">{cat}</h2>
          <ul className="divide-y divide-line overflow-hidden rounded-xl border border-line bg-ink">
            {items
              .filter((i) => i.category === cat)
              .map((i) => (
                <li key={i.id} className="flex flex-wrap items-center gap-4 p-3 sm:flex-nowrap">
                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg border border-line bg-coal">
                    {i.imageUrl ? (
                      <img src={i.imageUrl} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <Link href={`/admin/menu/${i.id}`} className="flex h-full items-center justify-center text-[10px] leading-tight text-muted hover:text-gold">
                        + photo
                      </Link>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <Link href={`/admin/menu/${i.id}`} className="font-semibold text-cream hover:text-gold">
                      {i.name}
                    </Link>
                    <p className="text-xs text-muted">
                      {!i.available && <span className="mr-2 text-red-300">Hidden</span>}
                      {i.featured && <span className="mr-2 text-gold">★ Favorite</span>}
                      {i.priceCents === null && <span>No price yet</span>}
                    </p>
                  </div>
                  <QuickPriceForm id={i.id} priceCents={i.priceCents} available={i.available} />
                </li>
              ))}
          </ul>
        </section>
      ))}
      {items.length === 0 && <p className="text-muted">No dishes yet. Add your first one!</p>}
    </div>
  );
}
