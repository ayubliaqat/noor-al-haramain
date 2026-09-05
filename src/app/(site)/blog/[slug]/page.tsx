import { notFound } from "next/navigation";
import Image from "next/image";
import { Calendar, Clock } from "lucide-react";
import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/queries/posts";

function formatDate(date: Date | null) {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return { title: "Post Not Found — Noor Al Haramain" };
  }

  // Fallback chains, matching Yoast's behavior:
  // OG falls back to meta -> title/excerpt. Twitter falls back to OG -> meta -> title/excerpt.
  const title = post.metaTitle || post.title;
  const description = post.metaDescription || post.excerpt || undefined;

  const ogTitle = post.ogTitle || title;
  const ogDescription = post.ogDescription || description;
  const ogImage = post.ogImage || post.heroImage || undefined;

  const twitterTitle = post.twitterTitle || ogTitle;
  const twitterDescription = post.twitterDescription || ogDescription;
  const twitterImage = post.twitterImage || ogImage;

  return {
    title: `${title} — Noor Al Haramain`,
    description,
    alternates: post.canonicalUrl
      ? { canonical: post.canonicalUrl }
      : undefined,
    robots: post.noIndex ? { index: false, follow: false } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: ogImage ? [ogImage] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: twitterTitle,
      description: twitterDescription,
      images: twitterImage ? [twitterImage] : undefined,
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return (
    <article className="mx-auto max-w-3xl px-4 py-12">
      {post.categoryName && (
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald">
          {post.categoryName}
        </span>
      )}

      <h1 className="mt-2 text-3xl font-semibold leading-tight text-deep-teal sm:text-4xl">
        {post.title}
      </h1>

      <div className="mt-4 flex items-center gap-4 text-sm text-muted-teal">
        {post.publishedAt && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(post.publishedAt)}
          </span>
        )}
        {post.readTimeMinutes && (
          <span className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" />
            {post.readTimeMinutes} min read
          </span>
        )}
      </div>

      {post.heroImage && (
        <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-2xl">
          <Image
            src={post.heroImage}
            alt={post.heroImageAlt ?? post.title}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 768px, 100vw"
            priority
          />
        </div>
      )}

      {/* TODO: content is currently plain text — swap for a markdown/rich-text
          renderer once the post editor's content format is finalized. */}
      <div className="prose prose-neutral mt-8 max-w-none whitespace-pre-wrap text-charcoal">
        {post.content}
      </div>
    </article>
  );
}