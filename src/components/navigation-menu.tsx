"use client";

import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { User as UserIcon } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import { NavbarButton } from "./button";

export default function NavigationBar() {
  const { data: session, status } = useSession();
  const username = session?.user?.name ?? "Guest";

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 w-full items-center px-4">
        <NavigationMenu className="justify-start">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="px-3 py-2">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

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
          <UserIcon className="size-5" />
          <span className="text-sm">{username}</span>

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
