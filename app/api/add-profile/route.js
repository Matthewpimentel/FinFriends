import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email } = await request.json(); // Parse JSON body

  try {
    if (!name || !email) throw new Error('Name and Email required');

    // Check if user already exists
    const existingUser = await sql`
      SELECT * FROM users WHERE name = ${name} AND email = ${email};
    `;

    if (existingUser.length > 0) {
      throw new Error('User already exists');
    }

    // If user doesn't exist, insert into the database
    await sql`INSERT INTO users (name, email) VALUES (${name}, ${email});`;
  } catch (error) {
    if (error.message.includes('duplicate key value violates unique constraint "users_name_key"')) {
      return NextResponse.json({ error: 'User with this name already exists' }, { status: 400 });
    } else {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  const users = await sql`SELECT * FROM users;`;
  return NextResponse.json({ users }, { status: 200 });
}