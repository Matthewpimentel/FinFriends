import Search from "./Search";
import { IoFishOutline } from "react-icons/io5";
const TopMobileNav = () => {
    return (
        <div className="md:hidden flex justify-between items-center">
            <IoFishOutline size={35} className="ml-4"/>
            <div className="flex-grow flex justify-center">
                <Search/>
            </div>
        </div>
    );
};

export default TopMobileNav;
