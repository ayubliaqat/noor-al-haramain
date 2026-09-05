"use server"
import { eq, and, desc } from "drizzle-orm";
import { db } from "@/db";
import { posts, categories } from "@/db/schema";

// Public queries only ever return status = "published" posts.
// Drafts/scheduled posts must never leak to the public site.

export async function getFeaturedPost() {
  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      heroImage: posts.heroImage,
      heroImageAlt: posts.heroImageAlt,
      readTimeMinutes: posts.readTimeMinutes,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.status, "published"), eq(posts.featured, true)))
    .orderBy(desc(posts.publishedAt))
    .limit(1);

  return post ?? null;
}

// ─────────────────────────────────────────────
// ALL PUBLISHED POSTS (for /blog listing page)
// ─────────────────────────────────────────────
export async function getPublishedPosts() {
  return db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      heroImage: posts.heroImage,
      heroImageAlt: posts.heroImageAlt,
      readTimeMinutes: posts.readTimeMinutes,
      publishedAt: posts.publishedAt,
      featured: posts.featured,
      categoryName: categories.name,
      categorySlug: categories.slug,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.status, "published"))
    .orderBy(desc(posts.publishedAt));
}

// ─────────────────────────────────────────────
// SINGLE POST BY SLUG (for /blog/[slug] page)
// ─────────────────────────────────────────────
export async function getPostBySlug(slug: string) {
  const [post] = await db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      excerpt: posts.excerpt,
      content: posts.content,
      heroImage: posts.heroImage,
      heroImageAlt: posts.heroImageAlt,
      readTimeMinutes: posts.readTimeMinutes,
      publishedAt: posts.publishedAt,
      categoryName: categories.name,
      categorySlug: categories.slug,
      // SEO fields
      metaTitle: posts.metaTitle,
      metaDescription: posts.metaDescription,
      canonicalUrl: posts.canonicalUrl,
      ogImage: posts.ogImage,
      ogTitle: posts.ogTitle,
      ogDescription: posts.ogDescription,
      twitterTitle: posts.twitterTitle,
      twitterDescription: posts.twitterDescription,
      twitterImage: posts.twitterImage,
      noIndex: posts.noIndex,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(and(eq(posts.slug, slug), eq(posts.status, "published")))
    .limit(1);

  return post ?? null;
}