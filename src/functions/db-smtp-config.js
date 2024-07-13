"use server";
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_CMS_PROJECT)
  .setKey(process.env.CMS_API_KEY);

const databases = new sdk.Databases(client);

export async function get_smtp_config() {
  try {
    const result = await databases.getDocument(
      process.env.DB_ID,
      process.env.DB_SMTP_COLLECTION,
      process.env.DB_SMTP_DOCUMENT,
      [] // queries (optional)
    );
    return result;
  } catch (e) {
    throw new Error();
  }
}
