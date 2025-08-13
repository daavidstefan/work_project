import { pg } from "@@/lib/db";
import ProjectDetailsClient from "./project-details-client";

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { rows: p } = await pg.query(
    `SELECT id, name, details, slug FROM projects WHERE slug = $1 LIMIT 1`,
    [slug]
  );

  if (!p[0]) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold">Proiect inexistent</h1>
        <p className="mt-2 text-muted-foreground">
          Nu există proiectul: {slug}
        </p>
      </div>
    );
  }

  const project = p[0];

  const { rows: features } = await pg.query(
    `SELECT f.id, f.key, f.label
     FROM features f
     JOIN project_features pf ON pf.feature_id = f.id
     JOIN projects p ON p.id = pf.project_id
     WHERE p.slug = $1
     ORDER BY f.label`,
    [slug]
  );

  return (
    <ProjectDetailsClient
      project={{ name: project.name, details: project.details ?? "" }}
      features={features}
    />
  );
}
