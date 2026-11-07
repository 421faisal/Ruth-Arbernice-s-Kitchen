import Link from "next/link";
import { logoutAction } from "../actions";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/menu", label: "Menu & prices" },
  { href: "/admin/story", label: "Our Story" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/settings", label: "Hours & settings" },
];

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <aside className="border-b border-line bg-ink md:sticky md:top-0 md:h-screen md:border-b-0 md:border-r">
        <div className="flex items-center justify-between gap-3 p-4 md:block md:space-y-6 md:p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <img src="/brand/icon-gold.png" alt="" className="h-10 w-10" />
            <span className="font-script text-xl leading-tight text-gold">
              Ruth ’N’ Arbernise’s
              <span className="block font-sans text-[10px] uppercase tracking-[0.25em] text-muted">Owner dashboard</span>
            </span>
          </Link>
          <nav aria-label="Admin" className="hidden flex-col gap-1 md:flex">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="rounded-lg px-3 py-2 text-cream/85 hover:bg-coal hover:text-gold">
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="hidden space-y-2 md:block">
            <Link href="/" target="_blank" className="block rounded-lg px-3 py-2 text-sm text-gold hover:bg-coal">
              View website ↗
            </Link>
            <form action={logoutAction}>
              <button className="w-full rounded-lg px-3 py-2 text-left text-sm text-muted hover:bg-coal hover:text-cream">Log out</button>
            </form>
          </div>
          <form action={logoutAction} className="md:hidden">
            <button className="text-sm text-muted">Log out</button>
          </form>
        </div>
        <nav aria-label="Admin mobile" className="flex gap-1 overflow-x-auto px-3 pb-3 md:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="shrink-0 rounded-full border border-line px-3.5 py-1.5 text-sm text-cream">
              {l.label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="mx-auto w-full max-w-4xl px-5 py-8 md:px-10 md:py-12">{children}</main>
    </div>
  );
}
