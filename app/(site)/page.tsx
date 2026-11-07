import type { Metadata } from "next";
import Link from "next/link";
import { getFeaturedMenu, getMenu, getPublishedPosts, getSettings, locationLabel } from "@/lib/data";
import { formatDate, telHref } from "@/lib/format";
import { buildFaqs, faqJsonLd } from "@/lib/seo";
import { OpenStatus } from "@/components/site/OpenStatus";
import { HoursList } from "@/components/site/HoursList";
import { DishCard } from "@/components/site/DishCard";
import { Eyebrow, Ornament, PhotoBackdrop, SectionTitle } from "@/components/site/Section";
import { GoldDust, Reveal } from "@/components/site/Motion";
import { Faq } from "@/components/site/Faq";
import { Gallery } from "@/components/site/Gallery";
import { FamilySlideshow } from "@/components/site/Family";
import { SLIDESHOW } from "@/lib/family";
import { JsonLd } from "@/components/site/JsonLd";
import { OrderButtons } from "@/components/site/OrderButtons";
import { fulfillmentLabel, offersDelivery } from "@/lib/ordering";


export async function generateMetadata(): Promise<Metadata> {
  const s = await getSettings();
  const how = fulfillmentLabel(s); // e.g. "Pickup · Delivery on DoorDash & Uber Eats"
  return {
    title: { absolute: `Ruth ’N’ Arbernise’s Kitchen | Southern & Soul Food in North Carolina · ${offersDelivery(s) ? "Pickup & Delivery" : "Pickup"}` },
    description: `Family-owned Southern home cooking in North Carolina, rooted in Illinois. Fried chicken, baked chicken, Mississippi pot roast, collard greens and more. Every meal comes with cornbread. ${how}. Call ${s.phone}.`,
    alternates: { canonical: "/" },
  };
}

const d = (s: number) => ({ "--d": `${s}s` }) as React.CSSProperties;

