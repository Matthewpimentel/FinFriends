"use client"
import { useEffect } from 'react';
import Nav from "./nav";
import axios from "axios";
import { useUser } from '@auth0/nextjs-auth0/client';
import Feed from './Components/Feed';

export default function Home() {
  const { user, error, meta_data } = useUser();

  useEffect(() => {
    const addProfile = async () => {
      if (user) {
        try {
          await axios.post("/api/add-profile", {
            name: user.name,
            email: user.email,
            username: user.user_metadata.username, 
            profilepicture: user.picture
          });
          console.log('Profile added successfully');
        } catch (error) {
          console.error('Error adding profile:', error.response.data);
        }
      }
    };
    addProfile();
  }, [user]);
  
  return (
    <div>
      <Nav />
      <Feed/>
    </div>
  );
}
