"use server";

import { db } from "@/db";
import { contactMessages } from "@/db/schema";
import { eq, desc, count } from "drizzle-orm";
import { getSessionWithRole } from "@/lib/session";

export type ActionResult =
  | { success: true }
  | { success: false; message: string };

function canManageMessages(role: string | undefined): boolean {
  return role === "admin" || role === "editor";
}

export async function getMessages() {
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt));
}

export async function getUnreadMessageCount(): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(contactMessages)
    .where(eq(contactMessages.isRead, false));

  return row?.value ?? 0;
}

export async function markMessageAsRead(id: string): Promise<ActionResult> {
  const session = await getSessionWithRole();
  if (!session || !canManageMessages(session.role)) {
    return { success: false, message: "You don't have permission to do that." };
  }

  await db.update(contactMessages).set({ isRead: true }).where(eq(contactMessages.id, id));
  return { success: true };
}

export async function markMessageAsUnread(id: string): Promise<ActionResult> {
  const session = await getSessionWithRole();
  if (!session || !canManageMessages(session.role)) {
    return { success: false, message: "You don't have permission to do that." };
  }

  await db.update(contactMessages).set({ isRead: false }).where(eq(contactMessages.id, id));
  return { success: true };
}

export async function deleteMessage(id: string): Promise<ActionResult> {
  const session = await getSessionWithRole();
  if (!session || session.role !== "admin") {
    return { success: false, message: "Only admins can delete messages." };
  }

  await db.delete(contactMessages).where(eq(contactMessages.id, id));
  return { success: true };
}