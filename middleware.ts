import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const PUBLIC_PATHS = [
  /^\/login$/, // pagina de login
  /^\/api\/auth(\/.*)?$/, // next-auth endpoints
  /^\/_next(\/.*)?$/, // assets Next
  /^\/favicon\.ico$/, // favicon
  /^\/assets(\/.*)?$/, // dacă ai assets proprii
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1) Lasă publicul să treacă
  if (PUBLIC_PATHS.some((re) => re.test(pathname))) {
    return NextResponse.next();
  }

  // 2) Ești logat?
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

  // 3) Nu e logat -> redirect la /login cu callbackUrl
  if (!token) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set(
      "callbackUrl",
      req.nextUrl.pathname + req.nextUrl.search
    );
    return NextResponse.redirect(loginUrl);
  }

  // 4) Logat -> continuă
  return NextResponse.next();
}

// (Optional) Matcher: rulează pe tot, mai puțin fișiere statice
export const config = {
  matcher: ["/((?!_next|.*\\..*|api/auth).*)"],
};
