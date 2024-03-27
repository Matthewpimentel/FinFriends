"use client"
import { useRef, useState } from 'react';
import { FaCamera } from "react-icons/fa6";
import Nav from "../nav";
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from "axios";
import imageCompression from 'browser-image-compression';
import { navigate } from '../actions/actions'
import ConfirmPostAdding from '../Components/ConfirmPostAdding';
import LoadingBar from '../Components/LoadingBar';

export default function CreatePost() {
    const fileInputRefs = useRef([null, null, null, null]);
    const [selectedImages, setSelectedImages] = useState([null, null, null, null]);
    const { user, error, isLoading } = useUser();
    const [description, setDescription] = useState("");
    const [selectedImages2, setSelectedImages2] = useState([null, null, null, null]);
    const [addPostLoading, setAddPostLoading] = useState(false);
    const [confirmPost, setConfirmPost] = useState(false)

    const handleCameraClick = (index) => {
        fileInputRefs.current[index].click();
    };

    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        
        try {
            const options = {
                maxSizeMB: 4.5, // Max size in megabytes
                maxWidthOrHeight: 1600, // Max width or height in pixels
                useWebWorker: true, // Use web worker for compression
            };
    
            const compressedFile = await imageCompression(file, options);
            const compressedImage = URL.createObjectURL(compressedFile);
    
            const updatedImages = [...selectedImages2];
            updatedImages[index] = compressedImage;
            setSelectedImages2(updatedImages);
    
            // Update selectedImages to hold the compressed file object
            const updatedFileImages = [...selectedImages];
            updatedFileImages[index] = compressedFile;
            setSelectedImages(updatedFileImages);
        } catch (error) {
            console.error('Error compressing image:', error);
        }
    };

    const addPost = async () => {
        setAddPostLoading(true);
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
                    }
                });
                
                // Send POST request with formData
                await axios.post("/api/add-post", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data" // Important for FormData
                    }
                });
                console.log('Post added successfully');
                setAddPostLoading(false);
                setConfirmPost(true);
                await sleep(2000);
                setConfirmPost(false);
                navigate();
            } catch (error) {
                console.error('Error adding post:', error.response);
            }
        }
    }

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    
    if (addPostLoading) return <LoadingBar/>
    if (confirmPost) return <ConfirmPostAdding/>
    return (
        <div className='mb-20'>
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
