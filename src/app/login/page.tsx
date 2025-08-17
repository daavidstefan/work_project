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
}
