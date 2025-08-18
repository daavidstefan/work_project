"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { User as UserIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavbarButton } from "./button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ConnectedSince } from "@/components/connected-since";
import { usePathname } from "next/navigation";

export default function NavigationBar() {
  const pathname = usePathname();
  if (pathname === "/login") return null;
  const { data: session, status } = useSession();
  const username = session?.user?.name;
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const NAVBAR_H = 56;

  // ensure client-only render to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // salveaza ora de login
  useEffect(() => {
    if (status === "authenticated" && !localStorage.getItem("loginAt")) {
      localStorage.setItem("loginAt", Date.now().toString());
    }
    if (status === "unauthenticated") {
      localStorage.removeItem("loginAt");
    }
  }, [status]);

  const handleLogout = async () => {
    const idToken = (session as any)?.idToken as string | undefined;
    try {
      // Logout din Keycloak (curăță sesiunea SSO)
      if (idToken && process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER) {
        const url =
          `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout` +
          `?id_token_hint=${encodeURIComponent(idToken)}` +
          `&post_logout_redirect_uri=${encodeURIComponent(
            `${window.location.origin}/login`
          )}`;
        await fetch(url, { credentials: "include" }).catch(() => {});
      }
      // Logout din NextAuth fără redirect imediat
      await signOut({ redirect: false });
    } finally {
      localStorage.removeItem("loginAt");
      // Șterge toate cookie‑urile de pe domeniul curent
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      // Redirecționează către pagina de login (care va duce la formularul Keycloak)
      window.location.href = "/login";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 w-full items-center px-4">
        <NavigationMenu className="justify-start">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/listofprojects" className="px-3 py-2">
                  Proiecte disponibile
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <div className="ml-auto flex items-center gap-2">
          <Sheet open={open} onOpenChange={setOpen}>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <SheetTrigger asChild>
                    <button
                      className="cursor-pointer p-2 rounded-md hover:bg-accent"
                      aria-label="Open menu"
                    >
                      <UserIcon className="size-5" />
                    </button>
                  </SheetTrigger>
                </TooltipTrigger>

                <TooltipContent side="bottom">
                  <p>Meniu</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <SheetContent
              side="left"
              className="
        p-0 w-72
        bg-gray-100 dark:bg-gray-600
        border shadow-lg
        rounded-tr-3xl rounded-br-3xl
        flex flex-col
      "
              style={{
                top: NAVBAR_H,
                height: `calc(100vh - ${NAVBAR_H}px)`,
              }}
            >
              <SheetHeader className="px-4 py-3">
                <SheetTitle>Contul meu</SheetTitle>
              </SheetHeader>

              <nav className="px-2 pb-4 space-y-1">
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                  href="/listofprojects"
                >
                  Licențele mele
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                  href="/listofprojects"
                >
                  Detaliile contului
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                  href="/listofprojects"
                >
                  Șterge contul
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                  href="/listofprojects"
                >
                  Contact
                </Link>
              </nav>

              {open && (
                <div className="mt-auto border-t px-4 py-3 text-sm flex items-center justify-between">
                  <span className="text-muted-foreground">Durată sesiune:</span>
                  <ConnectedSince active={open} />
                </div>
              )}
            </SheetContent>
          </Sheet>

          {mounted && status === "authenticated" && username && (
            <span className="text-md">{username}</span>
          )}
          {mounted && status === "authenticated" && (
            <NavbarButton onClick={handleLogout}>Deconectare</NavbarButton>
          )}
        </div>
      </div>
    </header>
  );
}
