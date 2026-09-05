"use server";

import { db } from "@/db";
import { tags, postTags } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export async function getTags() {
  return db.select({ id: tags.id, name: tags.name }).from(tags).orderBy(asc(tags.name));
}

// Returns just the tag IDs attached to a post — used to pre-fill the edit form,
// since getPostById() returns a plain posts row with no tag join.
export async function getPostTagIds(postId: string): Promise<string[]> {
  const rows = await db
    .select({ tagId: postTags.tagId })
    .from(postTags)
    .where(eq(postTags.postId, postId));

  return rows.map((r) => r.tagId);
}