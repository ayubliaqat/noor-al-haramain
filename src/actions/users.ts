"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import bcrypt from "bcryptjs";

import { getSessionWithRole } from "@/lib/session";
import {
  userRoles,
  createUserSchema,
  editUserSchema,
} from "@/lib/validations/user";

export type ActionResult =
  | { success: true; id?: string }
  | { success: false; message: string; fieldErrors?: Record<string, string[]> };

type Role = (typeof userRoles)[number];
const MANAGE_ROLES: Role[] = ["admin", "editor"];

function canManageUsers(role: string | undefined): role is Role {
  return !!role && MANAGE_ROLES.includes(role as Role);
}

function isAdmin(role: string | undefined): boolean {
  return role === "admin";
}

export async function getUsers() {
  const session = await getSessionWithRole();
  if (!session || !canManageUsers(session.role)) return [];

  return db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .orderBy(asc(users.createdAt));
}

export async function getUserById(id: string) {
  const session = await getSessionWithRole();
  if (!session || !canManageUsers(session.role)) return null;

  const [user] = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      role: users.role,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id))
    .limit(1);

  return user ?? null;
}

export async function createUser(input: unknown): Promise<ActionResult> {
  const session = await getSessionWithRole();
  if (!session || !canManageUsers(session.role)) {
    return { success: false, message: "You don't have permission to manage users." };
  }

  const parsed = createUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { name, email, password, role } = parsed.data;

  if (role === "admin" && !isAdmin(session.role)) {
    return {
      success: false,
      message: "Only administrators can create admin users.",
      fieldErrors: { role: ["Only administrators can assign the admin role."] },
    };
  }

  const existing = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    return {
      success: false,
      message: "A user with this email already exists.",
      fieldErrors: { email: ["Email already in use."] },
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const [created] = await db
      .insert(users)
      .values({ name, email, password: hashedPassword, role })
      .returning({ id: users.id });

    if (!created) {
      return { success: false, message: "Unable to create the user." };
    }

    return { success: true, id: created.id };
  } catch {
    return {
      success: false,
      message: "Unable to create the user. The email may already be in use.",
      fieldErrors: { email: ["Email may already be in use."] },
    };
  }
}

export async function editUser(input: unknown): Promise<ActionResult> {
  const session = await getSessionWithRole();
  if (!session || !canManageUsers(session.role)) {
    return { success: false, message: "You don't have permission to manage users." };
  }

  const parsed = editUserSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      message: "Please fix the errors below.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { id, name, role } = parsed.data;

  if (id === session.userId && role !== session.role) {
    return {
      success: false,
      message: "You can't change your own role.",
      fieldErrors: { role: ["You can't change your own role."] },
    };
  }

  if (role === "admin" && !isAdmin(session.role)) {
    return {
      success: false,
      message: "Only administrators can assign the admin role.",
      fieldErrors: { role: ["Only administrators can assign the admin role."] },
    };
  }

  const target = await getUserById(id);
  if (!target) {
    return { success: false, message: "User not found." };
  }

  if (target.role === "admin" && !isAdmin(session.role)) {
    return { success: false, message: "Only administrators can edit admin users." };
  }

  await db.update(users).set({ name, role }).where(eq(users.id, id));

  return { success: true, id };
}

export async function deleteUser(id: string): Promise<ActionResult> {
  const session = await getSessionWithRole();
  if (!session || !canManageUsers(session.role)) {
    return { success: false, message: "You don't have permission to manage users." };
  }

  if (id === session.userId) {
    return { success: false, message: "You can't delete your own account." };
  }

  const target = await getUserById(id);
  if (!target) {
    return { success: false, message: "User not found." };
  }

  if (target.role === "admin" && !isAdmin(session.role)) {
    return { success: false, message: "Only administrators can delete admin users." };
  }

  if (target.role === "admin") {
    const admins = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.role, "admin"));

    if (admins.length <= 1) {
      return { success: false, message: "You can't delete the last remaining admin." };
    }
  }

  await db.delete(users).where(eq(users.id, id));

  return { success: true, id };
}