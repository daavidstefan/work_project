// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    // protejează tot ce NU e /, /login, api/auth și static
    "/((?!$|login|api/auth|_next/static|_next/image|favicon.ico|assets|.*\\..*).+)",
  ],
};
