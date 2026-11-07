import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import Markdown from "react-markdown";
import { getPostBySlug, getPublishedPosts, getSettings } from "@/lib/data";
import { formatDate } from "@/lib/format";
import { abs, breadcrumbJsonLd, BUSINESS_NAME_PLAIN } from "@/lib/seo";
import { Eyebrow, Ornament } from "@/components/site/Section";
import { GoldDust } from "@/components/site/Motion";
import { JsonLd } from "@/components/site/JsonLd";

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  // At least one entry is needed for prerendering; an unknown slug simply renders "not found".
  return posts.length ? posts.map((p) => ({ slug: p.slug })) : [{ slug: "welcome-to-our-kitchen" }];
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.publishedAt?.toISOString(),
      images: [post.coverUrl || "/brand/logo-primary-gold.png"],
    },
  };
}

export default function PostPage({ params }: PageProps<"/blog/[slug]">) {
  return (
    <Suspense fallback={<div className="mx-auto max-w-3xl px-5 pb-24 pt-44 text-muted">Loading…</div>}>
      <Post params={params} />
    </Suspense>
  );
}

async function Post({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [post, s] = await Promise.all([getPostBySlug(slug), getSettings()]);
  if (!post) notFound();

  return (
    <article>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.excerpt || undefined,
          image: abs(post.coverUrl || "/brand/logo-primary-gold.png"),
          datePublished: post.publishedAt?.toISOString(),
          dateModified: post.updatedAt.toISOString(),
          mainEntityOfPage: abs(`/blog/${post.slug}`),
          author: s.owner.name ? { "@type": "Person", name: s.owner.name } : { "@type": "Organization", name: BUSINESS_NAME_PLAIN },
          publisher: { "@id": abs("/#restaurant") },
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />

      <header className="lux-bg relative overflow-hidden border-b border-line">
        <GoldDust density={0.4} />
        <div className="relative mx-auto max-w-3xl space-y-6 px-5 pb-16 pt-40 text-center">
          <Link href="/blog" className="rise inline-block text-sm text-gold hover:underline">
            ← All posts
          </Link>
          <div className="rise" style={{ ["--d" as string]: "0.1s" }}>
            <Eyebrow center>{formatDate(post.publishedAt)}</Eyebrow>
          </div>
          <h1 className="rise font-serif text-4xl font-bold leading-tight sm:text-6xl" style={{ ["--d" as string]: "0.2s" }}>
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="rise text-lg text-muted" style={{ ["--d" as string]: "0.35s" }}>
              {post.excerpt}
            </p>
          )}
          {s.owner.name && (
            <p className="rise text-sm text-gold-light" style={{ ["--d" as string]: "0.45s" }}>
              By {s.owner.name}
            </p>
          )}
        </div>
      </header>
      {post.coverUrl && (
        <div className="mx-auto max-w-4xl px-5 pt-12">
          <img src={post.coverUrl} alt="" className="w-full rounded-3xl border border-gold/20" />
        </div>
      )}
      <div className="prose-gold mx-auto max-w-3xl px-5 py-16 text-cream/90">
        <Markdown>{post.content}</Markdown>
      </div>
      <div className="pb-24 text-center">
        <Ornament wide />
      </div>
    </article>
  );
}
