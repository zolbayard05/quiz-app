import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const user = await getOrCreateUser();
  const { articleId } = await req.json();

  const found = await pool.query(
    "SELECT * FROM articles WHERE id = $1 AND user_id = $2",
    [articleId, user.id],
  );

  const article = found.rows[0];
  if (!article) {
    return NextResponse.json({ error: "oldsongui" }, { status: 404 });
  }

  if (article.summery) return NextResponse.json(article);

  const summary = await askGemini(
    `Please provide a concise summary of the following article: ${article.content}`,
  );

  const updated = await pool.query(
    "UPDATE articles SET summary = $1 WHERE id = $2 RETURNING *",
    [summary, articleId],
  );

  return NextResponse.json(updated.rows[0]);
}
