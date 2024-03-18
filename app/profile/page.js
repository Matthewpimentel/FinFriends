"use client"

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import Nav from '../nav';

export default function Profile() {
    const { user, error, isLoading } = useUser();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                if (user && user.email) {
                    const response = await axios.get("/api/get-user-posts", {
                        params: {
                            email: user.email,
                        },
                    });
                    setPosts(response.data.posts.rows);
                }
            } catch (error) {
                console.error('Error fetching posts:', error.response.data);
            }
        };

        if (user && user.email) {
            fetchPosts();
        }
    }, [user]);

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    return (
        <div>
            <Nav />
            <div className='flex justify-center flex-col items-center v-screen'>

                <div className="flex justify-center">
                    <div className="flex flex-row items-center justify-center">
                        <div className='m-8'>
                            <img className="h-30 w-30 rounded-full" src={user.picture} alt={user.name} />
                        </div>
                        <div>
                            <h1 className='mb-8'>{user.nickname}</h1>
                            <div className="flex flex-row items-center justify-center">
                                <h3 className='mr-12'>{posts.length} Posts</h3>
                                <h3 className='mr-12'>321 Followers</h3>
                                <h3 className='mr-12'>325 Following</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='border-t-4 w-6/12 border-gray-800'>
                    <div className="grid grid-cols-3 justify-center">
                        {posts.map((post) => (
                            <div key={post.id} className="m-2">
                                <img
                                    src={post.imageurls[0]}
                                    className="h-96 w-96 object-cover rounded-lg" // Set fixed height and width
                                    alt={`Post Image ${post.id}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            {/* <h1 className="text-2xl font-bold mb-4">Profile</h1>
            <div className="mb-4">
                <h2 className="text-xl font-bold mb-2">User Information:</h2>
                {user && (
                    <ul>
                        <li className="mb-1">Name: {user.name}</li>
                        <li className="mb-1">Email: {user.email}</li>
                    </ul>
                )}
            </div>
            <div>
                <h2 className="text-xl font-bold mb-2">Posts:</h2>
                <ul>
                    {posts.map((post) => (
                        <li key={post.id} className="mb-4">
                            <p className="font-bold">Description: {post.description}</p>
                            <p className="font-bold">Image URLs:</p>
                            <ul>
                                {post.imageurls.map((imageUrl, index) => (
                                    <li key={index} className="mb-2">
                                        <img 
                                            src={imageUrl} 
                                            alt={`Post Image ${index}`} 
                                            className="w-48 h-auto rounded-lg shadow-md" // Tailwind CSS classes for image styling
                                        />
                                    </li>
                                ))}
                            </ul>
                        </li>
                    ))}
                </ul>
            </div> */}
        </div>
    );
}
