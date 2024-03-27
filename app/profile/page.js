"use client"
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useUser } from '@auth0/nextjs-auth0/client';
import Nav from '../nav';
import LoadingBar from '../Components/LoadingBar';
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

export default function Profile() {
    const { user, error, isLoading } = useUser();
    const [posts, setPosts] = useState([]);
    const [userInfo, setUserInfo] = useState(null); // Initialize userInfo as null
    const [userId, setUserId] = useState();
    const searchParams = useSearchParams();

    useEffect(() => {
        if(user) {
            getUserId();
        }
            fetchPosts();
    }, [user, searchParams]);

    const fetchPosts = async () => {
        let search;
        if (searchParams) {
            search = searchParams.get("userId");
        }
        if (!search) {
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
        } else {
            try {
                const response = await axios.get("/api/get-other-user-posts", {
                    params: {
                        userId: search
                    },
                });
                setPosts(response.data.posts.rows);
                setUserInfo(response.data.userInfo.rows);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
    };

    const getUserId = async () => {
        const response = await axios.get("/api/get-user-id", {
            params: {
                username: user.user_metadata.username
            }
        });
        setUserId(response.data);
        return response;
    }

    const getUserIdAndFollow = async () => {
        let search;
        if (searchParams) {
            search = searchParams.get("userId");
        }
        try {
            await axios.post("/api/follow-user", {
                followerId: search,
                userId: userId.userId // Use the response data directly
            });
        } catch(error) {
            console.error("Error following/unfollowing", error);
        }
        fetchPosts();
    };

    if (isLoading) return <LoadingBar/>;
    if (error) return <div>{error ? error.message : 'User not found'}</div>;

    // Conditional rendering based on userInfo availability
    const profilePicture = userInfo ? userInfo[0].profilepicture : (user ? user.picture : '');
    const username = userInfo ? userInfo[0].username : (user ? user.nickname : '');
    const followersCount = userInfo && userInfo[0]?.followers ? userInfo[0].followers.length : 0;
    const followingCount = userInfo && userInfo[0]?.following ? userInfo[0].following.length : 0;

    const followButton = userInfo && userId ? (
        userInfo[0]?.followers?.includes(userId.userId) ? ( // Check if the logged-in user is already following
            <button className="bg-gray-900 text-white px-1 py-1 rounded-md md:px-3 md:py-2 text-sm font-medium" onClick={(e) => getUserIdAndFollow()}>Unfollow</button>
        ) : (
            <button className="bg-gray-900 text-white px-1 py-1 rounded-md md:px-3 md:py-2 text-sm font-medium" onClick={(e) => getUserIdAndFollow()}>Follow</button>
        )
    ) : null;
    
    return (
        <div>
            <Nav />
            <Suspense fallback={<LoadingBar />}>
            <div className='flex justify-center flex-col items-center v-screen'>
                <div className="flex justify-center">
                    <div className="flex flex-row items-center justify-center">
                        <div className='m-2'>
                            <img className="h-8 w-8  md:h-32 md:w-32 md:mr-4 rounded-full" src={profilePicture} alt={username} />
                        </div>
                        <div>
                            <div className='flex flex-row items-center'>
                                <h1 className='text-base md:text-lg mr-2'>{username}</h1>
                                {followButton}
                            </div>
                            <div className="flex flex-row items-center justify-center">
                                <h3 className='mr-2 text-xs md:text-base'>{posts.length} Posts</h3>
                                <h3 className='mr-2 text-xs md:text-base'>{`${followersCount} Followers`}</h3>
                                <h3 className='mr-2 text-xs md:text-base'>{`${followingCount} Following`}</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='border-t-4 w-11/12 md:w-6/12 border-gray-800'>
                    <div className="grid grid-cols-2 md:grid-cols-3 justify-center">
                        {posts.map((post) => (
                            <div key={post.id} className="m-2">
                                <img
                                    src={post.imageurls[0]}
                                    className="md:h-96 md:w-96 h-32 w-32 object-cover rounded-lg" // Set fixed height and width
                                    alt={`Post Image ${post.id}`}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
            </Suspense>
        </div>
    );
}
