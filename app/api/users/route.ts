import pool from "@/lib/db";
import { NextResponse } from "next/server";

// GET REQUEST
export const GET = async () => {
  const result = await pool.query("SELECT * FROM employees");
  return NextResponse.json(
    { message: "User amjilttai butsaalaa", result },
    { status: 200 },
  );
};

// POST REQUEST
export const POST = async (request: Request) => {
  const body = await request.json();
  const { email, name, clerkId, articles } = body;

  const result = await pool.query(
    `INSERT INTO users (email, name, clerkId, articles) VALUES 
    ${email}, ${name}, ${clerkId} ${articles}, 
    `,
  );

  return NextResponse.json(
    { message: "User added successfully", result: body },
    { status: 201 },
  );
};
