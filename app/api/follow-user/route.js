import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { followerId, userId } = await request.json();

    // Check if the follower is already following the user
    const isFollowing = await isUserFollowing(followerId, userId);

    if (isFollowing) {
      // If already following, unfollow the user
      await unfollowUser(followerId, userId);
    } else {
      // If not following, follow the user
      await followUser(followerId, userId);
    }

    // Return success response
    return NextResponse.json({ message: 'User followed/unfollowed successfully' }, { status: 200 });
  } catch (error) {
    // Handle errors and return appropriate response
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

async function isUserFollowing(followerId, userId) {
  // Check if the follower is already following the user
  const result = await sql`
    SELECT COUNT(*) FROM users WHERE id = ${followerId} AND ${userId} = ANY(followers);
  `;
  return result.rows[0].count > 0;
}

async function followUser(followerId, userId) {
  // Follow the user
  await sql`
    UPDATE users
    SET followers = array_append(followers, ${userId})
    WHERE id = ${followerId};
  `;
}

async function unfollowUser(followerId, userId) {
  // Unfollow the user
  await sql`
    UPDATE users
    SET followers = array_remove(followers, ${userId})
    WHERE id = ${followerId};
  `;
}
