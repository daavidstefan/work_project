// citirea parametrilor din url
// interogarea db
// trimite props catre \components\projects-table

export const dynamic = "force-dynamic";
export const revalidate = 0;

import TestTable from "@/components/projects-table";
import { pg } from "@@/lib/db";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ sort?: string; order?: "asc" | "desc"; q?: string }>;
}) {
  const sp = await searchParams;

  const allowed: Record<string, string> = {
    id: "id",
    name: "name",
    created_at: "created_at",
  };

  const sort = allowed[sp.sort ?? "id"] ?? "id";
  const order = sp.order === "desc" ? "DESC" : "ASC";

  const q = (sp.q ?? "").toString().trim();

  const params: any[] = [];
  let sql = `SELECT id, name, details, slug, created_at FROM projects`;

  if (q) {
    params.push(`%${q}%`);
    sql += ` WHERE name ILIKE $${params.length}`;
  }

  sql += ` ORDER BY ${sort} ${order}`;

  const { rows: projects } = await pg.query(sql, params);

  return <TestTable projects={projects} />;
}
