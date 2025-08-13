"use client";

import { useEffect } from "react";
import { signIn, signOut, useSession } from "next-auth/react";

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
    <div>
      <div>
        <h1>Hello, {session.user?.name}!</h1>
      </div>
    </div>
  );
}
