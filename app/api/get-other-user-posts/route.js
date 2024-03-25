import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try {
        const urlParams = new URLSearchParams(request.url.split('?')[1]);
        const userId = urlParams.get('userId');

        if (!userId) {
            throw new Error('UserID parameter is missing in the request');
        }

        // Retrieve the user's posts
        const posts = await sql`
            SELECT p.*
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE u.id = ${userId}
        `;

        // Retrieve additional user information
        const userInfo = await sql`
            SELECT username, followers, following, profilepicture
            FROM users
            WHERE id = ${userId}
        `;

        // Return the retrieved data as a JSON response
        return NextResponse.json({ posts, userInfo }, { status: 200 });
    } catch (error) {
        // Return an error response if an error occurs
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
