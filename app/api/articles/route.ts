import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getOrCreateUser();
  const result = await pool.query(
    "SELECT * FROM articles WHERE user_id = $1 ORDER BY created_at DESC",
    [user.id],
  );
  return NextResponse.json(result.rows);
}

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  const { title, content } = await req.json();

  if (!title || !content) {
    return NextResponse.json(
      { error: "title , text zaaval heregtei" },
      { status: 400 },
    );
  }
  const result = await pool.query(
    "INSERT INTO articles (user_id, title, content) VALUES ($1, $2, $3) RETURNING *",
    [user.id, title, content],
  );
  return NextResponse.json(result.rows[0], { status: 201 });
}
