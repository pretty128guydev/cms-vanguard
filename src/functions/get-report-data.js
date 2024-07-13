"use server";
const sdk = require("node-appwrite");

// Initialize the Appwrite client
const client = new sdk.Client()
  .setEndpoint(process.env.NEXT_PUBLIC_CMS_ENDPOINT)
  .setProject(process.env.NEXT_PUBLIC_CMS_PROJECT)
  .setKey(process.env.CMS_API_KEY);

// Initialize the Databases service
const databases = new sdk.Databases(client);

/**
 * Retrieve attributes from a specified collection.
 *
 * @param {string} collectionID - The ID of the collection to retrieve attributes from.
 * @returns {Promise<Object>} The result containing the attributes.
 */
async function getAttributes(collectionID) {
  try {
    const result = await databases.listDocuments(
      process.env.DB_ID,
      collectionID,
      [
        sdk.Query.limit(100),
        sdk.Query.orderAsc("FieldName"),
        sdk.Query.select(["FieldName", "TemplateTag"]),
        sdk.Query.notEqual("TemplateTag", ["null"]),
      ]
    );
    return result;
  } catch (e) {
    throw new Error("Failed to get attributes");
  }
}

/**
 * Retrieve a document by its ID from a specified collection.
 *
 * @param {string} documentID - The ID of the document to retrieve.
 * @param {string} collectionID - The ID of the collection containing the document.
 * @param {Array<string>} selectQuery - The fields to select in the document.
 * @returns {Promise<Object>} The result containing the document.
 */
async function GetDocumentById(documentID, collectionID, selectQuery) {
  try {
    const result = await databases.getDocument(
      process.env.DB_ID,
      collectionID,
      documentID,
      [sdk.Query.select(selectQuery)]
    );
    return result;
  } catch (e) {
    throw new Error("Failed to get document by ID");
  }
}

/**
 * Generate an admin report by combining tags and data.
 *
 * @param {Object} tags - The tags to be used in the report.
 * @param {Object} data - The data to be included in the report.
 * @returns {Array<Object>} The generated admin report.
 */
const generateAdminReport = (tags, data) => {
  return tags.documents.map((tag) => ({
    FieldName: tag.FieldName,
    TemplateTag: tag.TemplateTag,
    Data: data[tag.FieldName] !== undefined ? data[tag.FieldName] : null,
  }));
};

/**
 * Combine two reports, giving priority to entries from the adjuster report.
 *
 * @param {Array<Object>} adminReport - The admin report to be combined.
 * @param {Array<Object>} adjusterReport - The adjuster report to be combined.
 * @returns {Array<Object>} The combined report.
 */
const combineReports = (adminReport, adjusterReport) => {
  const reportMap = new Map();

  // Add entries from adminReport
  adminReport.forEach((entry) => {
    reportMap.set(entry.FieldName, entry);
  });

  // Add entries from adjusterReport, overwriting any duplicates
  adjusterReport.forEach((entry) => {
    reportMap.set(entry.FieldName, entry);
  });

  // Convert the map back to an array
  return Array.from(reportMap.values());
};

/**
 * Retrieve and combine report data for a specified document.
 *
 * @param {string} documentID - The ID of the document to retrieve report data for.
 * @returns {Promise<Array<Object>>} The combined report data.
 */
export async function getReportData(documentID) {
  try {
    // Get the data from the admin
    const adminTags = await getAttributes(
      process.env.NEXT_PUBLIC_VNG_FORM_QUESTIONS_ADMIN
    );
    const selectAdmin = adminTags.documents.map((doc) => doc.FieldName);
    const adminData = await GetDocumentById(
      documentID,
      process.env.NEXT_PUBLIC_VNG_CLAIMS,
      selectAdmin
    );
    const adminReport = generateAdminReport(adminTags, adminData);

    // Get the data from the adjuster
    const adjusterTags = await getAttributes(
      process.env.NEXT_PUBLIC_VNG_FORM_QUESTIONS_ADJUSTER
    );
    const selectAdjuster = adjusterTags.documents.map((doc) => doc.FieldName);
    const adjusterData = await GetDocumentById(
      documentID,
      process.env.NEXT_PUBLIC_VNG_INSPECTION,
      selectAdjuster
    );
    const adjusterReport = generateAdminReport(adjusterTags, adjusterData);

    // Combine the data from the admin and adjuster while prioritizing the adjuster data
    const combinedReport = combineReports(adminReport, adjusterReport);

    return combinedReport;
  } catch (e) {
    throw new Error("Failed to get report data");
  }
}
