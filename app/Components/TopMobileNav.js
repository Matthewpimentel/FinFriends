import Search from "./Search";

const TopMobileNav = () => {
    return (
        <div className="md:hidden flex justify-between items-center">
            <img className="h-8 w-auto ml-2" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500" alt="Your Company" />
            <div className="flex-grow flex justify-center">
                <Search />
            </div>
        </div>
    );
};

export default TopMobileNav;
