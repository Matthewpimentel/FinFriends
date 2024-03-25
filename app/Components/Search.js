import React, { useState } from 'react';
import { useRouter } from 'next/navigation'
import axios from 'axios';
import Link from 'next/link';
const Search = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);

    const router = useRouter()

    const handleSearch = async (query) => {
        setSearchQuery(query); // Update search query state

        try {
            const response = await axios.get(`/api/search-users`, {
                params: {
                    query: searchQuery
                }
            })
            setSearchResults(response.data.users);
            console.log(searchResults);
        } catch (error) {
            console.error('Error searching for users:', error.response);
        }
    };
    return (
        <div>
            <input
                type="text"
                placeholder="Search by username"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                className='mr-1 col-span-2 text-black'
            />

            {/* Display search results */}
            <div className='flex fixed  bg-gray-800 w-3/12'>
                <ul>
                    {searchResults.map(user => (
                        <Link href={{
                            pathname: "/profile",
                            query: {
                                userId: user.id
                            },
                        }}>
                            <div key={user.id} className='flex flex-row items-center cursor-pointer mt-2'>
                                <img className='rounded-full m-2 md:h-10 md:w-10" alt="Profile Picture' src={user.profilepicture} />
                                <li>{user.username}</li>
                            </div>
                        </Link>
                    ))}
                </ul>
            </div>
        </div>
    );
}


export default Search;