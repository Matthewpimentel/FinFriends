import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function GET(request) {
    try {
        const urlParams = new URLSearchParams(request.url.split('?')[1]);
        const email = urlParams.get('email');
        
        // Fetch the current user's ID based on email
        const userResult = await sql`
            SELECT id
            FROM users
            WHERE email = ${email};
        `;

        // Extract the user's ID from the SQL query result
        const userId = userResult.rows[0].id;

        // Fetch posts from users being followed
        const followingPostsResult = await sql`
            SELECT p.*, u.name AS user_name, u.email AS user_email, u.following AS user_email, u.profilepicture AS user_profilepicture, u.following AS user_following, u.username AS user_username, u.followers AS user_followers
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.user_id IN (
                SELECT unnest(u.following)
                FROM users u
                WHERE u.email = ${email}
            );
        `;

        // Extract rows from the SQL query result for posts from users being followed
        const followingPosts = followingPostsResult.rows.map(row => ({
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

        // Fetch posts from users not being followed, sorted by likes
        const notFollowingPostsResult = await sql`
            SELECT p.*, u.name AS user_name, u.email AS user_email, u.following AS user_email, u.profilepicture AS user_profilepicture, u.following AS user_following, u.username AS user_username, u.followers AS user_followers
            FROM posts p
            JOIN users u ON u.id = p.user_id
            WHERE p.user_id NOT IN (
                SELECT unnest(u.following)
                FROM users u
                WHERE u.email = ${email}
            )
            ORDER BY p.likes DESC
            LIMIT 15;
        `;

        // Extract rows from the SQL query result for posts from users not being followed
        const notFollowingPosts = notFollowingPostsResult.rows.map(row => ({
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

        // Combine posts from users being followed and not being followed
        const posts = followingPosts.concat(notFollowingPosts);

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

        // Return the JSON response with the combined posts and current user's ID
        return NextResponse.json({ userId, posts }, { status: 200 });
    } catch (error) {
        // Handle errors and return appropriate response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
