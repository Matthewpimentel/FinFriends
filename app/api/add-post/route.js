import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { put } from "@vercel/blob";

export async function POST(request) {
    const { email, images, description } = await request.json(); // Parse JSON body
  
    try {
        if (!email || !images || !Array.isArray(images) || images.length === 0 || !description) {
            throw new Error('Email, description, and a non-empty array of images required');
        }
      
        // Generate image URLs and construct the imageurls array
        const imageurls = [];
        for (const image of images) {
            if (image === null) {
                continue; // Skip processing null images
            }
        
            // Generate a unique filename for the image based on current date and time
            const timestamp = new Date().toISOString().replace(/:/g, '-'); // Replace colons to make it safe for filenames
            const imageName = `${timestamp}`;
  
            await put(`${email}/${imageName}`, "test", { access: 'public' });
        
            // Add the image URL to the 'imageurls' array
            imageurls.push(`${email}/${imageName}`);
        }
      
        // Insert data into the 'posts' table with the constructed imageurls array
        const result = await sql`
            INSERT INTO posts (user_email, description, imageurls)
            VALUES (
                ${email},
                ${description},
                ${imageurls}
            )
            RETURNING id;
        `;
      
        return NextResponse.json({ success: true }, { status: 200 }); // Return success response
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 }); // Return error response
    }
}
