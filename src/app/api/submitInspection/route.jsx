import { NextResponse } from "next/server";
import { submitInspection } from "@/functions/submitInspection";

export async function POST(request) {
  try {
    // const user = localStorage.getItem("userData");
    const req = await request.json();
    // console.log("test: ", req)
    const currentuserId = await req.currentUser;
    console.log(currentuserId)
    // const localUserId = user.$id;
    if (!currentuserId) {
      return NextResponse.json({
        success: false,
        message: "User is not authorized",
        status: 401,
      });
    }
    const res = await submitInspection(req);
    if (res) {
      return NextResponse.json(res);
    }
  } catch (error) {
    console.error(`Error processing request:`, error);
    return NextResponse.json({ success: false, message: error.message });
  }
}
