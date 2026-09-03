import type { NextAuthConfig } from "next-auth";

// Edge-compatible config: NO bcrypt, NO direct DB driver imports here.
// This file is safe to import inside middleware.ts (Vercel Edge Runtime).
// The Credentials provider itself (which DOES need bcrypt + DB) lives in auth.ts instead.
export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAdmin = nextUrl.pathname.startsWith("/admin");

      if (isOnAdmin) {
        // Not logged in → redirect to login
        return isLoggedIn;
      }

      if (isLoggedIn && nextUrl.pathname === "/login") {
        // Already logged in, trying to visit /login → send to dashboard
        return Response.redirect(new URL("/admin", nextUrl));
      }

      return true;
    },
    // Attach role + id to the session so pages/components can read it
    // without an extra DB query.
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as { role?: string }).role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        (session.user as { role?: string }).role = token.role as string;
      }
      return session;
    },
  },
  providers: [], // Credentials provider added in auth.ts (needs Node runtime)
} satisfies NextAuthConfig;