import { NextResponse } from 'next/server';
import { sql } from '@vercel/postgres';

export async function GET(request) {
    try {
        const urlParams = new URLSearchParams(request.url.split('?')[1]);
        const email = urlParams.get('email');

        if (!email) {
            throw new Error('Email parameter is missing in the request');
        }

        // Retrieve the user's posts along with their user ID
        const posts = await sql`
            SELECT p.* 
            FROM posts p
            JOIN users u ON p.user_id = u.id
            WHERE u.email = ${email}
        `;

        // Return the retrieved data as a JSON response
        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        // Return an error response if an error occurs
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
