import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';

const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const router = useRouter();

    const handleSearch = async (e) => {
        const query = e.target.value.trim(); // Trim whitespace from the query
        setSearchQuery(query); // Update search query state
    
        // Only make the API request if the search query is not empty
        if (query) {
            try {
                const response = await axios.get(`/api/search-users`, {
                    params: {
                        query: query
                    }
                });
                setSearchResults(response.data.users);
            } catch (error) {
                console.error('Error searching for users:', error.response);
            }
        } else {
            setSearchResults([]); // Clear search results if the query is empty
        }
    };
    

    return (
        <div>
            <input
                type="text"
                placeholder="Search by username"
                value={searchQuery}
                onChange={handleSearch} // Pass the event handler directly
                className='mr-1 col-span-2 text-black'
            />

            {/* Display search results */}
            {searchResults.length > 0 && (
                <div className='flex fixed z-10 bg-gray-900 w-full md:w-1/4 border border-gray-800 md:mt-5'>
                    <ul>
                        {searchResults.map(user => (
                            <Link key={user.id} href={{
                                pathname: "/profile",
                                query: {
                                    userId: user.id
                                },
                            }}>
                                <div key={user.id} className='flex flex-row items-center cursor-pointer mt-2 block'>
                                    <img className='rounded-full m-2 h-8 h-10 w-10" alt="Profile Picture' src={user.profilepicture} />
                                    <li>{user.username}</li>
                                </div>
                            </Link>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Search;
