import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        // Extract necessary information from the request body
        const { postId, commentText, email } = await request.json();

        // Use a single SQL statement with a Common Table Expression (CTE) to insert the comment
        await sql`
            WITH user_info AS (
                SELECT id AS commenter_id FROM users WHERE email = ${email}
            )
            UPDATE posts
            SET comments = comments || jsonb_build_object(
                'postId', ${postId}::integer,
                'commentText', ${commentText}::text,
                'commenterId', (SELECT commenter_id FROM user_info),
                'likes', 0,
                'timestamp', current_timestamp
            )
            WHERE id = ${postId}::integer;
        `;

        // Return a success response
        return NextResponse.json({ message: 'Comment added successfully' }, { status: 200 });
    } catch (error) {
        // Handle errors and return appropriate response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
