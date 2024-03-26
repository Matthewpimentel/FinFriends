import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  const { name, email, username, profilepicture } = await request.json(); // Parse JSON body

  try {
    if (!name || !email || !username || !profilepicture) throw new Error('Name and Email required');

    // Check if user already exists with the given email
    const existingUser = await sql`
      SELECT * FROM users WHERE email = ${email};
    `;

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // If user doesn't exist, insert into the database
    await sql`INSERT INTO users (name, email, userName, profilepicture) VALUES (${name}, ${email}, ${username}, ${profilepicture});`;

    // Retrieve all users from the database
    const users = await sql`SELECT * FROM users;`;
    
    // Return success response along with updated user list
    return NextResponse.json({ message: 'User added successfully'}, { status: 200 });
  } catch (error) {
    // Handle error and return appropriate response
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
