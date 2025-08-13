"use client";

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { Card } from "@/components/ui/card";

export default function Home() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === "unauthenticated") {
      signIn("keycloak");
    }
  }, [status]);

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 p-6">
      <Card className="lg:col-span-1 lg:col-start-2 justify-self-center w-[calc(30vw-3rem)] h-[calc(20vh-3rem)] overflow-y-auto p-6 tex text-center">
        <h1>Hello, {session.user?.name}!</h1>
      </Card>
    </div>
  );
}
