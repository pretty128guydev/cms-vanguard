"use server";
import { CreateDocument, UpdateDocument } from "@/cms/DatabaseHelpers/database-helper";

export async function submitInspection(data) {
  try {
    const res = await CreateDocument(
      process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
      process.env.NEXT_PUBLIC_VNG_INSPECTION,
      data.newData,
      data.customId
    );

    if (res.success) {
      try {
        const updateRes = await UpdateDocument(
          process.env.NEXT_PUBLIC_CLAIMS_INSPECTION_DB,
          process.env.NEXT_PUBLIC_VNG_CLAIMS,
          data.claimData.$id,
          { status: "Inspection Completed" },
        );

        if (updateRes.success) {
          return { success: true, message: "Inspection completed successfully." };
        } else {
          return { success: false, message: "Inspection created but failed to update claim status." };
        }
      } catch (err) {
        return { success: false, message: `Error updating document: ${err.message}` };
      }
    } else {
      return { success: false, message: "Failed to create inspection." };
    }
  } catch (error) {
    return { success: false, message: `Error creating document: ${error.message}` };
  }
}
