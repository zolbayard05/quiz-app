import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getOrCreateUser();
  const { answers } = await req.json();

  const qs = await pool.query(
    "SELECT id, question, options, correct_answer FROM questions WHERE quiz_id = $1 ORDER BY id",
    [id],
  );

  let score = 0;
  const detail = qs.rows.map((q) => {
    const userAnswer = answers[q.id];
    const correct = userAnswer === q.correct_answer;
    if (correct) score++;
    return {
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: q.correct_answer,
      userAnswer,
      correct,
    };
  });

  await pool.query(
    "INSERT INTO attempts (quiz_id, user_id, score, answers) VALUES ($1, $2, $3, $4)",
    [id, user.id, score, JSON.stringify(answers)],
  );

  return NextResponse.json({ score, total: qs.rows.length, detail });
}
