import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: `Generate 5 multiple choice questions based on this article: ${article.summary}`,
    response_format: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              options: { type: "array", items: { type: "string" } },
              answer: { type: "integer" },
            },
            required: ["question", "options", "answer"],
          },
        },
      },
      required: ["questions"],
    },
  });

  if (!interaction.output_text) {
    return NextResponse.json(
      { error: "gemini yuch uguhgui baina" },
      { status: 500 },
    );
  }

  const { questions } = JSON.parse(interaction.output_text);

  const quiz = await pool.query(
    "INSERT INTO quiz (article_id) VALUES ($1) RETURNING *",
    [id],
  );
  const quizId = quiz.rows[0].id;

  await Promise.all(
    questions
      .slice(0, 5)
      .map((q: any) =>
        pool.query(
          "INSERT INTO questions (quiz_id, question, options, correct_answer) VALUES ($1, $2, $3, $4)",
          [quizId, q.question, JSON.stringify(q.options), q.answer],
        ),
      ),
  );

  return NextResponse.json({ quizId }, { status: 201 });
}
