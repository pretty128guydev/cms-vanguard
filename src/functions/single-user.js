"use server";
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_CMS_PROJECT)
  .setKey(process.env.CMS_API_KEY);

const users = new sdk.Users(client);

export async function getUserDetails(userId) {
  try {
    const user = await users.get(userId);
    return user;
  } catch (error) {
    if (error.code === 404 && error.message.includes('user_not_found')) {
      return { error: "User not found", message: error.message };
    } else {
      return { error: "Internal Server Error", message: error.message };
    }
  }
}
