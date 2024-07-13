// ReportMail.js
import { GetEmailTemplate } from "@/functions/get-email-template";

const reportMail = async (claimNumber, downloadLink) => {
  const replacements = {
    claimNumber: claimNumber,
    downloadLink: downloadLink,
  };

  const response = await GetEmailTemplate("ReportMail");
  let htmlCode = response.html_code;

  // Replace placeholders with actual values
  Object.keys(replacements).forEach((key) => {
    const placeholder = `{{${key}}}`;
    htmlCode = htmlCode.replace(new RegExp(placeholder, "g"), replacements[key]);
  });

  return htmlCode; // Return the modified HTML code
};

export default reportMail;
