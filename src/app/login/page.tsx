"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";

export default function LoginPage() {
  const [role, setRole] = useState<"client" | "provider">("client");

  const handleLogin = () => {
    signIn("keycloak", { callbackUrl: "/listofprojects" });
  };

  const handleRegister = () => {
    const callbackUrl = `/after-auth?desiredRole=${role}`;
    signIn("keycloak-register", { callbackUrl }); // <— providerul de sus
  };

  return (
    <main className="min-h-[70vh] flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-5 border rounded-xl p-6">
        <h1 className="text-2xl font-semibold text-center">Autentificare</h1>

        <button className="w-full border rounded-md p-3" onClick={handleLogin}>
          Conectare cu Keycloak
        </button>

        <div className="space-y-3">
          <div className="text-sm text-muted-foreground">
            Înregistrare (alege tipul de cont):
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              className={`border rounded-md p-3 ${
                role === "client" ? "bg-accent" : ""
              }`}
              onClick={() => setRole("client")}
            >
              Sunt client
            </button>
            <button
              className={`border rounded-md p-3 ${
                role === "provider" ? "bg-accent" : ""
              }`}
              onClick={() => setRole("provider")}
            >
              Sunt provider
            </button>
          </div>

          <button
            className="w-full border rounded-md p-3"
            onClick={handleRegister}
          >
            Înregistrare cu Keycloak
          </button>
        </div>

        <p className="text-xs text-muted-foreground">
          Alegerea de mai sus setează intenția ta; rolurile reale sunt atribuite
          în Keycloak.
        </p>
      </div>
    </main>
  );
}
