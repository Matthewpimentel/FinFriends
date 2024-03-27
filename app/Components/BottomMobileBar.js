import { GoHome } from 'react-icons/go';
import { CiSquarePlus } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';
import { useUser } from '@auth0/nextjs-auth0/client';

const BottomMobileBar = () => {
    const { user, error, isLoading } = useUser();
    return (
        <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-evenly md:hidden">
            <Link href="/">
                <GoHome size={40} className="text-white" />
            </Link>
            <Link href="/createPost">
                <CiSquarePlus size={40} className="text-white" />
            </Link>
            {user ? <Link href="/profile">
                <CgProfile size={40} className="text-white" />
            </Link> : <Link href="/api/auth/login">
                <CgProfile size={40} className="text-white" />
            </Link>}

        </div>
    );
};

export default BottomMobileBar;
