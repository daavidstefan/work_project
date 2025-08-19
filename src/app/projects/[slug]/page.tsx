// citirea slug-ului
// interogarea db
// trimite props catre ProjectDetailsClient

import { pg } from "@@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@@/lib/auth";
import { notFound } from "next/navigation";
import ProjectDetails from "./project-details";

type PageProps = { params: { slug: string } };

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // sesiune (pt canEdit)
  const session = await getServerSession(authOptions);
  const meSub =
    (session?.user as any)?.id || (session?.user as any)?.sub || null;

  // proiect + autor
  const { rows: p } = await pg.query<{
    id: number;
    name: string;
    details: string | null;
    slug: string;
    author_sub_id: string;
    created_at: string;
  }>(
    `SELECT id, name, details, slug, author_sub_id, created_at
     FROM projects
     WHERE slug = $1
     LIMIT 1`,
    [slug]
  );

  const project = p[0];
  if (!project) {
    // return notFound();
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Proiect inexistent</h1>
        <p className="mt-2 text-muted-foreground">
          Nu există proiectul: {slug}
        </p>
      </div>
    );
  }

  const roles = (session as any)?.user?.roles as string[] | undefined;
  const isAdmin = roles?.includes("admin") ?? false;
  const canEdit = !!meSub && (meSub === project.author_sub_id || isAdmin);

  // features
  const { rows: features } = await pg.query<{
    id: number;
    key: string; // acum e string
    label: string;
  }>(
    `SELECT id, COALESCE(key, '') AS key, label
   FROM features
   WHERE project_id = $1
   ORDER BY label`,
    [project.id]
  );

  return (
    <ProjectDetails
      project={{
        id: project.id,
        slug: project.slug,
        name: project.name,
        details: project.details ?? "",
        created_at: project.created_at,
      }}
      features={features}
      canEdit={canEdit}
    />
  );
}
