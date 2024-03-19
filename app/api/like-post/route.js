import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { postId, email } = await request.json();


        // Update the likes array in the posts table
        const test = await sql`
            UPDATE posts
            SET likes = array_append(likes, ${email})
            WHERE id = ${postId};
        `;
        // Update the likes array in the users table
        await sql`
            UPDATE users
            SET likes = array_append(likes, ${postId})
            WHERE email = ${email};
        `;

        // Return a success response
        return NextResponse.json({ message: 'Likes updated successfully' }, { status: 200 });
    } catch (error) {
        // Handle errors and return appropriate response
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
