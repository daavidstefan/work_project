"use client";

import { signIn } from "next-auth/react";
import { NavbarButton } from "@/components/button";

export default function Login() {
  return (
    <div className="flex justify-center p-4">
      <NavbarButton onClick={() => signIn("keycloak")}>Log in</NavbarButton>
    </div>
  );
}
