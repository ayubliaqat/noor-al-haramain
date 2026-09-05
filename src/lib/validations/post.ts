import { z } from "zod";

export const postStatuses = ["draft", "published", "scheduled"] as const;

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

// ─────────────────────────────────────────────
// SHARED FIELD DEFINITIONS
// ─────────────────────────────────────────────
const baseFields = {
  title: z
    .string()
    .trim()
    .min(3, "Title must be at least 3 characters")
    .max(200, "Title is too long"),

  slug: z
    .string()
    .trim()
    .min(3, "Slug must be at least 3 characters")
    .max(220, "Slug is too long")
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug can only contain lowercase letters, numbers, and hyphens"
    )
    .optional(), // auto-derived from title if left blank

  excerpt: z
    .string()
    .trim()
    .max(300, "Excerpt is too long (max 300 characters)")
    .optional()
    .or(z.literal("")),

  content: z.string().trim().min(50, "Content must be at least 50 characters"),

  heroImage: z.url("Must be a valid URL").optional().or(z.literal("")),
  heroImageAlt: z
    .string()
    .trim()
    .max(150, "Alt text is too long")
    .optional()
    .or(z.literal("")),

  readTimeMinutes: z
    .number()
    .int()
    .min(1, "Must be at least 1 minute")
    .max(180, "That seems too long — double check")
    .optional(),

  featured: z.boolean().default(false),

  status: z.enum(postStatuses, { error: "Select a valid status" }),

  // Required only when status is "scheduled" — enforced via .refine below.
  publishedAt: z.iso.datetime({ offset: true }).optional().or(z.literal("")),

  categoryId: z.uuid("Select a category"),
  tagIds: z.array(z.uuid()).optional().default([]),

  // ── SEO ──────────────────────
  metaTitle: z
    .string()
    .trim()
    .max(70, "Meta title should be under 70 characters for best SEO")
    .optional()
    .or(z.literal("")),
  metaDescription: z
    .string()
    .trim()
    .max(160, "Meta description should be under 160 characters for best SEO")
    .optional()
    .or(z.literal("")),
  focusKeyword: z
    .string()
    .trim()
    .max(80, "Focus keyword is too long")
    .optional()
    .or(z.literal("")),
  canonicalUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  ogImage: z.url("Must be a valid URL").optional().or(z.literal("")),
  noIndex: z.boolean().default(false),

  // ── Open Graph ──────────────
  ogTitle: z
    .string()
    .trim()
    .max(70, "OG title should be under 70 characters")
    .optional()
    .or(z.literal("")),
  ogDescription: z
    .string()
    .trim()
    .max(200, "OG description should be under 200 characters")
    .optional()
    .or(z.literal("")),

  // ── Twitter/X Card ──────────
  twitterTitle: z
    .string()
    .trim()
    .max(70, "Twitter title should be under 70 characters")
    .optional()
    .or(z.literal("")),
  twitterDescription: z
    .string()
    .trim()
    .max(200, "Twitter description should be under 200 characters")
    .optional()
    .or(z.literal("")),
  twitterImage: z.url("Must be a valid URL").optional().or(z.literal("")),
};

// ─────────────────────────────────────────────
// CREATE POST
// ─────────────────────────────────────────────
export const createPostSchema = z
  .object(baseFields)
  .refine(
    (data) => data.status !== "scheduled" || !!data.publishedAt,
    {
      message: "A publish date is required when status is Scheduled",
      path: ["publishedAt"],
    }
  );

export type CreatePostInput = z.infer<typeof createPostSchema>;

// ─────────────────────────────────────────────
// EDIT POST
// ─────────────────────────────────────────────
export const editPostSchema = z
  .object({
    id: z.uuid("Invalid post id"),
    ...baseFields,
  })
  .refine(
    (data) => data.status !== "scheduled" || !!data.publishedAt,
    {
      message: "A publish date is required when status is Scheduled",
      path: ["publishedAt"],
    }
  );

export type EditPostInput = z.infer<typeof editPostSchema>;

export { slugify };