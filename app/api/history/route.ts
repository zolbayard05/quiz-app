import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function GET() {
  const user = await getOrCreateUser();

  const result = await pool.query(
    `SELECT
       a.id           AS article_id,
       a.title,
       a.summary,
       a.created_at,
       q.id           AS quiz_id,
       COUNT(at.id)   AS attempt_count,
       MAX(at.score)  AS best_score
     FROM articles a
     LEFT JOIN quiz q      ON q.article_id = a.id
     LEFT JOIN attempts at ON at.quiz_id = q.id
     WHERE a.user_id = $1
     GROUP BY a.id, q.id
     ORDER BY a.created_at DESC`,
    [user.id],
  );

  return NextResponse.json(result.rows);
}
