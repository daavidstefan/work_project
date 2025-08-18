"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "provider">("client");

  const handleLogin = () => {
    signIn("keycloak", { callbackUrl: "/listofprojects" });
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5 border rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-center">Autentificare</h1>

        <button
          className="w-full border rounded-md p-3 cursor-pointer"
          onClick={handleLogin}
        >
          Conectare cu Keycloak
        </button>
      </div>
    </main>
  );
}
