import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import { readConfig } from "@/lib/config";
import { verifyAdminToken } from "@/lib/adminToken";
import { authConfig } from "@/auth.config";

const providers = [];

if (process.env.GITHUB_ID && process.env.GITHUB_SECRET) {
  providers.push(
    GitHub({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    })
  );
}

providers.push(
  Credentials({
    id: "admin-token",
    name: "Admin password",
    credentials: { token: { label: "Password", type: "password" } },
    async authorize(credentials) {
      const token = credentials?.token;
      if (typeof token !== "string" || !token) return null;
      const config = await readConfig();
      if (!verifyAdminToken(token, config.adminTokenHash)) return null;
      return { id: "admin", name: "Admin" };
    },
  })
);

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers,
  callbacks: {
    async signIn({ account, profile }) {
      if (account?.provider === "github") {
        const config = await readConfig();
        const login = (profile as { login?: string } | undefined)?.login;
        if (!login || !config.allowedGithubUsers.includes(login)) {
          return false;
        }
      }
      return true;
    },
  },
});
