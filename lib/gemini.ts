import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function askGeminiJson(prompt: string, schema: object) {
  const interaction = await ai.interactions.create({
    model: "gemini-3.6-flash",
    input: prompt,
    response_format: {
      type: "text",
      mime_type: "application/json",
      schema,
    },
  });
  return JSON.parse(interaction.output_text!);
}
