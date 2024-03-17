import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';
import { put } from "@vercel/blob";

export async function POST(request) {
    const formData = await request.formData(); // Parse FormData
    const email = formData.get('email');
    const description = formData.get('description');
    const images = formData.getAll('images'); // Get all uploaded images

    try {
        if (!email || !images || images.length === 0 || !description) {
            throw new Error('Email, description, and at least one image required');
        }

        // Generate image URLs and construct the imageurls array
        const imageurls = [];
        for (const image of images) {
                const uploadedFile = await put(`${email}/${image.name}`, image, { access: 'public' });
                const imageUrl = uploadedFile.url; // Assuming put returns an object with url property
                imageurls.push(imageUrl); // Push URL to the array
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

// Update config to handle FormData
export const config = {
    api: {
        bodyParser: false, // Disable default bodyParser
    },
};
