"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import { list } from '@vercel/blob';

export default function Profile() {
    const { user, error, isLoading } = useUser();
    const [posts, setPosts] = useState([]);

    async function getBlobs() {
        const {
            folders: [firstFolder],
            blobs: rootBlobs,
          } = await list({ mode: 'folded' });
           
          const { folders, blobs } = await list({ mode: 'folded', prefix: "test" });
          console.log(folders);
    }

    const test = getBlobs();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                // Make sure the user is authenticated before making the request
                if (user && user.email) {
                    const response = await axios.get("/api/get-user-posts", {
                        params: {
                            email: user.email,
                        },
                    });
                    setPosts(response.data.posts.rows);
                    console.log(response.data.posts.rows[0].imageurls[0])
                }
            } catch (error) {
                console.error('Error fetching posts:', error.response.data);
            }
        };
    
        // Call fetchPosts only if user and user.email are defined
        if (user && user.email) {
            fetchPosts();
        }
    }, [user]);
    

    return (
        <div>
            <h1>Profile</h1>
            <h2>User Information:</h2>
            {user && (
                <ul>
                    <li>Name: {user.name}</li>
                    <li>Email: {user.email}</li>
                </ul>
            )}
            <h2>Posts:</h2>
            <ul>
                {posts.map((post) => (
                    <li key={post.id}>
                        <p>Description: {post.description}</p>
                        <p>Image URLs:</p>
                        <ul>
                            <li>{post.imageurls[0]}</li>
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
}
