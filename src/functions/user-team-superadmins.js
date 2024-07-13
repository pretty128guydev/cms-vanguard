"use server";
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_CMS_PROJECT)
  .setKey(process.env.CMS_API_KEY);

const teams = new sdk.Teams(client);


export async function getSuperAdmins() {
  try {
    const result =  teams.listMemberships(process.env.TeamIdSuperAdmin);

    return result;

  } catch (error) {
    if (error.code === 404 && error.message.includes('user_not_found')) {
      return { error: "Team not found", message: error.message };
    } else {
      return { error: "Internal Server Error", message: error.message };
    }
  }
}
