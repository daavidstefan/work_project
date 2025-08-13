import TestTable from "@/components/projects-table";
import { pg } from "@@/lib/db";

export default async function ListOfProjectsPage() {
  const { rows: projects } = await pg.query(
    "SELECT id, name, details, slug FROM projects ORDER BY created_at DESC"
  );

  return (
    <div>
      <TestTable projects={projects} />
    </div>
  );
}
