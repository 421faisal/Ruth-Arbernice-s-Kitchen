import type { Metadata } from "next";
import { getMenu, getSettings } from "@/lib/data";
import { formatPrice, sortCategories, telHref } from "@/lib/format";
import { breadcrumbJsonLd, menuJsonLd } from "@/lib/seo";
import { DishImage } from "@/components/site/DishCard";
import { PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Motion";
import { JsonLd } from "@/components/site/JsonLd";
import { OrderButtons } from "@/components/site/OrderButtons";
import { fulfillmentLabel } from "@/lib/ordering";


export const metadata: Metadata = {
  title: "Menu · Fried Chicken, Pot Roast & Soul Food Sides",
  description:
    "The Ruth ’N’ Arbernise’s Kitchen menu: fried chicken, baked chicken, Mississippi pot roast, macaroni, collard greens with smoked ham hocks, green beans with smoked turkey and more. Every meal comes with cornbread. Family owned in North Carolina.",
  alternates: { canonical: "/menu" },
};

export default async function MenuPage() {
  const [items, s] = await Promise.all([getMenu(), getSettings()]);
  const categories = sortCategories([...new Set(items.map((i) => i.category))]);

  return (
    <>
      <JsonLd data={menuJsonLd(items)} />
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Menu", path: "/menu" }])} />

      <PageHero image="/images/southern-fried-chicken.webp" eyebrow="Our menu" title={<>What’s <span className="gold-text italic">cooking</span></>}>
        Every meal comes with cornbread. {fulfillmentLabel(s)}.{" "}
        {s.phone && (
          <>
            Call{" "}
            <a className="text-gold-light underline decoration-gold/40 underline-offset-4 hover:decoration-gold" href={telHref(s.phone)}>
              {s.phone}
            </a>{" "}
            to order.
          </>
        )}
        <OrderButtons s={s} className="mt-7 justify-center" />
      </PageHero>

      {categories.length > 1 && (
        <nav aria-label="Menu sections" className="sticky top-[72px] z-30 border-b border-line bg-ink/85 backdrop-blur-xl">
          <div className="mx-auto flex max-w-6xl justify-center gap-2 overflow-x-auto px-5 py-3">
            {categories.map((c) => (
              <a
                key={c}
                href={`#${encodeURIComponent(c)}`}
                className="shrink-0 rounded-full border border-line px-5 py-1.5 text-sm uppercase tracking-[0.2em] text-cream/80 transition hover:border-gold hover:text-gold-light"
              >
                {c}
              </a>
            ))}
          </div>
        </nav>
      )}

      <div className="mx-auto max-w-6xl space-y-24 px-5 py-24">
        {items.length === 0 && <p className="text-center text-muted">Our menu is being updated. Please call us for today’s dishes.</p>}
        {categories.map((cat) => (
          <section key={cat} id={encodeURIComponent(cat)} className="scroll-mt-36" aria-labelledby={`h-${encodeURIComponent(cat)}`}>
            <Reveal className="mb-12 flex items-center gap-6">
              <h2 id={`h-${encodeURIComponent(cat)}`} className="gold-text font-serif text-4xl font-bold italic sm:text-5xl">
                {cat}
              </h2>
              <span className="hairline flex-1" aria-hidden />
            </Reveal>
            <ul className="grid gap-6 lg:grid-cols-2">
              {items
                .filter((i) => i.category === cat)
                .map((i, idx) => (
                  <Reveal as="li" key={i.id} delay={(idx % 2) * 0.1}>
                    <article className="card-lux group flex h-full items-center gap-5 rounded-3xl p-4 sm:gap-6">
                      <div className="h-28 w-28 shrink-0 overflow-hidden rounded-2xl sm:h-32 sm:w-32">
                        <DishImage dish={i} compact className="transition duration-[1.2s] group-hover:scale-110" />
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col gap-2 pr-2">
                        <div className="flex items-baseline gap-3">
                          <h3 className="font-serif text-xl font-bold text-cream transition-colors duration-500 group-hover:text-gold-light">{i.name}</h3>
                          <span className="mb-1.5 flex-1 border-b border-dotted border-gold/25" aria-hidden />
                          <span className="shrink-0 font-serif text-lg font-semibold text-gold">{formatPrice(i.priceCents)}</span>
                        </div>
                        {i.description && <p className="leading-relaxed text-muted">{i.description}</p>}
                      </div>
                    </article>
                  </Reveal>
                ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
