import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email } = await request.json(); // Parse JSON body

  try {
    if (!name || !email) throw new Error('Name and Email required');
    await sql`INSERT INTO users (name, email) VALUES (${name}, ${email});`;
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  const pets = await sql`SELECT * FROM users;`;
  return NextResponse.json({ pets }, { status: 200 });
}
