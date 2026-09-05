// src/lib/session.ts
import { auth } from "@/lib/auth";

export async function getSessionWithRole() {
  const session = await auth();

  if (!session?.user) return null;

  return {
    userId: (session.user as { id?: string }).id ?? "",
    role: (session.user as { role?: string }).role ?? "author",
  };
}