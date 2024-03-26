import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        // Fetch up to 15 posts sorted by likes
        const allPostsResult = await sql`
            SELECT p.*, u.name AS user_name, u.email AS user_email, u.following AS user_email, u.profilepicture AS user_profilepicture, u.following AS user_following, u.username AS user_username, u.followers AS user_followers
            FROM posts p
            JOIN users u ON u.id = p.user_id
            ORDER BY p.likes DESC
            LIMIT 15;
        `;

        // Extract rows from the SQL query result for all posts
        const posts = allPostsResult.rows.map(row => ({
            id: row.id,
            user_id: row.user_id,
            description: row.description,
            imageurls: row.imageurls,
            date_added: row.date_added,
            comments: row.comments,
            email: row.user_email,
            name: row.user_name,
            likes: row.likes,
            profilepicture: row.user_profilepicture,
            following: row.user_following,
            followers: row.user_followers,
            username: row.user_username
        }));

        // Iterate over posts and fetch commenter information
        for (const post of posts) {
            for (const comment of post.comments) {
                const commenterId = comment.commenterId;
                const commenterResult = await sql`
                    SELECT profilepicture, username
                    FROM users
                    WHERE id = ${commenterId};
                `;
                const commenter = commenterResult.rows[0];
                if (commenter) {
                    comment.commenter = {
                        profilepicture: commenter.profilepicture,
                        username: commenter.username
                    };
                }
            }
        }


        // Return the JSON response with up to 15 posts
        return NextResponse.json({ posts }, { status: 200 });
    } catch (error) {
        // Handle errors and return appropriate response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
