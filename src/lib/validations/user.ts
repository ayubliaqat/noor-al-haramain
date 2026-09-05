import { z } from "zod";

export const userRoles = ["admin", "editor", "author"] as const;
const roleEnum = z.enum(userRoles);

// ── Shared field rules ─────────────────────────────
const nameField = z
  .string()
  .trim()
  .min(2, "Name must be at least 2 characters")
  .max(100, "Name must be under 100 characters");

const emailField = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address");

// 8+ chars, at least 1 letter + 1 number (bcrypt caps at 72 bytes)
const passwordField = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .max(72, "Password must be under 72 characters")
  .regex(/[A-Za-z]/, "Password must contain at least one letter")
  .regex(/[0-9]/, "Password must contain at least one number");

// ── CREATE ──────────────────────────────────────────
export const createUserSchema = z.object({
  name: nameField,
  email: emailField,
  password: passwordField,
  role: roleEnum,
});

export type CreateUserInput = z.infer<typeof createUserSchema>;

// ── EDIT — name + role only ─────────────────────────
export const editUserSchema = z.object({
  id: z.string().uuid("Invalid user id"),
  name: nameField,
  role: roleEnum,
});

export type EditUserInput = z.infer<typeof editUserSchema>;

// ── LOGIN ────────────────────────────────────────────
export const loginSchema = z.object({
  email: emailField,
  password: z.string().min(1, "Password is required"),
});

export type LoginInput = z.infer<typeof loginSchema>;