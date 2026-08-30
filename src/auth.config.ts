import type { NextAuthConfig } from "next-auth";

// Edge-safe base config shared between middleware (which runs on the Edge
// runtime and can't touch the filesystem) and the full auth.ts config used
// by the API route handlers.
export const authConfig = {
  pages: { signIn: "/admin/login" },
  session: { strategy: "jwt" },
  providers: [],
} satisfies NextAuthConfig;
