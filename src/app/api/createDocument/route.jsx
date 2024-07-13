"use server"
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { data } = await request.json();

    const response = await fetch('https://cms.itexpertnow.com/v1/databases/661048540018600185de/collections/6670c5f5000d52236340/documents', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Appwrite-Project': '6610481f003bf0704275',
        'X-Appwrite-Key': '23360d3be1ed6cc874341c8cb49daab3075ba9a62c95f34bfea1c7d4e91107921a1729756c1f15df2d4f6d7b6d8190c5a76654ad03a7f5075ed04a72ebdd0babde6f527195389e76d33a5a290e464f4072386047cac6977bd8c5e48621ce0c931eb4c454ffd96db809aa9aa0f47ded9b94d68d480d96e6a093190a0608e873bf',
      },
      body: JSON.stringify({
        documentId: 'unique()', // or any unique ID logic
        data: data,
      }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to create document');
    }

    return NextResponse.json({ success: true, documentId: result.$id, result });
  } catch (error) {
    console.error("Error creating document:", error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
