"use client"
import Image from "next/image";
import Nav from "./nav";
import axios from "axios";
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Home() {
  const { user, error, isLoading } = useUser();
  if(user) {
    axios.post("/api/add-profile", {
      name: user.name,
      email: user.email
    })
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
