'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import LoadingBar from '../Components/LoadingBar';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <LoadingBar/>;
  if (error) return <div>{error.message}</div>;

  return (
    user && (
      <div>
        <img src={user.picture} alt={user.name} />
        <h2>{user.name}</h2>
        <p>{user.email}</p>
      </div>
    )
  );
}