"use client"
import { useRef, useState } from 'react';
import { FaCamera } from "react-icons/fa6";
import Nav from "../nav";

export default function CreatePost() {
    const fileInputRefs = useRef([null, null, null, null]);
    const [selectedImages, setSelectedImages] = useState([null, null, null, null]);

    const handleCameraClick = (index) => {
        fileInputRefs.current[index].click();
    };

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        const image = URL.createObjectURL(file);
        const updatedImages = [...selectedImages];
        updatedImages[index] = image;
        setSelectedImages(updatedImages);
    };

    return (
        <div>
            <Nav />
            <input
                ref={el => fileInputRefs.current[0] = el}
                type="file"
                style={{ display: 'none' }}
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(0, e)}
            />
            <input
                ref={el => fileInputRefs.current[1] = el}
                type="file"
                style={{ display: 'none' }}
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(1, e)}
            />
            <input
                ref={el => fileInputRefs.current[2] = el}
                type="file"
                style={{ display: 'none' }}
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(2, e)}
            />
            <input
                ref={el => fileInputRefs.current[3] = el}
                type="file"
                style={{ display: 'none' }}
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(3, e)}
            />
            <div className="flex justify-center">
                <div className="flex flex-row">
                    {selectedImages.map((image, index) => (
                        <div key={index} className="flex justify-center items-center border border-gray-800 rounded-lg p-4 mt-4 w-64 h-64 mr-4" onClick={() => handleCameraClick(index)}>
                            {image ? <img src={image} alt={`Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <FaCamera size={70} color='' />}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col">
                    <input className="mt-4 px-4 py-2 border border-gray-400 rounded-md placeholder-gray-500 text-black" placeholder="Description" />
                    <button className='bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium'>Post</button>
                </div>
            </div>
        </div>
    );
}
