import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../../db";
import bcrypt from "bcrypt";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { name, email, pass, address, city } = body;
  const saltRounds = 10;

  console.log({ name, email, pass, address, city });

  if (!name || !email || !pass) {
    return Response.json(
      { error: "Missing name, email or password" },
      { status: 400 }
    );
  }

  const exist = await db
    .selectFrom("users")
    .select("users.email")
    .where("email", "=", email)
    .executeTakeFirst();

  if (exist) {
    return Response.json({ error: "User already exists" }, { status: 400 });
  }

  const hashedPass = await bcrypt.hash(pass, saltRounds);

  const user = await db
    .insertInto("users")
    .values({
      name,
      email,
      password: hashedPass,
      address,
      city,
    })
    .executeTakeFirst();

  return Response.json({ data: "User registered" }, { status: 200 });
}
