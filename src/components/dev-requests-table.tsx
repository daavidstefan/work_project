// sensitive
"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useSession } from "next-auth/react";

function getPriorityRole(
  roles: string[] | undefined | null
): "admin" | "developer" | "client" | null {
  if (!Array.isArray(roles) || roles.length === 0) {
    return null;
  }

  if (roles.includes("admin")) {
    return "admin";
  }

  if (roles.includes("developer")) {
    return "developer";
  }

  if (roles.includes("client")) {
    return "client";
  }

  return null;
}

export default function DevRequestsTable() {
  const { data: session, status } = useSession();
  const username = session?.user?.name;
  const userRole = getPriorityRole(session?.user?.role);
  if (userRole != "admin") {
    return null;
  }
  return (
    <div className="p-6">
      <Card className="lg:col-span-1 lg:col-start-2 justify-self-center w-[calc(65vw-3rem)] h-[calc(92vh-3rem)] overflow-y-auto p-6 flex flex-col">
        <h1> mue </h1>
      </Card>
    </div>
  );
}
