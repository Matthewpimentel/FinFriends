"use client"
import { useEffect, useState } from 'react';
import Nav from "./nav";
import axios from "axios";
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaRegHeart, FaCircle } from "react-icons/fa6";
import { LuMessageSquare } from "react-icons/lu";


export default function Home() {
  const { user, error} = useUser();
  const [feed, setFeed] = useState([]);
  const [showComments, setShowComments] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);


  useEffect(() => {
    const addProfile = async () => {
      if (user) {
        try {
          await axios.post("/api/add-profile", {
            name: user.name,
            email: user.email
          });
          console.log('Profile added successfully');
        } catch (error) {
          console.error('Error adding profile:', error.response);
        }
      }
    };
  
    const getFeed = async () => {
      try {
        const response = await axios.get("/api/get-feed", {
          params: {
            email: user.email
          }
        });
        // Sort the posts in ascending order based on date_added
        const sortedFeed = response.data.posts.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
        setFeed(sortedFeed);
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    }
  
    addProfile();
    getFeed();
  }, [user]);

  const postComment = async (postId, commentText) => {
    setIsLoading(true);
    try{
      await axios.post("/api/add-comment", {
        email: user.email,
        commentText: commentText,
        postId: postId
      });
      setIsLoading(false);
      // Optionally, you can reset the commentText state after posting
      setCommentText('');
    } catch(error) {
      console.error('Error posting:', error.response);
      setIsLoading(false);
    }
  }

  const likePost = async (postId) => {
    try {
      await axios.post("/api/like-post", {
        postId: postId,
        email: user.email
      });
      setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]); // Add postId to likedPosts
    } catch (error) {
      console.error("Error liking:", error.response)
    }
  };

  const unlikePost = async (postId) => {
    try {
      await axios.post("/api/unlike-post", {
        postId: postId,
        email: user.email
      });
      setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId)); // Remove postId from likedPosts
    } catch (error) {
      console.error("Error unliking:", error.response)
    }
  };

  console.log(feed);

  function timeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const timeDifference = now - date;

    const minute = 60 * 1000;
    const hour = minute * 60;
    const day = hour * 24;
    const week = day * 7;

    if (timeDifference < minute) {
      const seconds = Math.floor(timeDifference / 1000);
      return seconds === 1 ? '1 second ago' : `${seconds} seconds ago`;
    } else if (timeDifference < hour) {
      const minutes = Math.floor(timeDifference / minute);
      return minutes === 1 ? '1 minute ago' : `${minutes} minutes ago`;
    } else if (timeDifference < day) {
      const hours = Math.floor(timeDifference / hour);
      return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
    } else if (timeDifference < week) {
      const days = Math.floor(timeDifference / day);
      return days === 1 ? '1 day ago' : `${days} days ago`;
    } else {
      const weeks = Math.floor(timeDifference / week);
      return weeks === 1 ? '1 week ago' : `${weeks} weeks ago`;
    }
  }

  function commentsToggle() {
    setShowComments(prevState => !prevState);
  }

  return (
    <main className="">
      <Nav />
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center items-center w-1/2 mx-auto'>
          {feed.map((post) => (
            <div key={post.id} className='flex flex-col w-7/12 border-b-2'>
              <div className='flex flex-row items-center'>
                <img src={post.profilepicture} className="h-12 w-12 rounded-full m-4" alt="Profile Picture" />
                <h1 className='rounded-full mr-2'>{post.name}</h1>
                <FaCircle size={5} />
                <h1 className='ml-2'>{timeAgo(post.date_added)}</h1>
              </div>
              <img src={post.imageurls[0]} className="h-96 w-full object-cover rounded-lg" alt="Post Image" />
              <div className='flex flex-row p-3 gap-6'>
              <FaRegHeart size={30} onClick={() => likedPosts.includes(post.id) ? unlikePost(post.id) : likePost(post.id)} className={likedPosts.includes(post.id) ? 'text-red-500 cursor-pointer' : 'cursor-pointer'} />

                <LuMessageSquare size={30} />
              </div>
              <div>
                <h1>{post.likes} likes</h1>
                <h1>
                  <span className="font-bold mr-2">{post.name}</span>
                  <span className="text-slate-200">{post.description}</span>
                </h1>
              </div>
              <div className='flex flex-col border-b-2'>
                <button onClick={commentsToggle}>View all {post.comments.length} comments</button>
                {showComments && post.comments.map((comment, index) => (
                  <div key={index} className='flex flex-col border-b-2'>
                    <div className='flex flex-row items-center'>
                      <img src={post.profilepicture} className="h-8 w-8 rounded-full m-4" alt="Profile Picture" />
                      <h1 className='font-bold mr-2'>{post.name}</h1>
                      <h1 className="text-slate-200">{comment.commentText}</h1>
                    </div>
                    <div className='flex flex-row items-center'>
                      <h2 className='mr-3'>{timeAgo(comment.timestamp)}</h2>
                      <h2 className='mr-3'>{comment.likes} likes</h2>
                      <h2>Reply</h2>
                    </div>
                  </div>
                ))}
                <div className='grid grid-cols-3 mb-4'>
                  <input placeholder='Add a comment...' value={commentText} onChange={e => setCommentText(e.target.value)} className='mr-1 col-span-2 text-black'></input>
                  <button type="button" className="bg-gray-800 cursor-pointer" disabled={isLoading} onClick={() => postComment(post.id, commentText)}>
                    <svg className={`animate-spin h-5 w-5 mr-3 ${isLoading ? 'inline-block' : 'hidden'}`} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.014 8.014 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLoading ? 'Posting...' : 'Post'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
