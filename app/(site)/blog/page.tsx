import type { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/Section";
import { Reveal } from "@/components/site/Motion";
import { JsonLd } from "@/components/site/JsonLd";

export const metadata: Metadata = {
  title: "Blog · News & Specials",
  description: "News, weekly specials and family stories from Ruth ’N’ Arbernise’s Kitchen, a family-owned Southern kitchen in North Carolina.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  return (
    <>
      <JsonLd data={breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Blog", path: "/blog" }])} />
      <PageHero image="/images/cornbread-slices.webp" eyebrow="Blog" title={<>News from <span className="gold-text italic">our kitchen</span></>}>
        Specials, family stories and what’s cooking this week.
      </PageHero>
      <div className="mx-auto max-w-5xl space-y-8 px-5 py-24">
        {posts.length === 0 && <p className="text-center text-muted">No posts yet. Check back soon!</p>}
        {posts.map((p, i) => (
          <Reveal key={p.id} delay={Math.min(i * 0.08, 0.3)}>
            <Link href={`/blog/${p.slug}`} className="card-lux group flex flex-col rounded-3xl sm:flex-row">
              <div className="relative aspect-video shrink-0 overflow-hidden sm:aspect-auto sm:w-72">
                {p.coverUrl ? (
                  <img src={p.coverUrl} alt="" className="h-full w-full object-cover transition duration-[1.2s] group-hover:scale-110" loading="lazy" />
                ) : (
                  <div className="flex h-full min-h-48 items-center justify-center bg-[radial-gradient(circle_at_50%_40%,#2a2214,#0b0a07_70%)]">
                    <img src="/brand/emblem-gold.png" alt="" className="w-3/5 opacity-60" />
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-center p-7 sm:p-9">
                <p className="text-[11px] uppercase tracking-[0.3em] text-gold/80">{formatDate(p.publishedAt)}</p>
                <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-cream transition-colors duration-500 group-hover:text-gold-light">{p.title}</h2>
                {p.excerpt && <p className="mt-4 leading-relaxed text-muted">{p.excerpt}</p>}
                <span className="mt-6 text-sm font-semibold text-gold">Read the story →</span>
              </div>
            </Link>
          </Reveal>
        ))}
      </div>
    </>
  );
}
