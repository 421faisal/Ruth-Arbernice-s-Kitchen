import type { Metadata } from "next";
import Link from "next/link";
import Markdown from "react-markdown";
import { getSettings, locationLabel } from "@/lib/data";
import { telHref } from "@/lib/format";
import { abs, breadcrumbJsonLd } from "@/lib/seo";
import { Eyebrow, Ornament, PageHero, SectionTitle } from "@/components/site/Section";
import { Reveal } from "@/components/site/Motion";
import { SocialButtons } from "@/components/site/Social";
import { JsonLd } from "@/components/site/JsonLd";
import { OrderButtons } from "@/components/site/OrderButtons";
import { FamilySlideshow, FamilyWall } from "@/components/site/Family";
import { FAMILY_PHOTOS, SLIDESHOW } from "@/lib/family";

export const metadata: Metadata = {
  title: "Our Story · Meet the Owner",
  description:
    "Meet the mom behind Ruth ’N’ Arbernise’s Kitchen, a family-owned Southern kitchen in North Carolina named for Grandmothers Ruth and Arbernise. A single mom of five, cooking since she was 17.",
  alternates: { canonical: "/story" },
};

const meaning = [
  { icon: "♥ ♥", title: "The two hearts", body: "Above Mom are two hearts: one for Grandmother Ruth and one for Grandmother Arbernise. Their names are on everything we cook." },
  { icon: "6", title: "Mom & her five children", body: "Mom and her five children, hand in hand, from the tallest to the littlest. They’re her reason for everything, and the family this kitchen is named for." },
  { icon: "✦", title: "The wooden spoon", body: "We stand together on the family wooden spoon, because everything we do starts in the kitchen." },
  { icon: "⟡", title: "The roots", body: "Each of us has roots underneath. Our roots are in Illinois, and now we cook for North Carolina." },
];

export default async function StoryPage() {
  const s = await getSettings();
  const o = s.owner;
  const where = locationLabel(s);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Our Story", path: "/story" }])} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "Our Story",
          url: abs("/story"),
          about: { "@id": abs("/#restaurant") },
          ...(o.name
            ? {
                mainEntity: {
                  "@type": "Person",
                  name: o.name,
                  jobTitle: o.title || "Owner",
                  image: o.photoUrl ? abs(o.photoUrl) : undefined,
                  worksFor: { "@id": abs("/#restaurant") },
                },
              }
            : {}),
        }}
      />

      <PageHero image="/images/whole-roast-chicken-with-green-beans.webp" eyebrow="Our story" title={<>A kitchen named for <span className="gold-text italic">two grandmothers</span></>}>
        Owned &amp; run by a single mom of five in {where}. Cooking since 17. Rooted in Illinois.
      </PageHero>

      {/* ============================ MEET THE OWNER */}
      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute right-0 top-20 h-[460px] w-[460px] rounded-full bg-gold/10 blur-[120px]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl gap-16 px-5 lg:grid-cols-[0.85fr_1.15fr]">
          <Reveal variant="zoom" className="lg:sticky lg:top-28 lg:self-start">
            <figure className="mx-auto max-w-sm">
              <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/35 p-3">
                <div className="h-full w-full overflow-hidden rounded-t-full border border-gold/15 bg-[radial-gradient(circle_at_50%_35%,#2a2214,#0b0a07_70%)]">
                  {o.photoUrl ? (
                    <img src={o.photoUrl} alt={o.name ? `${o.name}, ${o.title}` : "The owner of Ruth ’N’ Arbernise’s Kitchen"} className="h-full w-full object-cover" />
                  ) : (
                    <FamilySlideshow photos={SLIDESHOW} />
                  )}
                </div>
              </div>
              <figcaption className="mt-8 text-center">
                {o.name && <p className="gold-text font-script text-5xl">{o.name}</p>}
                {o.title && <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.35em] text-gold">{o.title}</p>}
                <div className="mt-6 flex justify-center">
                  <SocialButtons social={s.social} />
                </div>
              </figcaption>
            </figure>
          </Reveal>

          <div className="space-y-10">
            <Reveal>
              <Eyebrow>Meet the owner</Eyebrow>
              <h2 className="mt-5 font-serif text-4xl font-bold leading-tight text-cream sm:text-5xl">
                {o.name ? (
                  <>
                    Hi, I’m <span className="gold-text italic">{o.name.split(" ")[0]}</span>.
                  </>
                ) : (
                  <>
                    From our family <span className="gold-text italic">to yours</span>.
                  </>
                )}
              </h2>
            </Reveal>
            {o.quote && (
              <Reveal delay={0.1}>
                <blockquote className="relative rounded-3xl border border-gold/25 bg-[linear-gradient(180deg,#15110b,#0b0a07)] p-8 font-serif text-2xl italic leading-snug text-cream sm:text-3xl">
                  <span className="gold-text absolute -top-7 left-6 font-serif text-8xl leading-none not-italic" aria-hidden>
                    “
                  </span>
                  {o.quote}
                </blockquote>
              </Reveal>
            )}
            <Reveal delay={0.2}>
              <div className="prose-gold text-cream/85 [&>p:first-child]:text-xl [&>p:first-child]:text-cream">
                <Markdown>{o.story}</Markdown>
              </div>
            </Reveal>
            <Reveal delay={0.3} className="flex flex-wrap gap-4 pt-2">
              {s.phone && (
                <a href={telHref(s.phone)} className="btn-gold px-7 py-3.5">
                  Call to order · {s.phone}
                </a>
              )}
              <Link href="/menu" className="btn-ghost px-7 py-3.5">
                See the menu
              </Link>
              <OrderButtons s={s} />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================ MY WHY: FAMILY WALL */}
      <section className="relative overflow-hidden border-t border-line bg-[#0b0a07] py-28">
        <div className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gold/10 blur-[130px]" aria-hidden />
        <div className="relative mx-auto max-w-6xl px-5">
          <SectionTitle center eyebrow="My why" title={<>The reason behind <span className="gold-text italic">every plate</span></>}>
            Five children, two jobs and one dream. Every meal I cook is for them, and for the grandmothers who taught me.
          </SectionTitle>
          <div className="mt-16">
            <FamilyWall photos={FAMILY_PHOTOS} />
          </div>
        </div>
      </section>

      {/* ============================ LOGO MEANING */}
      <section className="border-t border-line bg-[#0b0a07] py-28">
        <div className="mx-auto max-w-6xl px-5">
          <div className="grid items-center gap-14 lg:grid-cols-2">
            <div className="space-y-8">
              <SectionTitle eyebrow="Our logo" title={<>Every detail <span className="gold-text italic">means something</span></>}>
                Our logo tells our family’s story, from the two grandmothers who inspired it to the littlest one holding Mom’s hand.
              </SectionTitle>
              <Reveal variant="zoom" delay={0.1}>
                <img src="/brand/logo-primary-gold.png" alt="Ruth ’N’ Arbernise’s Kitchen logo, family owned and operated, rooted in Illinois" className="mx-auto w-full max-w-sm" loading="lazy" />
              </Reveal>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              {meaning.map((m, i) => (
                <Reveal key={m.title} delay={i * 0.1} className="h-full">
                  <div className="card-lux h-full rounded-3xl p-7">
                    <span className="gold-text font-serif text-3xl font-bold">{m.icon}</span>
                    <h3 className="mt-4 font-serif text-xl font-bold text-cream">{m.title}</h3>
                    <p className="mt-3 leading-relaxed text-muted">{m.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
          <Reveal className="mt-20 text-center">
            <Ornament wide />
          </Reveal>
        </div>
      </section>
    </>
  );
}
