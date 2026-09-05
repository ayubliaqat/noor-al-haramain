import { z } from "zod";

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─────────────────────────────────────────────
// CREATE CATEGORY
// ─────────────────────────────────────────────
export const createCategorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(),
    // If left blank, the server action derives one from `name` using slugify().
  description: z
    .string()
    .trim()
    .max(300, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;

// ─────────────────────────────────────────────
// EDIT CATEGORY
// ─────────────────────────────────────────────
export const editCategorySchema = z.object({
  id: z.uuid("Invalid category id"),
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    ),
  description: z
    .string()
    .trim()
    .max(300, "Description is too long")
    .optional()
    .or(z.literal("")),
});

export type EditCategoryInput = z.infer<typeof editCategorySchema>;

export { slugify };