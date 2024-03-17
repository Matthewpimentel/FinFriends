"use client"

import { useState } from 'react';
import axios from 'axios'; // Import axios for making HTTP requests

import { useUser } from '@auth0/nextjs-auth0/client';

export default function ProfileClient() {
  const { user, error, isLoading } = useUser();
  const [response, setResponse] = useState(null);

  const handleButtonClick = async () => {
    try {
      const { data } = await axios.post('/api/post-profile', { user }); // Make a POST request to your API route
      setResponse(data); // Set the response from the server
    } catch (error) {
      console.error('Error:', error); // Log any errors
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <div>
      {user && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <button onClick={handleButtonClick}>Save Profile</button> {/* Add a button to trigger the POST request */}
        </div>
      )}
      {response && <div>Response from server: {JSON.stringify(response)}</div>} {/* Display the response from the server */}
    </div>
  );
}
