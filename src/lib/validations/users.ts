import { z } from "zod";

export const USER_ROLES = ["admin", "editor", "author"] as const;

export const userRoleSchema = z.enum(USER_ROLES);

export const createUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or less."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long."),

  role: userRoleSchema,

  password: z
    .string()
    .min(8, "Password must be at least 8 characters.")
    .max(128, "Password must be 128 characters or less."),
});

export const updateUserSchema = z.object({
  id: z.string().uuid("Invalid user ID."),

  name: z
    .string()
    .trim()
    .min(1, "Name is required.")
    .max(100, "Name must be 100 characters or less."),

  email: z
    .string()
    .trim()
    .toLowerCase()
    .email("Enter a valid email address.")
    .max(254, "Email address is too long."),

  role: userRoleSchema,

  password: z
    .string()
    .max(128, "Password must be 128 characters or less.")
    .optional()
    .or(z.literal("")),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
