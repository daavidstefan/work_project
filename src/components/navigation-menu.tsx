// meniul de navigare principal
// contine sheet-ul cu datele contului (facut partial)

"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { UserRoundCog } from "lucide-react";
import { CircleX } from "lucide-react";
import { Menu } from "lucide-react";
import { FileCheck } from "lucide-react";
import { Folder } from "lucide-react";
import { Phone } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { NavbarButton } from "./navbar-button";
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
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const NAVBAR_H = 56;

export default function NavigationBar() {
  const pathname = usePathname();
  if (pathname === "/login") return null;
  const { data: session, status } = useSession();
  const username = session?.user?.name;
  const [open, setOpen] = useState(false);

  // salveaza ora de login
  useEffect(() => {
    // if (status === "authenticated" && !localStorage.getItem("loginAt")) {
    //   localStorage.setItem("loginAt", Date.now().toString());
    // }
    if (!localStorage.getItem(`loginAt`)) {
      localStorage.setItem("loginAt", Date.now().toString());
    }
    // localStorage.setItem("loginAt", Date.now().toString());
  }, []);
  // console.log(
  //   "@@@@@@@@@@@@@@@@@@@@@@@",
  //   process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER
  // );
  const handleLogout = async () => {
    localStorage.removeItem("loginAt");
    const idToken = (session as any)?.id_token as string | undefined;
    try {
      // console.log("aaaaaaaaaaaaaaa", idToken, JSON.stringify(session));
      // console.log(
      //   "------------------",
      //   process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER
      // );
      // curata sesiunea sso (sau cel putin incerc)
      if (idToken && process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER) {
        const url =
          `${process.env.NEXT_PUBLIC_KEYCLOAK_ISSUER}/protocol/openid-connect/logout` +
          `?id_token_hint=${encodeURIComponent(idToken)}` +
          `&post_logout_redirect_uri=${encodeURIComponent(
            `${window.location.origin}/login`
          )}`;

        await fetch(url, { credentials: "include" }).catch(() => {});
      }
      // logout din nextauth
      await signOut({ redirect: false });
    } finally {
      localStorage.removeItem("loginAt");
      // sterge cookies
      document.cookie.split(";").forEach((cookie) => {
        const eqPos = cookie.indexOf("=");
        const name = eqPos > -1 ? cookie.slice(0, eqPos).trim() : cookie.trim();
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      });
      // redirect /login
      window.location.href = "/login";
    }
  };

  const deleteAccount = async () => {
    localStorage.removeItem("loginAt");
    const res = await fetch("/api/account/delete", { method: "DELETE" });
    if (res.ok) {
      await signOut({ callbackUrl: "/" });
    } else {
      const { error } = await res.json();
      toast.error(error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur">
      <div className="flex h-14 w-full items-center px-4">
        <Sheet open={open} onOpenChange={setOpen}>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <SheetTrigger asChild>
                  <button
                    className="cursor-pointer p-2 rounded-md hover:bg-accent"
                    aria-label="Open menu"
                  >
                    <Menu className="size-5" />
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
            onCloseAutoFocus={(e) => e.preventDefault()}
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
                href="/myprojects"
                onClick={() => setOpen(false)}
              >
                <Folder className="size-5" />
                Proiectele mele
              </Link>
              <Link
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                href=""
                onClick={() => {
                  toast.error("Zonă în construcție...");
                  setOpen(false);
                }}
              >
                <FileCheck className="size-5" />
                Licențele mele
              </Link>
              <Link
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                href=""
                onClick={() => {
                  toast.error("Zonă în construcție...");
                  setOpen(false);
                }}
              >
                <UserRoundCog className="size-5" />
                Detaliile contului
              </Link>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <button
                    type="button"
                    className="w-full text-left flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent text-red-600 cursor-pointer"
                  >
                    <CircleX className="size-5" />
                    Șterge contul
                  </button>
                </AlertDialogTrigger>

                <AlertDialogContent className="border-1 border-red-500 animate-shake">
                  {" "}
                  <AlertDialogHeader>
                    <AlertDialogTitle className="text-red-600">
                      Această acțiune este ireversibilă!
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Sigur vrei să îți ștergi contul? Dacă ai proiecte listate,
                      acestea vor rămâne vizibile până când expiră ultima
                      licență emisă. Alte licențe nu vor mai putea fi generate.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Anulează</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-red-600 hover:bg-red-700"
                      onClick={async () => {
                        await deleteAccount();
                      }}
                    >
                      Confirmă
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <Link
                className="flex items-center gap-2 rounded-md px-3 py-2 hover:bg-accent"
                href=""
                onClick={() => {
                  toast.error("Zonă în construcție...");
                  setOpen(false);
                }}
              >
                <Phone className="size-5" />
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

        <NavigationMenu className="ml-4">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/listofprojects" className="px-3 py-2">
                  Vezi proiectele disponibile
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/addnewproject" className="px-3 py-2">
                  Adaugă un proiect nou
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>

        <div className="ml-auto flex items-center gap-2">
          {status === "authenticated" && username && (
            <span className="px-3 py-2">{username}</span>
          )}
          {status === "authenticated" && (
            <NavbarButton variant="destructive" onClick={handleLogout}>
              Deconectare
            </NavbarButton>
          )}
        </div>
      </div>
    </header>
  );
}
