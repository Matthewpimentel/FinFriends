import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const urlParams = new URLSearchParams(request.url.split('?')[1]);
        const email = urlParams.get('email');
        
        // Fetch posts from users being followed
        const result = await sql`
            SELECT p.*, u.name AS user_name, u.email AS user_email, u.profilepicture AS user_profilepicture
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.user_id IN (
                SELECT unnest(u.following)
                FROM users u
                WHERE u.email = ${email}
            );
        `;

        // Extract rows from the SQL query result
        const posts = result.rows.map(row => ({
            id: row.id,
            user_id: row.user_id,
            description: row.description,
            imageurls: row.imageurls,
            date_added: row.date_added,
            comments: row.comments,
            email: row.user_email,
            name: row.user_name,
            likes: row.likes,
            profilepicture: row.user_profilepicture
        }));

        // Return the JSON response with the posts
        return NextResponse.json({ posts }, { status: 200 });
    }
    catch (error) {
        // Handle errors and return appropriate response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
