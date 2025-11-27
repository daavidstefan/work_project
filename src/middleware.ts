// middleware pentru redirecturi si protectie

import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: [
    // protejeaza tot ce NU e /, /login, api/auth și static
    "/((?!$|login|devregister|api/auth|verifyrequest|api/dev-requests|api/verify-request|_next/static|_next/image|favicon.ico|assets|.*\\..*).+)",
  ],
};
