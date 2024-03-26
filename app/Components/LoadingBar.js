import Search from "./Search";
import { IoFishOutline } from "react-icons/io5";

const LoadingBar = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
            <IoFishOutline size={70} className="animate-spin mb-4"/>
            <h1>Loading...</h1>
        </div>
    );
};

export default LoadingBar;
