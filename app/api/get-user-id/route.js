import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const urlParams = new URLSearchParams(request.url.split('?')[1]);
        const username = urlParams.get('username');

        // Fetch user ID based on the username
        const userResult = await sql`
            SELECT id
            FROM users
            WHERE username = ${username};
        `;

        const userId = userResult.rows[0]?.id;

        // Return the user ID as a JSON response
        return NextResponse.json({ userId }, { status: 200 });
    } catch (error) {
        // Handle errors and return appropriate response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
