import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const postId = request.query.id; // Assuming the client sends the post ID in the query
        
        // Fetch comments from the specified post ID
        const result = await sql`
            SELECT (comments->>'commentText') AS comment_text, (comments->>'commenterId') AS commenter_id
            FROM posts
            WHERE id = ${postId};
        `;

        // Extract comments from the SQL query result
        const comments = result.rows.map(row => ({
            commentText: row.comment_text,
            commenterId: row.commenter_id
        }));

        // Return the JSON response with the comments
        return NextResponse.json({ comments }, { status: 200 });
    } catch (error) {
        // Handle errors and return appropriate response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
