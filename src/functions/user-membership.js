"use server";
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_CMS_PROJECT)
  .setKey(process.env.CMS_API_KEY);

const users = new sdk.Users(client);


export async function getUserMembership(userId) {
  try {
    // await users.get(userId);
    const response = await users.listMemberships(userId);
    const teamNames = response.memberships.map(membership => membership.teamName);
    const teamIds = response.memberships.map(membership => membership.teamId);
    const isMemberOfSuperAdmin = teamIds.includes(process.env.TeamIdSuperAdmin);
    const isMemberOfAdmin = teamIds.includes(process.env.TeamIdAdmin);
    const isMemberOfAdjuster = teamIds.includes(process.env.TeamIdAdjuster);
    return {
      teamNames,
      teamIds,
      isMemberOfSuperAdmin,
      isMemberOfAdmin,
      isMemberOfAdjuster
    };

  } catch (error) {
    if (error.code === 404 && error.message.includes('user_not_found')) {
      return { error: "User not found", message: error.message };
    } else {
      return { error: "Internal Server Error", message: error.message };
    }
  }
}