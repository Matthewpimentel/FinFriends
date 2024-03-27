import { CiCircleCheck } from "react-icons/ci";

const ConfirmPostAdding = () => {
    return (
        <div className="flex flex-col items-center justify-center h-screen overflow-hidden">
            <CiCircleCheck size={70}/>
            <h1>Post has been added!</h1>
        </div>
    );
};

export default ConfirmPostAdding;
