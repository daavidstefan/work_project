// gestioneaza autentificarea cu keycloak si setarile nextauth

import { NextAuthOptions } from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";
import { pg } from "@@/lib/db";
import { jwtDecode } from "jwt-decode";
import { JwtPayload } from "jwt-decode";

interface KeycloakJwtPayload extends JwtPayload {
  realm_access?: {
    roles: string[];
  };
  // Poți adăuga și alte câmpuri pe care le aștepți, ex:
  preferred_username?: string;
  // ... etc
}

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
      const first_name = (profile as any)?.given_name ?? null;
      const last_name = (profile as any)?.family_name ?? null;

      if (!id) return false;

      // MODIFICAT: Actualizeaza interogarea SQL pentru a folosi noile coloane
      await pg.query(
        `INSERT INTO users (id, email, username, first_name, last_name)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (id) DO UPDATE
         SET email = EXCLUDED.email,
         username = EXCLUDED.username,
         first_name = EXCLUDED.first_name,
         last_name = EXCLUDED.last_name`,
        [id, email, username, first_name, last_name] // MODIFICAT: Trimite noii parametri
      );

      return true;
    },

    async jwt({ token, account, profile }) {
      console.log("----------------------------------------------");
      console.log("jwt callback", token, account, profile);
      console.log("----------------------------------------------"); // pune sub in token
      if (account && profile) {
        const decoded = jwtDecode<KeycloakJwtPayload>(account.access_token!);
        token.sub = account.providerAccountId ?? token.sub;
        token.id_token = account.id_token ?? "";
        token.role = decoded.realm_access?.roles ?? []; // rolul ( daca exista roles bn, daca nu -> callback)

        (token as any).username =
          (profile as any).preferred_username ??
          (profile as any).username ??
          (token as any).username;
      }
      return token;
    },

    async session({ session, token }) {
      // expune id/username/rol in sesiune
      //console.log("----------------------------------------------");
      //console.log(token);
      (session.user as any).id = token.sub ?? "";
      (session.user as any).role = token.role;
      (session as any).id_token = token.id_token ?? null;
      (session as any).username = (token as any).username ?? null;
      return session;
    },
  },
};
