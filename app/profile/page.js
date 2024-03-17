"use client"
import { useUser } from '@auth0/nextjs-auth0/client';

export default function Profile() {
    const { user, error, isLoading } = useUser();
    return(
        <h1>Profile</h1>
    )
}