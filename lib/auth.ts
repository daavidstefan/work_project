import KeycloakProvider from "next-auth/providers/keycloak";
import { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    // LOGIN normal
    KeycloakProvider({
      id: "keycloak",
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!, // ex: http://192.168.1.130:8080/realms/licence-server
      // poți păstra prompt=login dacă vrei
      authorization: { params: { prompt: "login" } },
    }),

    // REGISTER -> duce direct în formularul de înregistrare
    KeycloakProvider({
      id: "keycloak-register",
      clientId: process.env.KEYCLOAK_CLIENT_ID!,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!,
      authorization: {
        // IMPORTANT: endpoint-ul de REGISTRATIONS
        url: `${process.env
          .KEYCLOAK_ISSUER!}/protocol/openid-connect/registrations`,
        params: {
          response_type: "code",
          scope: "openid",
          // ajută la debug: lasă fără prompt dacă vrei
          // prompt: "login",
          // e ok să păstrezi și hint-ul, dar nu ne mai bazăm pe el
          screen_hint: "register",
        },
      },
    }),
  ],
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 3600 },
  // ...callbacks jwt/session pt. roluri (cum le-am setat anterior)
};
