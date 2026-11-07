"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { NAV } from "@/lib/nav";


function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  if (href.startsWith("/#")) return false;
  return pathname.startsWith(href);
}

export function Brand({ size = "md" }: { size?: "md" | "lg" }) {
  return (
    <span className="flex items-center gap-3">
      <img src="/brand/icon-gold.png" alt="" className={size === "lg" ? "h-14 w-14" : "h-10 w-10 sm:h-11 sm:w-11"} />
      <span className="whitespace-nowrap leading-none">
        <span className={`gold-text block font-script ${size === "lg" ? "text-3xl" : "text-[1.35rem] sm:text-[1.6rem]"}`}>Ruth ’N’ Arbernise’s</span>
        <span className="mt-1 block text-[8px] font-semibold uppercase tracking-[0.3em] text-gold/80 sm:text-[9px] sm:tracking-[0.42em]">
          Kitchen<span className="hidden sm:inline"> · Rooted in Illinois</span>
        </span>
      </span>
    </span>
  );
}

export function SiteHeader({ phone, tel, announcement }: { phone: string; tel: string; announcement: string }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // The menu remembers which page it was opened on, so it closes by itself after navigating.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (fn: (o: boolean) => boolean) => setOpenOn(fn(open) ? pathname : null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const solid = scrolled || open;

  return (
    <div className="fixed inset-x-0 top-0 z-50">
      {announcement && (
        <div className="bg-gradient-to-r from-gold-dark via-gold to-gold-dark px-4 py-2 text-center text-sm font-semibold text-ink">
          {announcement}
        </div>
      )}
      <header
        className={`transition-all duration-500 ${
          solid ? "border-b border-gold/15 bg-ink/80 shadow-[0_10px_40px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl" : "border-b border-transparent bg-transparent"
        }`}
      >
        <div className={`mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 transition-all duration-500 ${solid ? "h-[72px]" : "h-24"}`}>
          <Link href="/" aria-label="Ruth ’N’ Arbernise’s Kitchen, home">
            <Brand />
          </Link>

          <nav aria-label="Main" className="hidden items-center gap-8 lg:flex">
            {NAV.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`group relative py-2 text-[13px] font-medium uppercase tracking-[0.18em] transition-colors ${
                  isActive(pathname, n.href) ? "text-gold-light" : "text-cream/75 hover:text-gold-light"
                }`}
              >
                {n.label}
                <span
                  className={`absolute -bottom-0.5 left-0 h-px bg-gold transition-all duration-500 ${
                    isActive(pathname, n.href) ? "w-full" : "w-0 group-hover:w-full"
                  }`}
                />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {phone && (
              <a href={tel} className="btn-gold hidden px-5 py-2.5 text-sm sm:inline-flex">
                Call to order
              </a>
            )}
            <button
              type="button"
              onClick={() => setOpen((o) => !o)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-gold/30 text-gold lg:hidden"
            >
              <span className="sr-only">{open ? "Close menu" : "Open menu"}</span>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
                {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M7 16h13" />}
              </svg>
            </button>
          </div>
        </div>

        <div
          id="mobile-menu"
          className={`overflow-hidden transition-[max-height,opacity] duration-500 lg:hidden ${open ? "max-h-[480px] opacity-100" : "max-h-0 opacity-0"}`}
        >
          <nav aria-label="Mobile" className="mx-auto flex max-w-6xl flex-col px-5 pb-6">
            {NAV.map((n, i) => (
              <Link
                key={n.href}
                href={n.href}
                className={`border-b border-line py-4 font-serif text-2xl transition ${isActive(pathname, n.href) ? "text-gold-light" : "text-cream"} ${
                  open ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                style={{ transitionDelay: open ? `${80 + i * 50}ms` : "0ms", transitionDuration: "500ms" }}
              >
                {n.label}
              </Link>
            ))}
            {phone && (
              <a href={tel} className="btn-gold mt-6 py-3.5">
                Call to order · {phone}
              </a>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}
