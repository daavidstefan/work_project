// logarea user-uluo

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Card } from "@/components/ui/card";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3 p-6">
      <Card className="lg:col-span-1 lg:col-start-2 justify-self-center w-[calc(30vw-3rem)] h-[calc(20vh-3rem)] overflow-y-auto p-6 tex text-center">
        <h1>Hello, {session.user?.name}!</h1>
      </Card>
    </div>
  );
}

