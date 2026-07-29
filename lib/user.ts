import { currentUser } from "@clerk/nextjs/server";

import pool from "./db";

export async function getOrCreateUser() {
  const user = await currentUser();
  if (!user) throw new Error("not signed in");

  const found = await pool.query("SELECT * FROM users WHERE clerk_id = $1", [
    user.id,
  ]);
  if (found.rows[0]) return found.rows[0];

  const created = await pool.query(
    "INSERT INTO users (email, name, clerk_id) VALUES ($1, $2, $3) RETURNING *",
    [user.emailAddresses[0]?.emailAddress, user.firstName, user.id],
  );
  const email = user.emailAddresses[0]?.emailAddress;
  console.log("email:", email);
  return created.rows[0];
}
