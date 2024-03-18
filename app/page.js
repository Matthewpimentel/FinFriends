"use client"
import { useEffect, useState } from 'react';
import Nav from "./nav";
import axios from "axios";
import { useUser } from '@auth0/nextjs-auth0/client';
import { FaRegHeart, FaCircle } from "react-icons/fa6";
import { LuMessageSquare } from "react-icons/lu";


export default function Home() {
  const { user, error, isLoading } = useUser();
  const [feed, setFeed] = useState([]);

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
        setFeed(response.data.posts);
      }
      catch (error) {
        console.error('Error fetching feed:', error);
      }
    }

    addProfile();
    getFeed();
  }, [user]); // Call the effect whenever the user changes

  console.log()
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

  console.log(feed);
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
                <FaCircle size={5}/>
                <h1 className='ml-2'>{timeAgo(post.date_added)}</h1>
              </div>
              <img src={post.imageurls[0]} className="h-96 w-full object-cover rounded-lg" alt="Post Image" />
              <div className='flex flex-row p-3 gap-6'>
                <FaRegHeart size={30} />
                <LuMessageSquare size={30} />
              </div>
              <div>
                <h1>{post.likes} likes</h1>
                <h1>
                  <span className="font-bold mr-2">{post.name}</span>
                  <span className="text-slate-200">{post.description}</span>
                </h1>
              </div>
              <div>
                <h2>View all {post.comments.length} comments</h2>
                <h2>Add a comment...</h2>
                </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );

}
