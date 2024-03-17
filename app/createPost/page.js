"use client"
import { useRef, useState } from 'react';
import { FaCamera } from "react-icons/fa6";
import Nav from "../nav";
import { useUser } from '@auth0/nextjs-auth0/client';
import axios from "axios";

export default function CreatePost() {
    const fileInputRefs = useRef([null, null, null, null]);
    const [selectedImages, setSelectedImages] = useState([null, null, null, null]);
    const [selectedImagesBlob, setSelectedImagesBlob] = useState([null, null, null, null]);
    const { user, error, isLoading } = useUser();
    const [description, setDescription] = useState("");

    const handleCameraClick = (index) => {
        fileInputRefs.current[index].click();
    };

    const handleFileChange = async (index, event) => {
        const file = event.target.files[0];
        const image = URL.createObjectURL(file);
        const updatedImages = [...selectedImages];
        updatedImages[index] = image;
        const updatedImagesBlob = [...selectedImagesBlob]; // Should be [...selectedImages]
        const blob = await fileToBlob(file);
        updatedImagesBlob[index] = blob;
        setSelectedImages(updatedImages);
        setSelectedImagesBlob(updatedImagesBlob);
        console.log(selectedImagesBlob);
    };

    // Function to convert File to Blob
    const fileToBlob = async (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
                const blob = new Blob([reader.result], { type: file.type });
                resolve(blob);
            };
            reader.onerror = reject;
            reader.readAsArrayBuffer(file);
        });
    };

    const addPost = async () => {
        if (user) {
            try {
                console.log("Email:", user.email);
                console.log("Images:", selectedImagesBlob);
                console.log("Description:", description); // Check if description is correct

                await axios.post("/api/add-post", {
                    email: user.email,
                    images: selectedImagesBlob,
                    description: description // Pass the correct description value
                });
                console.log('post added successfully');
            } catch (error) {
                console.error('Error adding post:', error.response.data);
            }
        }
    }


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
                    <input
                        className="mt-4 px-4 py-2 border border-gray-400 rounded-md placeholder-gray-500 text-black"
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
