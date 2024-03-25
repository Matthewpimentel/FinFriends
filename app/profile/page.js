"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import Nav from '../nav';

export default function Profile({ searchParams }) {
    const { user, error, isLoading } = useUser();
    const [posts, setPosts] = useState([]);
    const [userInfo, setUserInfo] = useState(null); // Initialize userInfo as null

    useEffect(() => {
        const fetchPosts = async () => {
            if (!searchParams.userId) {
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
            }
            else {
                try {
                    const response = await axios.get("/api/get-other-user-posts", {
                        params: {
                            userId: searchParams.userId
                        },
                    });
                    setPosts(response.data.posts.rows);
                    setUserInfo(response.data.userInfo.rows);
                } catch (error) {
                    console.error('Error fetching posts:', error);
                }
            }
        };

        fetchPosts();

    }, []);

    console.log(userInfo)

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>{error.message}</div>;

    // Conditional rendering based on userInfo availability
    const profilePicture = userInfo ? userInfo[0].profilepicture : (user ? user.picture : '');
    const username = userInfo ? userInfo[0].username : (user ? user.nickname : '');
    const followersCount = userInfo ? userInfo[0].followers.length : '';
    const followingCount = userInfo ? userInfo[0].following.length : '';

    return (
        <div>
            <Nav />
            <div className='flex justify-center flex-col items-center v-screen'>

                <div className="flex justify-center">
                    <div className="flex flex-row items-center justify-center">
                        <div className='m-8'>
                            <img className="h-30 w-30 rounded-full" src={profilePicture} alt={username} />
                        </div>
                        <div>
                            <h1 className='mb-8'>{username}</h1>
                            <div className="flex flex-row items-center justify-center">
                                <h3 className='mr-12'>{posts.length} Posts</h3>
                                <h3 className='mr-12'>{`${followersCount} Followers`}</h3>
                                <h3 className='mr-12'>{`${followingCount} Following`}</h3>
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
        </div>
    );
}
