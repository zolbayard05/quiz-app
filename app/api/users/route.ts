import pool from "@/lib/db";
import { NextResponse } from "next/server";

export const GET = async () => {
  const result = await pool.query("SELECT * FROM employees");
  return NextResponse.json(
    { message: "User amjilttai butsaalaa", result },
    { status: 200 },
  );
};

export const POST = async (request: Request) => {
  const body = await request.json();
  const { fullname, age, gender, department, salary, years_of_service } = body;

  const result = await pool.query(
    `INSERT INTO employees (fullname, age, gender, department, salary, years_of_service) VALUES 
    ${fullname}, ${age}, ${gender}
    `,
  );

  return NextResponse.json(
    { message: "User added successfully", result: body },
    { status: 201 },
  );
};
