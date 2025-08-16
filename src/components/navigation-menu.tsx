"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
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
  if (pathname === "/login" || pathname === "/after-auth") return null;
  const { data: session, status } = useSession();
  const username = session?.user?.name ?? "Guest";
  const [open, setOpen] = useState(false);
  const NAVBAR_H = 56;

  // salveaza ora de login
  useEffect(() => {
    if (status === "authenticated" && !localStorage.getItem("loginAt")) {
      localStorage.setItem("loginAt", Date.now().toString());
    }
    if (status === "unauthenticated") {
      localStorage.removeItem("loginAt");
    }
  }, [status]);

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
                  href="/"
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
                  href="/calendar"
                >
                  Șterge contul
                </Link>
                <Link
                  className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                  href="/search"
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

          <span className="text-md">{username} </span>
          {status === "authenticated" ? (
            <NavbarButton onClick={() => signOut({ callbackUrl: "/" })}>
              Log out
            </NavbarButton>
          ) : (
            <NavbarButton onClick={() => signIn("keycloak")}>
              Log in
            </NavbarButton>
          )}
        </div>
      </div>
    </header>
  );
}
