import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  await getOrCreateUser();

  const result = await pool.query(
    "SELECT id, question, options FROM questions WHERE quiz_id = $1 ORDER BY id",
    [id],
  );

  return NextResponse.json(result.rows);
}
