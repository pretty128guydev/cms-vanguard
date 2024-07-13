import { ID, Query } from "appwrite";
import { database } from "../cms.config";
import { revalidatePath } from "next/cache";

export const GetDocuments = async (
  databaseID,
  collectionID,
  matcher,
  query,
  orderField,
) => {
  try {
    const QueryBuilder = [];
    if (matcher && query) {
      QueryBuilder.push(Query.equal(matcher, query));
    }
    if (orderField) {
      QueryBuilder.push(Query.orderAsc(orderField));
    }
      QueryBuilder.push(Query.orderDesc("$createdAt"));

    const result = await database.listDocuments(databaseID, collectionID, [
      Query.limit(100),
      ...QueryBuilder,
    ]);
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const CreateDocument = async (databaseID, collectionID, data, customId) => {
  try {
    const documentId = customId || ID.unique();
    const result = await database.createDocument(
      databaseID,
      collectionID,
      documentId,
      data
    );
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.log(error.message);
    return {
      success: false,
      message: error.message,
    };
  }
};


export const GetDocumentById = async (databaseID, collectionID, documentId) => {
  try {
    const result = await database.getDocument(
      databaseID,
      collectionID,
      documentId
    );
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetDocumentByClaimNumber = async (
  databaseID,
  collectionID,
  claimNumber
) => {
  if (!claimNumber)
    return {
      success: false,
      message: "No claimnumber is provided",
    };
  try {
    const result = await database.listDocuments(databaseID, collectionID, [
      Query.equal("carrier_claim_number", claimNumber),
    ]);
    return {
      success: true,
      data: result.documents[0],
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const GetDocumentByDocId = async (
  databaseID,
  collectionID,
  docID
) => {
  if (!docID)
    return {
      success: false,
      message: "No docID is provided",
    };
  try {
    const result = await database.listDocuments(databaseID, collectionID, [
      Query.equal("$id", docID),
    ]);
    return {
      success: true,
      data: result.documents[0],
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const UpdateDocument = async (
  databaseID,
  collectionID,
  documentId,
  data
) => {
  // console.log('Error: This request is pushed to database while you are offline, how do you want to connect to database if you are offline????')
  try {
    const result = await database.updateDocument(
      databaseID,
      collectionID,
      documentId,
      data
    ); //Include only attribute and value pairs to be updated.
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const DeleteDocument = async (databaseID, collectionID, documentId) => {
  try {
    const result = await database.deleteDocument(
      databaseID,
      collectionID,
      documentId
    );
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return {
      success: false,
      message: error.message,
    };
  }
};

// export const test = async() => {
//     try {
//         const result = await users.listMemberships(
//             "6630bf81000c82dbe0b8"
//         );
//         console.log(result);
//     } catch (error) {
//         console.log(error.message);
//     }
// }
