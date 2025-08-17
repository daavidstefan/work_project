import { getServerSession } from "next-auth";
import { authOptions } from "@@/lib/auth";
import { redirect } from "next/navigation";

export default async function Login() {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/listofprojects");
  }
  redirect("/api/auth/signin/keycloak?callbackUrl=/listofprojects");
}
