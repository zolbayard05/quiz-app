import pool from "@/lib/db";
import { askGemini } from "@/lib/gemini";
import { getOrCreateUser } from "@/lib/user";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const user = await getOrCreateUser();

  const found = await pool.query(
    "SELECT * FROM articles WHERE id = $1 AND user_id = $2",
    [id, user.id],
  );
  const article = found.rows[0];
  if (!article) {
    return NextResponse.json({ error: "oldsongui" }, { status: 404 });
  }

  const prompt = `Generate 5 multiple choice questions based on this article: ${article.summary}.
Return the response in this exact JSON format:
[
  {
    "question": "Question text here",
    "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
    "answer": "0"
  }
]
Make sure the response is valid JSON and the answer is the index (0-3) of the correct option.`;

  let questions;
  for (let i = 0; i < 2; i++) {
    try {
      const raw = await askGemini(prompt);
      const clean = raw.replace(/```json|```/g, "").trim();
      questions = JSON.parse(clean);
      if (Array.isArray(questions) && questions.length > 0) break;
    } catch {
      questions = null;
    }
  }

  if (!questions) {
    return NextResponse.json(
      { error: "quiz uusgej chadsangui" },
      { status: 500 },
    );
  }

  const quiz = await pool.query(
    "INSERT INTO quiz (article_id) VALUES ($1) RETURNING *",
    [id],
  );
  const quizId = quiz.rows[0].id;

  for (const q of questions.slice(0, 5)) {
    await pool.query(
      "INSERT INTO questions (quiz_id, question, options, correct_answer) VALUES ($1, $2, $3, $4)",
      [quizId, q.question, JSON.stringify(q.options), Number(q.answer)],
    );
  }

  return NextResponse.json({ quizId }, { status: 201 });
}
