import { getServerSession } from "next-auth";
import { authOptions } from "@@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Login({
  searchParams,
}: {
  searchParams?: { error?: string };
}) {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect("/listofprojects");
  }
  if (searchParams?.error) {
    return (
      <div className="p-4">
        <p className="mb-4">Autentificarea a eșuat.</p>
        <Link
          className="text-blue-600 underline"
          href="/api/auth/signin/keycloak?callbackUrl=/listofprojects"
        >
          Încearcă din nou
        </Link>
      </div>
    );
  }
  redirect("/api/auth/signin/keycloak?callbackUrl=/listofprojects");
}
