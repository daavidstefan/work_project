import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { pg } from "@@/lib/db";

export const authOptions: NextAuthOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ account, profile }) {
      // Extragem câmpurile utile din Keycloak
      const id = account?.providerAccountId ?? (profile as any)?.sub; // ID stabil (sub)
      const email = (profile as any)?.email ?? null;
      const username =
        (profile as any)?.preferred_username ??
        (profile as any)?.username ??
        null;
      const name =
        (profile as any)?.name ??
        (`${(profile as any)?.given_name ?? ""} ${
          (profile as any)?.family_name ?? ""
        }`.trim() ||
          null);

      if (!id) return false; // fără id nu salvăm

      // Upsert în users (creează dacă nu există, actualizează dacă s-au schimbat datele)
      await pg.query(
        `INSERT INTO users (id, email, username, name)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (id) DO UPDATE
           SET email = EXCLUDED.email,
               username = EXCLUDED.username,
               name = EXCLUDED.name`,
        [id, email, username, name]
      );

      return true;
    },

    async jwt({ token, account, profile }) {
      // pune în token ce vrei să ai ulterior în sesiune
      if (account && profile) {
        token.sub = account.providerAccountId ?? token.sub;
        (token as any).username =
          (profile as any).preferred_username ??
          (profile as any).username ??
          (token as any).username;
      }
      return token;
    },

    async session({ session, token }) {
      // expune id/username în session
      (session.user as any).id = token.sub;
      (session.user as any).username = (token as any).username ?? null;
      return session;
    },
  },
};
