// Drizzle schema for Noor Al Haramain
// Tables will be added here step by step (posts, categories, users, etc.)

import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Placeholder table so drizzle-kit has something to work with.
// We'll replace/expand this once we design the real schema.
export const posts = pgTable("posts", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});