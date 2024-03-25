import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const urlParams = new URLSearchParams(request.url.split('?')[1]);
    const username = urlParams.get('query');

    // Search for users whose usernames match the search query
    const result = await sql`
      SELECT * FROM users WHERE username ILIKE '%' || ${username} || '%';
    `;

    const users = result.rows;

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
