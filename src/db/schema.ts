// Drizzle schema for Noor Al Haramain
// Built step by step: users (auth) → categories → tags → posts → messages → newsletter

import {
  pgTable,
  text,
  timestamp,
  uuid,
  primaryKey,
  integer,
  boolean,
  pgEnum,
  index,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "next-auth/adapters";

// ─────────────────────────────────────────────
// ROLES
// ─────────────────────────────────────────────
export const roleEnum = pgEnum("role", ["admin", "editor", "author"]);

// ─────────────────────────────────────────────
// USERS (admin dashboard users, matches NextAuth adapter shape)
// ─────────────────────────────────────────────
export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(), // .unique() auto-creates an index
  emailVerified: timestamp("email_verified", { mode: "date" }),
  image: text("image"),
  password: text("password"), // hashed, only used for credentials login
  role: roleEnum("role").notNull().default("author"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// NEXTAUTH REQUIRED TABLES (OAuth support, sessions)
// ─────────────────────────────────────────────
export const accounts = pgTable(
  "accounts",
  {
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("provider_account_id").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    index("accounts_user_id_idx").on(account.userId),
  ]
);

export const sessions = pgTable(
  "sessions",
  {
    sessionToken: text("session_token").primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (table) => [index("sessions_user_id_idx").on(table.userId)]
);

export const verificationTokens = pgTable(
  "verification_tokens",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ─────────────────────────────────────────────
// PASSWORD RESET TOKENS ("Forgot password" flow)
// ─────────────────────────────────────────────
export const passwordResetTokens = pgTable(
  "password_reset_tokens",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(), // hashed before storing; .unique() auto-indexes
    expires: timestamp("expires", { mode: "date" }).notNull(),
    usedAt: timestamp("used_at", { mode: "date" }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [index("password_reset_tokens_user_id_idx").on(table.userId)]
);

// ─────────────────────────────────────────────
// CATEGORIES (Umrah Guide, Hajj Guide, Travel Tips, etc.)
// ─────────────────────────────────────────────
export const categories = pgTable("categories", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(), // .unique() auto-indexes — fast /category-slug lookups
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// TAGS (free-form labels, many-to-many with posts)
// ─────────────────────────────────────────────
export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─────────────────────────────────────────────
// POSTS
// ─────────────────────────────────────────────
export const postStatusEnum = pgEnum("post_status", [
  "draft",
  "published",
  "scheduled",
]);

export const posts = pgTable(
  "posts",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    // Core content
    title: text("title").notNull(),
    slug: text("slug").notNull().unique(), // .unique() auto-indexes — fast /blog/slug lookups
    excerpt: text("excerpt"),
    content: text("content").notNull(),
    heroImage: text("hero_image"), // Cloudinary URL
    heroImageAlt: text("hero_image_alt"),

    // Reading experience
    readTimeMinutes: integer("read_time_minutes"),
    featured: boolean("featured").notNull().default(false),

    // Publishing state
    status: postStatusEnum("status").notNull().default("draft"),
    publishedAt: timestamp("published_at", { mode: "date" }),

    // Relations
    categoryId: uuid("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    authorId: uuid("author_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),

    // ── SEO (Yoast-style) ──────────────────────
    metaTitle: text("meta_title"), // falls back to `title`, ~60 char recommended
    metaDescription: text("meta_description"), // falls back to `excerpt`, ~155 char recommended
    focusKeyword: text("focus_keyword"), // primary keyword this post targets
    canonicalUrl: text("canonical_url"), // for syndicated/duplicate content
    noIndex: boolean("no_index").notNull().default(false), // hide from search engines

    // ── Open Graph (Facebook/LinkedIn share cards) ──
    ogTitle: text("og_title"), // falls back to metaTitle -> title
    ogDescription: text("og_description"), // falls back to metaDescription -> excerpt
    ogImage: text("og_image"), // falls back to heroImage

    // ── Twitter/X Card ──
    twitterTitle: text("twitter_title"), // falls back to ogTitle -> metaTitle -> title
    twitterDescription: text("twitter_description"), // falls back to ogDescription -> ...
    twitterImage: text("twitter_image"), // falls back to ogImage -> heroImage

    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    // Single-column indexes for common filters/joins
    index("posts_status_idx").on(table.status),
    index("posts_category_id_idx").on(table.categoryId),
    index("posts_author_id_idx").on(table.authorId),
    index("posts_published_at_idx").on(table.publishedAt),
    index("posts_featured_idx").on(table.featured),
    // Composite index for the most common public query:
    // "published posts, newest first" — covers WHERE + ORDER BY in one index
    index("posts_status_published_at_idx").on(
      table.status,
      table.publishedAt
    ),
  ]
);

// ─────────────────────────────────────────────
// POST_TAGS (many-to-many junction)
// ─────────────────────────────────────────────
export const postTags = pgTable(
  "post_tags",
  {
    postId: uuid("post_id")
      .notNull()
      .references(() => posts.id, { onDelete: "cascade" }),
    tagId: uuid("tag_id")
      .notNull()
      .references(() => tags.id, { onDelete: "cascade" }),
  },
  (pt) => [
    primaryKey({ columns: [pt.postId, pt.tagId] }),
    // The composite PK above only optimizes lookups starting with postId.
    // This extra index makes "find all posts with tag X" fast too.
    index("post_tags_tag_id_idx").on(pt.tagId),
  ]
);

// ─────────────────────────────────────────────
// CONTACT MESSAGES (Inbox — from public contact form)
// ─────────────────────────────────────────────
export const contactMessages = pgTable(
  "contact_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    email: text("email").notNull(),
    subject: text("subject"),
    message: text("message").notNull(),
    isRead: boolean("is_read").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    // Speeds up the "unread messages" count/filter shown in the sidebar badge
    index("contact_messages_is_read_idx").on(table.isRead),
  ]
);

// ─────────────────────────────────────────────
// NEWSLETTER SUBSCRIBERS
// ─────────────────────────────────────────────
export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: text("email").notNull().unique(), // .unique() auto-indexes
  isActive: boolean("is_active").notNull().default(true),
  subscribedAt: timestamp("subscribed_at").defaultNow().notNull(),
});