import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

// Next.js 16 renamed "middleware.ts" -> "proxy.ts" and the exported
// function from "middleware" -> "proxy". Same behavior, new name.
export default NextAuth(authConfig).auth;

export const config = {
  // Runs on /admin/* (protected) and /login (so logged-in users get redirected away).
  // Everything else (public blog, API routes, static assets) is untouched.
  matcher: ["/admin/:path*", "/login"],
};