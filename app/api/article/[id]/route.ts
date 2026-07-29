import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { NextResponse } from "next/server";
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getOrCreateUser();

  const result = await pool.query(
    "SELECT * FROM articles WHERE id = $1 AND user_id = $2",
    [id, user.id],
  );

  if (!result.rows[0]) {
    return NextResponse.json({ error: "oldsongui" }, { status: 404 });
  }
  return NextResponse.json(result.rows[0]);
}
