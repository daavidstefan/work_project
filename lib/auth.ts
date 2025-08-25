// gestioneaza autentificarea cu keycloak si setarile nextauth

import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { pg } from "@@/lib/db";
import { jwtDecode } from "jwt-decode";

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
      // extrage campuri din keycloak
      const id = account?.providerAccountId ?? (profile as any)?.sub; // sub
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

      if (!id) return false;

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
      // console.log("jwt callback", token, account, profile);
      // pune sub in token
      if (account && profile) {
        const decoded = jwtDecode(account.access_token!);
        token.sub = account.providerAccountId ?? token.sub;
        token.id_token = account.id_token;
        // @ts-ignore
        token.role = decoded.resource_access[`stefan`]?.roles ?? []; // rolul ( daca exista roles bn, daca nu -> callback)

        (token as any).username =
          (profile as any).preferred_username ??
          (profile as any).username ??
          (token as any).username;
      }
      return token;
    },

    async session({ session, token }) {
      // expune id/username/rol in sesiune
      (session.user as any).id = token.sub;
      (session.user as any).role = token.role;
      (session as any).id_token = token.id_token;
      (session as any).username = (token as any).username ?? null;
      return session;
    },
  },
};
