import { config } from "dotenv";
config({ path: ".env.local" });

import { db } from "./index";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createUserSchema } from "../lib/validations/user";

// ─────────────────────────────────────────────
// Edit these values before running, then:
//   npx tsx src/db/seed.ts
// ─────────────────────────────────────────────
const FIRST_ADMIN = {
  name: "Ayub",
  email: "mayub7540@gmail.com",
  password: "Admin123",
  role: "admin" as const,
};

async function seed() {
  console.log("Seeding first admin user...");

  // Validate with the same Zod schema used everywhere else
  const parsed = createUserSchema.safeParse(FIRST_ADMIN);
  if (!parsed.success) {
    console.error("Validation failed:", parsed.error.flatten().fieldErrors);
    process.exit(1);
  }

  const { name, email, password, role } = parsed.data;

  // Don't create a duplicate if it already exists
  const existing = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existing.length > 0) {
    console.log(`User with email "${email}" already exists. Skipping.`);
    process.exit(0);
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const [newUser] = await db
    .insert(users)
    .values({
      name,
      email,
      password: hashedPassword,
      role,
    })
    .returning({ id: users.id, email: users.email, role: users.role });

  console.log("✅ Admin user created:", newUser);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});