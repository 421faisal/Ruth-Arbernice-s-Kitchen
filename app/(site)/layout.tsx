import Link from "next/link";
import { getMenu, getSettings, locationLabel } from "@/lib/data";
import { telHref } from "@/lib/format";
import { restaurantJsonLd } from "@/lib/seo";
import { SiteHeader } from "@/components/site/SiteHeader";
import { NAV } from "@/lib/nav";
import { HoursList } from "@/components/site/HoursList";
import { SocialButtons } from "@/components/site/Social";
import { JsonLd } from "@/components/site/JsonLd";
import { OrderButtons } from "@/components/site/OrderButtons";
import { fulfillmentLabel } from "@/lib/ordering";

import { Ornament } from "@/components/site/Section";

export default async function SiteLayout({ children }: LayoutProps<"/">) {
  const [s, menu] = await Promise.all([getSettings(), getMenu()]);
  const tel = telHref(s.phone);
  const where = locationLabel(s);

  return (
    <>
      <JsonLd data={restaurantJsonLd(s, menu)} />
      <SiteHeader phone={s.phone} tel={tel} announcement={s.announcement} />

      <main className="flex-1">{children}</main>

      <footer className="lux-bg relative overflow-hidden border-t border-gold/15">
        <div className="hairline absolute inset-x-0 top-0" aria-hidden />
        <div className="mx-auto max-w-6xl px-5 pt-20">
          <div className="flex flex-col items-center gap-6 text-center">
            <img src="/brand/logo-primary-gold.png" alt="Ruth ’N’ Arbernise’s Kitchen logo" className="w-52 sm:w-60" loading="lazy" />
            <p className="max-w-md text-muted">
              Family owned &amp; operated in {where}. Named in honor of Grandmothers Ruth &amp; Arbernise.
            </p>
            <SocialButtons social={s.social} className="justify-center" />
          </div>

          <div className="mt-16 grid gap-12 border-t border-line pt-14 md:grid-cols-3">
            <div>
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Visit &amp; order</h2>
              {/* NAP: kept identical everywhere for local SEO */}
              <address className="space-y-2 not-italic text-cream/90">
                <p className="font-serif text-lg">Ruth ’N’ Arbernise’s Kitchen</p>
                {s.address && <p>{s.address}</p>}
                <p>{[s.city, `${s.state} ${s.zip}`.trim()].filter(Boolean).join(", ") || "North Carolina"}</p>
                {s.phone && (
                  <p>
                    <a href={tel} className="gold-text font-serif text-2xl font-bold">
                      {s.phone}
                    </a>
                  </p>
                )}
                <p className="text-sm text-muted">{fulfillmentLabel(s)}</p>
              </address>
              <OrderButtons s={s} className="mt-5" />
            </div>
            <div>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Hours · Eastern time</h2>
              <HoursList hours={s.hours} />
            </div>
            <div>
              <h2 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">Explore</h2>
              <ul className="space-y-3">
                {NAV.map((n) => (
                  <li key={n.href}>
                    <Link href={n.href} className="group inline-flex items-center gap-2 text-cream/85 transition hover:text-gold-light">
                      <span className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-4" aria-hidden />
                      {n.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link href="/#faq" className="group inline-flex items-center gap-2 text-cream/85 transition hover:text-gold-light">
                    <span className="h-px w-0 bg-gold transition-all duration-500 group-hover:w-4" aria-hidden />
                    Questions
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-14 flex flex-col items-center gap-4 border-t border-line py-8 text-center text-xs text-muted">
            <Ornament />
            <p>
              © Ruth ’N’ Arbernise’s Kitchen · {where} · Rooted in Illinois ·{" "}
              <Link href="/admin" className="hover:text-gold" rel="nofollow">
                Owner login
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </>
  );
}
