"use server";
const sdk = require("node-appwrite");

const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_CMS_PROJECT)
  .setKey(process.env.CMS_API_KEY);

const databases = new sdk.Databases(client);

export async function GetEmailTemplate(templateName) {
  try {
    const result = await databases.listDocuments(
      process.env.DB_ID,
      process.env.DB_EMAIL_TEMPLATE_COLLECTION,
      [
        sdk.Query.equal('template_name', templateName)
      ]
    );

    if (result.documents.length > 0) {
      return result.documents[0]; // Assuming there's only one document per templateName
    } else {
      throw new Error("Template not found");
    }
  } catch (e) {
    throw new Error(`Failed to fetch email template: ${e.message}`);
  }
}
