"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { categories } from "@/db/schema";
import { auth } from "@/lib/auth";
import {
  createCategorySchema,
  editCategorySchema,
  slugify,
} from "@/lib/validations/category";

type ActionResult =
  | { success: true; message: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

// Admin: full control. Editor: create/edit only. Author: read-only (checked in UI).
async function requireCategoryManager() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || (role !== "admin" && role !== "editor")) {
    return null;
  }
  return session;
}

async function requireAdmin() {
  const session = await auth();
  const role = (session?.user as { role?: string } | undefined)?.role;

  if (!session?.user || role !== "admin") {
    return null;
  }
  return session;
}

// ─────────────────────────────────────────────
// CREATE
// ─────────────────────────────────────────────
export async function createCategory(
  input: unknown
): Promise<ActionResult> {
  const session = await requireCategoryManager();
  if (!session) {
    return { success: false, message: "You don't have permission to do this." };
  }

  const parsed = createCategorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, description } = parsed.data;
  const slug = parsed.data.slug?.length ? parsed.data.slug : slugify(name);

  const existing = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: "A category with this slug already exists.",
      fieldErrors: { slug: ["This slug is already in use."] },
    };
  }

  await db.insert(categories).values({
    name,
    slug,
    description: description || null,
  });

  revalidatePath("/admin/categories");
  return { success: true, message: "Category created." };
}

// ─────────────────────────────────────────────
// UPDATE
// ─────────────────────────────────────────────
export async function updateCategory(
  input: unknown
): Promise<ActionResult> {
  const session = await requireCategoryManager();
  if (!session) {
    return { success: false, message: "You don't have permission to do this." };
  }

  const parsed = editCategorySchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, name, slug, description } = parsed.data;

  const conflict = await db
    .select()
    .from(categories)
    .where(eq(categories.slug, slug))
    .limit(1);

  if (conflict.length > 0 && conflict[0].id !== id) {
    return {
      success: false,
      message: "A category with this slug already exists.",
      fieldErrors: { slug: ["This slug is already in use."] },
    };
  }

  await db
    .update(categories)
    .set({ name, slug, description: description || null })
    .where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  return { success: true, message: "Category updated." };
}

// ─────────────────────────────────────────────
// DELETE — admin only
// ─────────────────────────────────────────────
export async function deleteCategory(id: string): Promise<ActionResult> {
  const session = await requireAdmin();
  if (!session) {
    return { success: false, message: "Only admins can delete categories." };
  }

  await db.delete(categories).where(eq(categories.id, id));

  revalidatePath("/admin/categories");
  return { success: true, message: "Category deleted." };
}

// ─────────────────────────────────────────────
// READ — any authenticated dashboard user
// ─────────────────────────────────────────────
export async function getCategories() {
  return db.select().from(categories).orderBy(categories.name);
}