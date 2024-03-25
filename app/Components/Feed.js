"use client"
import { useEffect, useState } from 'react';
import axios from "axios";
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaRegHeart, FaCircle } from "react-icons/fa6";
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { Carousel } from 'react-responsive-carousel';
import Link from 'next/link';


const Feed = () => {
  const { user, error } = useUser();
  const [feed, setFeed] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [likedPosts, setLikedPosts] = useState([]);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const [showComments, setShowComments] = useState({});
  const [userId, setUserId] = useState();

  useEffect(() => {

    getFeed();
  }, []);

  const getFeed = async () => {
    if (user) {
      try {
        const response = await axios.get("/api/get-feed", {
          params: {
            email: user.email
          }
        });

        const { userId, posts } = response.data; // Extract userId from response

        const sortedFeed = posts.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
        setFeed(sortedFeed);
        // Initialize showComments state for each post
        const initialShowCommentsState = {};
        sortedFeed.forEach(post => {
          initialShowCommentsState[post.id] = false;
        });
        setShowComments(initialShowCommentsState);

        // Now you have access to userId
        setUserId(userId);
      } catch (error) {
        console.error('Error fetching feed:', error);
      }
    } else {
      try {
        const response = await axios.get("/api/get-no-user-feed");
        const { posts } = response.data; // Extract posts from response

        const sortedFeed = posts.sort((a, b) => new Date(b.date_added) - new Date(a.date_added));
        setFeed(sortedFeed);

        // Initialize showComments state for each post
        const initialShowCommentsState = {};
        sortedFeed.forEach(post => {
          initialShowCommentsState[post.id] = false;
        });
        setShowComments(initialShowCommentsState);

        // If the user is not logged in, you may handle it differently, such as displaying a message or redirecting to a login page
      } catch (error) {
        console.error('Error fetching all posts:', error);
      }
    }
  }
  const postComment = async (postId, commentText) => {
    setIsLoading(true);
    try {
      await axios.post("/api/add-comment", {
        email: user.email,
        commentText: commentText,
        postId: postId
      });
      setIsLoading(false);
      setCommentText('');
      getFeed();
    } catch (error) {
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
      setLikedPosts(prevLikedPosts => [...prevLikedPosts, postId]);
    } catch (error) {
      console.error("Error liking:", error.response)
    }
    getFeed();
  };

  const unlikePost = async (postId) => {
    try {
      await axios.post("/api/unlike-post", {
        postId: postId,
        email: user.email
      });
      setLikedPosts(prevLikedPosts => prevLikedPosts.filter(id => id !== postId));
    } catch (error) {
      console.error("Error unliking:", error.response)
    }
    getFeed();
  };

  const followUser = async (followerId) => {
    try {
      await axios.post("/api/follow-user", {
        followerId: followerId,
        userId: userId
      });
    } catch (error) {
      console.error("Error following/unfollowing", error.response)
    }
    getFeed();
  }

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

  function commentsToggle(postId) {
    setShowComments(prevState => ({
      ...prevState,
      [postId]: !prevState[postId]
    }));
  }

  function truncateDescription(description, limit) {
    const words = description.split(' ');
    if (words.length > limit) {
      return words.slice(0, limit).join(' ') + ' '; // Add space at the end
    }
    return description;
  }

  const toggleDescription = () => {
    setShowFullDescription(!showFullDescription);
  };

  console.log(feed);

  return (
    <main className="">
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col justify-center items-center '>
          {feed.map((post) => (
            <div key={post.id} className='flex flex-col w-11/12 md:w-7/12 max-w-4xl bg-gray-800 p-2 mb-4 mt-4 rounded'>

              <div className='flex flex-row items-center'>
                <Link href={{
                  pathname: "/profile",
                  query: {
                    userId: post.user_id
                  },
                }}>
                  <div className='flex items-center'>
                    <img src={post.profilepicture} className="h-6 w-6 rounded-full m-2 md:h-10 md:w-10" alt="Profile Picture" />
                    <h1 className='rounded-full w-2/6 mr-1 text-xs md:text-base'>{post.username}</h1>
                  </div>
                </Link>
                <FaCircle size={5} />
                <h1 className='ml-1 mr-1 text-xs w-2/6 md:text-base'>{timeAgo(post.date_added)}</h1>
                {user && (post.followers.includes(userId) ?
                  <button className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" onClick={e => followUser(post.user_id)}>Following</button> :
                  <button className="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" onClick={e => followUser(post.user_id)}>Follow</button>
                )}
              </div>
              <Carousel showStatus={false} showThumbs={false}>
                {post.imageurls.map((image, index) => (
                  <div key={index} className="w-full h-4/5 flex items-center justify-center">
                    <img src={image} className="object-contai max-h-full max-w-full" />
                  </div>
                ))}
              </Carousel>
              <div className='flex flex-row p-2'>
                {user && <FaRegHeart
                  onClick={() => likedPosts.includes(post.id) ? unlikePost(post.id) : likePost(post.id)}
                  className={(likedPosts.includes(post.id) || (post.likes && post.likes.includes(user.email))) ? 'text-red-500 cursor-pointer text-xl md:text-2xl' : 'text-xl md:text-2xl cursor-pointer'}
                />}
              </div>
              <div>
                <h1 className='text-sm md:text-base'>{post.likes ? post.likes.length : 0} likes</h1>
                <h1>
                  <span className="font-bold mr-2 text-sm md:text-base">{post.username}</span>
                  {/* Render truncated or full description based on showFullDescription state */}
                  <span className={`text-slate-200 text-xs md:text-base`}>
                    {truncateDescription(post.description, 15)}
                    <span className={`text-slate-200 transition-opacity duration-500 ${showFullDescription ? 'opacity-100' : 'opacity-0'} `}>
                      {showFullDescription ? post.description : <span></span>}
                    </span>
                    {post.description.split(' ').length > 15 && (
                      <button onClick={toggleDescription} className="text-purple ml-1 focus:outline-none text-base md:text-lg">
                        {showFullDescription ? '...less' : '...more'}
                      </button>
                    )}
                  </span>
                </h1>
              </div>
              <div className='flex flex-col '>
                <button onClick={() => commentsToggle(post.id)} className='text-xs md:text-base'>View all {post.comments.length} comments</button>
                {showComments[post.id] && post.comments.map((comment, index) => (
                  <div key={index} className='flex flex-col border-b-2'>
                    <div className='flex flex-row items-center'>
                    <Link href={{
                  pathname: "/profile",
                  query: {
                    userId: comment.commenterId
                  },
                }}>
                      <div className='flex items-center'>
                      <img src={comment.commenter.profilepicture} className="h-8 w-8 rounded-full m-4" alt="Profile Picture" />
                      <h1 className='font-bold mr-2'>{comment.commenter.username}</h1>
                        </div>
                      </Link>
                      <h1 className="text-slate-200">{comment.commentText}</h1>
                    </div>
                    <div className='flex flex-row items-center'>
                      <h2 className='mr-3'>{timeAgo(comment.timestamp)}</h2>
                    </div>
                  </div>
                ))}
                <div className='grid grid-cols-3 mb-4'>
                  {user && <input placeholder='Add a comment...' value={commentText} onChange={e => setCommentText(e.target.value)} className='mr-1 col-span-2 text-black'></input>}
                  {user && <button type="button" className="bg-purple cursor-pointer" disabled={isLoading} onClick={() => postComment(post.id, commentText)}>
                    <svg className={`animate-spin h-5 w-5 mr-3 ${isLoading ? 'inline-block' : 'hidden'}`} viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.014 8.014 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {isLoading ? 'Posting...' : 'Post'}
                  </button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}

export default Feed;