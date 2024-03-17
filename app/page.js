"use client"

import { useEffect } from 'react';
import Image from "next/image";
import Nav from "./nav";
import axios from "axios";
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user, error, isLoading } = useUser();

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
          console.error('Error adding profile:', error);
        }
      }
    };

    addProfile();
  }, [user]); // Call the effect whenever the user changes

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <main className="">
      <div className="">
        <Nav/>
        <h1>Main</h1>
      </div>
    </main>
  );
}
