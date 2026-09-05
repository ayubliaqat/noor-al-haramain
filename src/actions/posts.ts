"use server";

import { revalidatePath } from "next/cache";
import { eq, and, ne, desc } from "drizzle-orm";

import { db } from "@/db";
import {
  posts,
  postTags,
  categories,
  users,
} from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  createPostSchema,
  editPostSchema,
  slugify,
} from "@/lib/validations/post";

type ActionResult =
  | {
      success: true;
      message: string;
      postId?: string;
    }
  | {
      success: false;
      message: string;
      fieldErrors?: Record<string, string[]>;
    };

async function getSessionWithRole() {
  const session = await auth();

  const role = (session?.user as { role?: string } | undefined)?.role;
  const userId = session?.user?.id;

  if (!session?.user || !userId) {
    return null;
  }

  return {
    userId,
    role: role ?? "author",
  };
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────

export async function createPost(
  input: unknown,
): Promise<ActionResult> {
  const session = await getSessionWithRole();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const parsed = createPostSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  const slug = data.slug?.length
    ? data.slug
    : slugify(data.title);

  // Authors can only create drafts.
  // They cannot publish or schedule directly.
  const status =
    session.role === "author"
      ? "draft"
      : data.status;

  const existing = await db
    .select()
    .from(posts)
    .where(eq(posts.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: "A post with this slug already exists.",
      fieldErrors: {
        slug: ["This slug is already in use."],
      },
    };
  }

  const [newPost] = await db
    .insert(posts)
    .values({
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
      heroImage: data.heroImage || null,
      heroImageAlt: data.heroImageAlt || null,
      readTimeMinutes: data.readTimeMinutes,
      featured: data.featured,
      status,

      publishedAt:
        status === "published"
          ? new Date()
          : data.publishedAt
            ? new Date(data.publishedAt)
            : null,

      categoryId: data.categoryId,

      // Always use the authenticated user.
      // Never trust authorId from client input.
      authorId: session.userId,

      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      focusKeyword: data.focusKeyword || null,
      canonicalUrl: data.canonicalUrl || null,
      ogImage: data.ogImage || null,
      noIndex: data.noIndex,
    })
    .returning({
      id: posts.id,
    });

  if (!newPost) {
    return {
      success: false,
      message: "Failed to create post.",
    };
  }

  if (data.tagIds.length > 0) {
    await db
      .insert(postTags)
      .values(
        data.tagIds.map((tagId) => ({
          postId: newPost.id,
          tagId,
        })),
      );
  }

  revalidatePath("/admin/posts");

  return {
    success: true,
    message: "Post created.",
    postId: newPost.id,
  };
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────

export async function updatePost(
  input: unknown,
): Promise<ActionResult> {
  const session = await getSessionWithRole();

  if (!session) {
    return {
      success: false,
      message: "You must be logged in.",
    };
  }

  const parsed = editPostSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const data = parsed.data;

  const [existingPost] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, data.id))
    .limit(1);

  if (!existingPost) {
    return {
      success: false,
      message: "Post not found.",
    };
  }

  // Authors can only edit their own posts.
  if (session.role === "author") {
    if (existingPost.authorId !== session.userId) {
      return {
        success: false,
        message: "You can only edit your own posts.",
      };
    }
  }

  // Authors can only save drafts.
  const status =
    session.role === "author"
      ? "draft"
      : data.status;

  const slug = data.slug?.length
    ? data.slug
    : slugify(data.title);

  const conflict = await db
    .select()
    .from(posts)
    .where(
      and(
        eq(posts.slug, slug),
        ne(posts.id, data.id),
      ),
    )
    .limit(1);

  if (conflict.length > 0) {
    return {
      success: false,
      message: "A post with this slug already exists.",
      fieldErrors: {
        slug: ["This slug is already in use."],
      },
    };
  }

  await db
    .update(posts)
    .set({
      title: data.title,
      slug,
      excerpt: data.excerpt || null,
      content: data.content,
      heroImage: data.heroImage || null,
      heroImageAlt: data.heroImageAlt || null,
      readTimeMinutes: data.readTimeMinutes,
      featured: data.featured,
      status,

      publishedAt:
        status === "published" &&
        !existingPost.publishedAt
          ? new Date()
          : data.publishedAt
            ? new Date(data.publishedAt)
            : existingPost.publishedAt,

      categoryId: data.categoryId,
      metaTitle: data.metaTitle || null,
      metaDescription: data.metaDescription || null,
      focusKeyword: data.focusKeyword || null,
      canonicalUrl: data.canonicalUrl || null,
      ogImage: data.ogImage || null,
      noIndex: data.noIndex,

      updatedAt: new Date(),
    })
    .where(eq(posts.id, data.id));

  // Replace tag associations.
  await db
    .delete(postTags)
    .where(eq(postTags.postId, data.id));

  if (data.tagIds.length > 0) {
    await db
      .insert(postTags)
      .values(
        data.tagIds.map((tagId) => ({
          postId: data.id,
          tagId,
        })),
      );
  }

  revalidatePath("/admin/posts");

  return {
    success: true,
    message: "Post updated.",
    postId: data.id,
  };
}

// ─────────────────────────────────────────────
// DELETE
// Admin & editor only.
// Authors cannot delete posts.
// ─────────────────────────────────────────────

export async function deletePost(
  id: string,
): Promise<ActionResult> {
  const session = await getSessionWithRole();

  if (
    !session ||
    (session.role !== "admin" &&
      session.role !== "editor")
  ) {
    return {
      success: false,
      message: "You don't have permission to delete posts.",
    };
  }

  const [existingPost] = await db
    .select({
      id: posts.id,
    })
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  if (!existingPost) {
    return {
      success: false,
      message: "Post not found.",
    };
  }

  await db
    .delete(posts)
    .where(eq(posts.id, id));

  revalidatePath("/admin/posts");

  return {
    success: true,
    message: "Post deleted.",
  };
}

// ─────────────────────────────────────────────
// GET ALL POSTS
// ─────────────────────────────────────────────

export async function getPosts() {
  const session = await getSessionWithRole();

  if (!session) {
    return [];
  }

  const query = db
    .select({
      id: posts.id,
      title: posts.title,
      slug: posts.slug,
      status: posts.status,
      featured: posts.featured,
      publishedAt: posts.publishedAt,
      createdAt: posts.createdAt,

      categoryId: posts.categoryId,
      categoryName: categories.name,

      authorId: posts.authorId,
      authorName: users.name,
    })
    .from(posts)
    .leftJoin(
      categories,
      eq(posts.categoryId, categories.id),
    )
    .leftJoin(
      users,
      eq(posts.authorId, users.id),
    )
    .orderBy(desc(posts.createdAt));

  if (session.role === "author") {
    return query.where(
      eq(posts.authorId, session.userId),
    );
  }

  return query;
}

// ─────────────────────────────────────────────
// GET SINGLE POST
// ─────────────────────────────────────────────

export async function getPostById(id: string) {
  const [post] = await db
    .select()
    .from(posts)
    .where(eq(posts.id, id))
    .limit(1);

  return post ?? null;
}
