// src/app/after-auth/page.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/../lib/auth";

export default async function AfterAuth({
  searchParams,
}: {
  searchParams: { desiredRole?: "client" | "provider" };
}) {
  const session = await getServerSession(authOptions);
  const desiredRole = searchParams?.desiredRole;
  const roles = ((session?.user as any)?.roles as string[]) || [];

  const hasDesired = desiredRole ? roles.includes(desiredRole) : true;

  if (hasDesired) {
    // totul ok → redirect calm către pagina principală
    return <meta httpEquiv="refresh" content="0;url=/listofprojects" />;
  }

  // dacă userul nu are rolul dorit (ex. tocmai s-a înregistrat), arată next steps
  return (
    <div className="p-6 max-w-xl mx-auto space-y-4">
      <h1 className="text-2xl font-semibold">Rolul tău nu este încă activ</h1>
      <p className="text-sm text-muted-foreground">
        Ai cerut rolul <strong>{desiredRole}</strong>, dar contul tău are
        rolurile: <code>{roles.join(", ") || "(niciunul)"}</code>.
      </p>
      <p className="text-sm">
        Contactează un admin pentru aprobare sau folosește un flux automat (îl
        implementăm într-un pas următor) care îți atribuie rolul dorit.
      </p>
      <a
        className="inline-block border rounded-md px-4 py-2"
        href="/listofprojects"
      >
        Continuă
      </a>
    </div>
  );
}
