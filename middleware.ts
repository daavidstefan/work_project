// middleware.ts
import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: { authorized: ({ token }) => !!token },
});

export const config = {
  matcher: ["/((?!login|after-auth|api/auth|_next|favicon.ico).*)"],
};