export default async function HomePage() {
  const [s, featured, menu, posts] = await Promise.all([getSettings(), getFeaturedMenu(), getMenu(), getPublishedPosts(3)]);
  const tel = telHref(s.phone);
  const where = locationLabel(s);
  const faqs = buildFaqs(s, menu);
  const marquee = [...menu.map((m) => m.name), "Cornbread with every meal"];

  return (
    <>
      <JsonLd data={faqJsonLd(faqs)} />

      {/* ============================ HERO */}
      <section className="lux-bg relative flex min-h-[100svh] items-center overflow-hidden">
        <GoldDust />
        <div className="pointer-events-none absolute left-1/2 top-[38%] h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/15 blur-[120px] halo" aria-hidden />

        <div className="relative mx-auto w-full max-w-5xl px-5 pb-24 pt-36 text-center">
          <div className="rise mx-auto w-[min(420px,80vw)]" style={d(0.1)}>
            <img
              src="/brand/emblem-gold.png"
              alt="A mom and her five children holding hands on a golden wooden spoon, with two hearts for Grandmothers Ruth and Arbernise"
              className="float w-full drop-shadow-[0_20px_60px_rgba(212,175,55,0.35)]"
              fetchPriority="high"
            />
          </div>

          <div className="rise mt-8" style={d(0.35)}>
            <Eyebrow center>Family owned · {where}</Eyebrow>
          </div>

          <h1 className="mt-6">
            <span className="rise gold-text block font-script text-6xl leading-[1.05] sm:text-8xl md:text-[7.5rem]" style={d(0.5)}>
              Ruth ’N’ Arbernise’s
            </span>
            <span className="rise mt-3 flex items-center justify-center gap-5 font-serif text-2xl font-bold tracking-[0.55em] text-cream sm:text-4xl" style={d(0.65)}>
              <span className="hidden h-px w-16 bg-gradient-to-r from-transparent to-gold sm:block" aria-hidden />
              <span className="pl-[0.55em]">KITCHEN</span>
              <span className="hidden h-px w-16 bg-gradient-to-l from-transparent to-gold sm:block" aria-hidden />
            </span>
          </h1>

          <p className="rise mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-cream/80 sm:text-xl" style={d(0.8)}>
            Southern home cooking &amp; soul food from a single mom of five who’s been cooking since she was 17. Rooted in Illinois,
            cooking for North Carolina. <span className="text-gold-light">Every meal comes with cornbread.</span>
          </p>

          <div className="rise mt-10 flex flex-wrap items-center justify-center gap-4" style={d(0.95)}>
            {s.phone && (
              <a href={tel} className="btn-gold px-8 py-4 text-base">
                <PhoneIcon /> Call to order · {s.phone}
              </a>
            )}
            <Link href="/menu" className="btn-ghost px-8 py-4 text-base">
              Explore the menu
            </Link>
          </div>

          <div className="rise" style={d(1.02)}>
            <OrderButtons s={s} className="mt-5 justify-center" />
          </div>

          <div className="rise mt-8 flex flex-wrap items-center justify-center gap-3" style={d(1.1)}>
            <OpenStatus hours={s.hours} />
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 px-3.5 py-1 text-sm text-gold-light">
              {fulfillmentLabel(s)}
            </span>
          </div>
        </div>

        <a href="#favorites" className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-gold/70 sm:flex" aria-label="Scroll to family favorites">
          Scroll
          <span className="relative block h-10 w-px overflow-hidden bg-gold/15">
            <span className="scroll-cue absolute inset-x-0 top-0 h-full bg-gold" />
          </span>
        </a>
      </section>

      {/* ============================ MARQUEE */}
      <div className="marquee relative overflow-hidden border-y border-gold/20 bg-[#0c0a07] py-5" aria-label="Dishes we cook">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0c0a07] to-transparent" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0c0a07] to-transparent" aria-hidden />
        <div className="marquee-track">
          {[0, 1].map((copy) => (
            <ul key={copy} className="flex shrink-0 items-center" aria-hidden={copy === 1}>
              {marquee.map((name) => (
                <li key={`${copy}-${name}`} className="flex items-center whitespace-nowrap font-serif text-2xl italic text-gold-light/90 sm:text-3xl">
                  <span className="px-8">{name}</span>
                  <span className="text-sm text-gold not-italic" aria-hidden>✦</span>
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ============================ FAVORITES */}
      {featured.length > 0 && (
        <section id="favorites" className="relative scroll-mt-20 py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionTitle eyebrow="From our kitchen" title={<>Family <span className="gold-text italic">favorites</span></>}>
                The plates our neighbors come back for, cooked fresh with Grandma’s love.
              </SectionTitle>
              <Reveal delay={0.2}>
                <Link href="/menu" className="btn-ghost px-6 py-3 text-sm">
                  View full menu →
                </Link>
              </Reveal>
            </div>
            <div className={`mt-14 grid gap-7 sm:grid-cols-2 ${featured.length === 4 || featured.length === 2 ? "" : "lg:grid-cols-3"}`}>
              {featured.map((dish, i) => (
                <Reveal key={dish.id} delay={i * 0.12} className="h-full">
                  <DishCard dish={dish} />
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============================ GALLERY */}
      <section className="border-t border-line bg-[#0b0a07] py-28">
        <div className="mx-auto max-w-6xl px-5">
          <SectionTitle center eyebrow="A taste of home" title={<>Made with <span className="gold-text italic">love</span>, served with pride</>}>
            Southern comfort food the way Grandma made it: slow-cooked, generous and full of flavor.
          </SectionTitle>
          <div className="mt-14">
            <Gallery />
          </div>
        </div>
      </section>

      {/* ============================ STORY */}
      <section className="relative overflow-hidden border-y border-line bg-[#0b0a07] py-28">
        <div className="pointer-events-none absolute -left-40 top-1/2 h-[500px] w-[500px] -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" aria-hidden />
        <div className="relative mx-auto grid max-w-6xl items-center gap-16 px-5 md:grid-cols-2">
          <Reveal variant="zoom" className="relative mx-auto w-full max-w-md">
            <div className="relative aspect-[4/5] overflow-hidden rounded-t-full border border-gold/30 bg-[radial-gradient(circle_at_50%_35%,#2a2214,#0b0a07_70%)] p-3">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-t-full border border-gold/15">
                {s.owner.photoUrl ? (
                  <img src={s.owner.photoUrl} alt={s.owner.name ? `${s.owner.name}, owner of Ruth ’N’ Arbernise’s Kitchen` : "The owner of Ruth ’N’ Arbernise’s Kitchen"} className="h-full w-full object-cover" loading="lazy" />
                ) : (
                  <FamilySlideshow photos={SLIDESHOW} />
                )}
              </div>
            </div>
            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border border-gold/40 bg-ink px-6 py-2.5 font-script text-2xl text-gold shadow-xl">
              Ruth <span className="text-gold-light">♥</span> Arbernise
            </div>
          </Reveal>

          <div className="space-y-7">
            <SectionTitle eyebrow="Our story" title={<>Two grandmothers. <span className="gold-text italic">One family kitchen.</span></>} />
            {s.owner.quote && (
              <Reveal delay={0.15}>
                <blockquote className="border-l-2 border-gold pl-6 font-serif text-2xl italic leading-snug text-cream/90">“{s.owner.quote}”</blockquote>
              </Reveal>
            )}
            <Reveal delay={0.25}>
              <p className="text-lg leading-relaxed text-muted">
                Our kitchen carries the names of Grandmothers <strong className="font-semibold text-cream">Ruth</strong> and{" "}
                <strong className="font-semibold text-cream">Arbernise</strong>. It’s run by one hardworking single mom who learned by watching her grandma cook
                and sell dinners for the church. Her five children are her reason, and all six of them are in our logo, hand in hand.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <Link href="/story" className="btn-gold px-7 py-3.5">
                {s.owner.name ? `Meet ${s.owner.name}` : "Meet the owner"} →
              </Link>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============================ SIGNATURE */}
      <section className="lux-bg relative overflow-hidden py-36 text-center">
        <PhotoBackdrop src="/images/greens-cooking-over-open-fire.webp" strength="medium" />
        <GoldDust density={0.5} />
        <Reveal className="relative mx-auto max-w-4xl px-5">
          <Ornament wide />
          <p className="mt-10 font-serif text-3xl italic leading-tight text-cream sm:text-5xl">
            “Every plate carries <span className="gold-text not-italic font-script text-5xl sm:text-7xl">two names</span>, and every meal comes with cornbread.”
          </p>
          <p className="mt-8 text-[11px] uppercase tracking-[0.4em] text-gold">Ruth ’N’ Arbernise’s Kitchen</p>
        </Reveal>
      </section>

      {/* ============================ VISIT */}
      <section id="visit" className="scroll-mt-20 border-t border-line py-28">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 md:grid-cols-[1fr_1.05fr] md:items-center">
          <div className="space-y-8">
            <SectionTitle eyebrow="Hours & pickup" title={<>Call ahead. <span className="gold-text italic">We’ll have it ready.</span></>}>
              {s.orderNote || `${fulfillmentLabel(s)}.`}
            </SectionTitle>
            <Reveal delay={0.2} className="space-y-3">
              <p className="text-[11px] uppercase tracking-[0.35em] text-muted">Order by phone</p>
              {s.phone && (
                <a href={tel} className="gold-text block font-serif text-5xl font-bold sm:text-6xl">
                  {s.phone}
                </a>
              )}
              <p className="text-cream/80">
                {s.address ? `${s.address}, ` : ""}
                {where}
              </p>
            </Reveal>
            <Reveal delay={0.3}>
              <OrderButtons s={s} size="lg" />
            </Reveal>
          </div>
          <Reveal variant="zoom" delay={0.1}>
            <div className="card-lux rounded-3xl p-8 sm:p-10">
              <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                <h3 className="font-serif text-2xl font-bold text-gold-light">Store hours</h3>
                <OpenStatus hours={s.hours} />
              </div>
              <HoursList hours={s.hours} />
              <p className="mt-6 text-xs uppercase tracking-[0.25em] text-muted">Eastern time · {fulfillmentLabel(s)}</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================ FAQ (AEO) */}
      <section id="faq" className="scroll-mt-20 border-t border-line bg-[#0b0a07] py-28">
        <div className="mx-auto max-w-4xl px-5">
          <SectionTitle center eyebrow="Good to know" title={<>Questions, <span className="gold-text italic">answered</span></>} />
          <div className="mt-14">
            <Faq faqs={faqs} />
          </div>
        </div>
      </section>

      {/* ============================ BLOG */}
      {posts.length > 0 && (
        <section className="border-t border-line py-28">
          <div className="mx-auto max-w-6xl px-5">
            <div className="flex flex-wrap items-end justify-between gap-6">
              <SectionTitle eyebrow="From the blog" title={<>News from <span className="gold-text italic">our kitchen</span></>} />
              <Reveal delay={0.2}>
                <Link href="/blog" className="btn-ghost px-6 py-3 text-sm">
                  All posts →
                </Link>
              </Reveal>
            </div>
            <div className="mt-14 grid gap-7 md:grid-cols-3">
              {posts.map((p, i) => (
                <Reveal key={p.id} delay={i * 0.12} className="h-full">
                  <Link href={`/blog/${p.slug}`} className="card-lux group flex h-full flex-col rounded-3xl p-7">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-gold/80">{formatDate(p.publishedAt)}</p>
                    <h3 className="mt-4 font-serif text-2xl font-bold leading-snug text-cream transition-colors duration-500 group-hover:text-gold-light">{p.title}</h3>
                    {p.excerpt && <p className="mt-4 flex-1 leading-relaxed text-muted">{p.excerpt}</p>}
                    <span className="mt-6 text-sm font-semibold text-gold">Read the story →</span>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1.9.4 1.8.7 2.7a2 2 0 0 1-.5 2.1L8 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.7.7a2 2 0 0 1 1.7 2z" />
    </svg>
  );
}
