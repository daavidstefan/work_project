import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@@/lib/auth";
import { pg } from "@@/lib/db";

type AllowedStatus = "approved" | "rejected";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: "Neautentificat" }, { status: 401 });
  }

  const userRole = (session.user as any)?.role;

  if (userRole !== "admin") {
    return NextResponse.json({ error: "Nu ai permisiuni" }, { status: 403 });
  }

  const { id } = await params;

  let body: { status?: AllowedStatus };

  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON invalid" }, { status: 400 });
  }

  const nextStatus = body.status;

  if (!nextStatus || !["approved", "rejected"].includes(nextStatus)) {
    return NextResponse.json(
      { error: "Status invalid. Sunt permise doar approved sau rejected." },
      { status: 400 },
    );
  }

  try {
    const { rows: existingRows } = await pg.query<{ status: string }>(
      `
        SELECT status
        FROM dev_requests
        WHERE id = $1
        LIMIT 1
      `,
      [id],
    );

    if (existingRows.length === 0) {
      return NextResponse.json(
        { error: "Cererea nu a fost găsită" },
        { status: 404 },
      );
    }

    const currentStatus = existingRows[0].status;

    if (currentStatus !== "pending") {
      return NextResponse.json(
        { error: "Doar cererile pending pot fi actualizate." },
        { status: 409 },
      );
    }

    const { rows } = await pg.query(
      `
        UPDATE dev_requests
        SET status = $1
        WHERE id = $2
        RETURNING id, firstname, lastname, email, companyname, website, motivation, status, created_at
      `,
      [nextStatus, id],
    );

    return NextResponse.json(rows[0], { status: 200 });
  } catch (error: any) {
    console.error("update dev_request failed:", error);

    if (error.code === "22P02") {
      return NextResponse.json({ error: "Format ID invalid" }, { status: 400 });
    }

    return NextResponse.json({ error: "Eroare server" }, { status: 500 });
  }
}
