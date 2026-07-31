import pool from "@/lib/db";
import { getOrCreateUser } from "@/lib/user";
import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

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

  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: `Please provide a concise summary of the following article: ${article.content}`,
  });

  const summary = interaction.output_text;
  if (!summary) {
    return NextResponse.json(
      { error: " gemini yuch butsaahgui baina" },
      { status: 500 },
    );
  }

  const updated = await pool.query(
    "UPDATE articles SET summary = $1 WHERE id = $2 RETURNING *",
    [summary, articleId],
  );

  return NextResponse.json(updated.rows[0]);
}
