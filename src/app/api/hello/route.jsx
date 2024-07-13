import { NextResponse } from 'next/server';

// Handle GET request
export async function GET(request) {
  // You can use request.query or request.params to get query parameters if needed
  const queryParams = new URL(request.url).searchParams;
  const name = queryParams.get('name') || 'World';
  
  return NextResponse.json({ message: `Hello, ${name}!` });
}

// Handle POST request
export async function POST(request) {
  try {
    const data = await request.json();
    console.log("Received data:", data);
    
    // Process the data as needed
    return NextResponse.json({ success: true, message: 'Data received successfully!', data });
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json({ success: false, message: 'Error processing request.' });
  }
}
