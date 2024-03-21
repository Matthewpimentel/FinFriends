"use client"
import { useRef, useState } from 'react';
import { FaCamera } from "react-icons/fa6";
import Nav from "../nav";
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from "axios";

export default function CreatePost() {
    const fileInputRefs = useRef([null, null, null, null]);
    const [selectedImages, setSelectedImages] = useState([null, null, null, null]);
    const { user, error, isLoading } = useUser();
    const [description, setDescription] = useState("");
    const [selectedImages2, setSelectedImages2] = useState([null, null, null, null]);

    const handleCameraClick = (index) => {
        fileInputRefs.current[index].click();
    };

    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        const image = URL.createObjectURL(file);
        const updatedImages = [...selectedImages2];
        updatedImages[index] = image;
        setSelectedImages2(updatedImages);
    
        // Update selectedImages to hold the file object
        const updatedFileImages = [...selectedImages];
        updatedFileImages[index] = file;
        setSelectedImages(updatedFileImages);
    };

    const addPost = async () => {
        const formData = new FormData();
        if (user) {
            try {
                // Append email and description to formData
                formData.append("email", user.email);
                formData.append("description", description);
                
                // Append each image file to formData
                selectedImages.forEach((image, index) => {
                    if (image !== null) {
                        formData.append(`images`, image);
                        console.log(image);
                    }
                });
                
                // Send POST request with formData
                await axios.post("/api/add-post", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data" // Important for FormData
                    }
                });
                console.log('Post added successfully');
            } catch (error) {
                console.error('Error adding post:', error.response);
            }
        }
    }
    

    return (
        <div>
            <Nav />
            <input
                ref={el => fileInputRefs.current[0] = el}
                type="file"
                className='hidden'
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(0, e)}
            />
            <input
                ref={el => fileInputRefs.current[1] = el}
                type="file"
                className='hidden'
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(1, e)}
            />
            <input
                ref={el => fileInputRefs.current[2] = el}
                type="file"
                className='hidden'
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(2, e)}
            />
            <input
                ref={el => fileInputRefs.current[3] = el}
                type="file"c
                className='hidden'
                accept="image/*" // Only accept image files
                onChange={(e) => handleFileChange(3, e)}
            />
            <div className="flex justify-center items-center">
                <div className="flex flex-col md:flex-row">
                    {selectedImages2.map((image, index) => (
                        <div key={index} className="flex justify-center items-center border border-gray-800 rounded-lg p-4 mt-4 w-64 h-64 mr-4" onClick={() => handleCameraClick(index)}>
                            {image ? <img src={image} alt={`Image ${index}`} style={{ maxWidth: '100%', maxHeight: '100%' }} /> : <FaCamera size={70} color='' />}
                        </div>
                    ))}
                </div>
            </div>
            <div className="flex justify-center">
                <div className="flex flex-col">
                <input 
    className="mt-4 px-4 py-2 border border-gray-400 rounded-md placeholder-gray-500 text-black mb-4" 
    placeholder="Description" 
    value={description} // Add this line to ensure the input reflects the state value
    onChange={(e) => setDescription(e.target.value)}
/>
                    <button className='bg-gray-900 text-white rounded-md px-3 py-2 text-sm font-medium' onClick={addPost}>Post</button>
                </div>
            </div>
        </div>
    );
}
