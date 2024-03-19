'use client';

import { useUser } from '@auth0/nextjs-auth0/client';
import { useState } from 'react';
import Link from "next/link"

export default function Nav() {
    const { user, error, isLoading } = useUser();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMenu = () => {
        if(isMobileMenuOpen) {
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
            <div class="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div class="relative flex h-16 items-center justify-between">
                    <div class="absolute inset-y-0 left-0 flex items-center sm:hidden">
                        <button type="button" class="relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white" aria-controls="mobile-menu" aria-expanded="false">
                            <span class="absolute -inset-0.5" onClick={() => toggleMenu()}></span>
                            <span class="sr-only">Open main menu</span>
                            <svg class="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                            </svg>
                            <svg class="hidden h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
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
                                    <Link href="/profile" key="Profile">
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

            <div class="sm:hidden" id="mobile-menu">
                {isMobileMenuOpen ? <div class="space-y-1 px-2 pb-3 pt-2">
                    <a href="/" class="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Feed</a>
                </div> : <div></div>}

            </div>
        </nav>
    )
}