import Link from "next/link";
import { Suspense } from "react";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="text-muted">Loading…</p>}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  await requireAdmin();
  const [items, noPrice, noPhoto, posts, drafts, site] = await Promise.all([
    db.menuItem.count(),
    db.menuItem.count({ where: { priceCents: null } }),
    db.menuItem.count({ where: { imageUrl: null } }),
    db.post.count({ where: { published: true } }),
    db.post.count({ where: { published: false } }),
    db.settings.findUnique({ where: { id: "site" } }),
  ]);

  const cards = [
    { href: "/admin/menu", title: "Menu & prices", stat: `${items} dishes`, note: noPrice ? `${noPrice} still need a price` : "All dishes have prices" },
    { href: "/admin/menu", title: "Photos", stat: `${items - noPhoto} of ${items}`, note: noPhoto ? `${noPhoto} dishes need a photo` : "Every dish has a photo" },
    { href: "/admin/blog", title: "Blog", stat: `${posts} published`, note: drafts ? `${drafts} drafts` : "No drafts" },
    {
      href: "/admin/story",
      title: "Our Story",
      stat: site?.ownerName ? `Meet ${site.ownerName}` : "Meet the Owner",
      note: site?.ownerPhotoUrl ? "Your story and photo are live" : "Add your name and photo",
    },
    {
      href: "/admin/settings",
      title: "Hours & settings",
      stat: site?.city ? `${site.city}, ${site.state}` : "Add your city",
      note: site?.city ? "Hours, socials, pickup location" : "Your city helps Google & AI search find you",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-cream">Welcome back!</h1>
        <p className="mt-1 text-muted">Anything you change here shows up on the website right away.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((c) => (
          <Link key={c.title} href={c.href} className="rounded-2xl border border-line bg-ink p-6 transition hover:border-gold/60">
            <p className="text-sm uppercase tracking-widest text-muted">{c.title}</p>
            <p className="mt-2 font-serif text-2xl font-bold text-gold">{c.stat}</p>
            <p className="mt-1 text-sm text-cream/80">{c.note}</p>
          </Link>
        ))}
      </div>
      <div className="flex flex-wrap gap-3">
        <Link href="/admin/menu/new" className="rounded-full bg-gold px-6 py-2.5 font-semibold text-ink hover:bg-gold-light">
          + Add a dish
        </Link>
        <Link href="/admin/blog/new" className="rounded-full border border-gold/60 px-6 py-2.5 font-semibold text-gold hover:bg-gold/10">
          + Write a blog post
        </Link>
      </div>
    </div>
  );
}
