'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import Link from "next/link"
import Search from './Components/Search';
import { useRouter } from 'next/navigation';
import { GoHome } from "react-icons/go";
import BottomMobileBar from './Components/BottomMobileBar';
import TopMobileNav from './Components/TopMobileNav';


export default function Nav() {
    const { user, error, isLoading } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const router = useRouter();
    const handleRefresh = () => {
        router.reload();
    };

    const toggleMenu = () => {
        if (isMobileMenuOpen) {
            setIsMobileMenuOpen(false)
        }
        else {
            setIsMobileMenuOpen(true);
        }
    }

    if (isLoading) return <div className='flex justify-center items-center'>Loading...</div>;
    if (error) return <div>{error.message}</div>;
    return (
        <nav class="bg-gray-800">
            <div className="">
                <TopMobileNav/>
            </div>
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8 hidden md:block">
                <div class="relative flex h-16 items-center justify-between">
                    <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                    </div>
                    <div class="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div class="flex flex-shrink-0 items-center">
                            <img class="h-8 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
                        </div>
                        <div class="hidden sm:ml-6 sm:block">
                            <div class="flex space-x-4">
                                <a href="/" class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium" aria-current="page">Feed</a>
                            </div>
                        </div>
                    </div>
                    <div>
                        <Search />
                    </div>
                    <div class="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                        <Link href="/createPost">
                            {user ? (
                                <button type='button' class="bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium">
                                    Post
                                </button>
                            ) : (
                                <div></div>
                            )
                            }
                        </Link>
                        <div class="relative ml-3">
                            <div>
                                <div>
                                    <button
                                        type="button"
                                        className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                                        id="user-menu-button"
                                        aria-expanded={isMenuOpen}
                                        aria-haspopup="true"
                                        onMouseEnter={() => setIsMenuOpen(true)}
                                        onMouseLeave={() => setIsMenuOpen(false)}
                                    >
                                        <span className="absolute -inset-1.5"></span>
                                        <span className="sr-only">Open user menu</span>
                                        {user ? (
                                            <img className="h-8 w-8 rounded-full" src={user.picture} alt={user.name} />
                                        ) : (
                                            <img className="h-8 w-8 rounded-full" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {user ? (
                                <div
                                    className={`absolute right-0 z-10 mt-1 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-200 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                                        }`}
                                    onMouseEnter={() => setIsMenuOpen(true)}
                                    onMouseLeave={() => setIsMenuOpen(false)}
                                >
                                    <Link href="/profile" key="Profile" onClick={() => handleRefresh()}>
                                        <p className="block px-4 py-2 text-sm text-gray-700 " role="menuitem" tabIndex="-1" id="user-menu-item-1">Your Profile</p>
                                    </Link>
                                    <Link href="/api/auth/logout">
                                        <p className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign out</p>
                                    </Link>
                                </div>
                            ) : (
                                <div
                                    className={`absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none transition-opacity duration-200 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
                                        }`}
                                    onMouseEnter={() => setIsMenuOpen(true)}
                                    onMouseLeave={() => setIsMenuOpen(false)}
                                >
                                    <Link href="/api/auth/login">
                                        <p className="block px-4 py-2 text-sm text-gray-700" role="menuitem" tabIndex="-1" id="user-menu-item-2">Sign in</p>
                                    </Link>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
            <BottomMobileBar/>
        </nav>
    )
}