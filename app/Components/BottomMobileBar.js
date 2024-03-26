import { GoHome } from 'react-icons/go';
import { CiSquarePlus } from "react-icons/ci";
import { CgProfile } from "react-icons/cg";
import Link from 'next/link';

const BottomMobileBar = () => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-gray-800 p-4 flex justify-evenly md:hidden">
    <Link href="/">
    <GoHome size={40} className="text-white" />
    </Link>
    <Link href="/createPost">
    <CiSquarePlus size={40} className="text-white" />
    </Link>
    <Link href="/profile">
    <CgProfile size={40} className="text-white" />
    </Link>
    </div>
  );
};

export default BottomMobileBar;
