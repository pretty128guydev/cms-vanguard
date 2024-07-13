import { GetEmailTemplate } from "@/functions/get-email-template";
const assignClaimMail= async (subject, name, email, message )=>{

  const replacements = {
    subject: subject,
    name: name,
    email: email,
    message: message,
  };

  const response = await GetEmailTemplate("AssignClaimMail");
  let htmlCode = response.html_code;

  // Replace placeholders with actual values
  Object.keys(replacements).forEach((key) => {
    const placeholder = `{{${key}}}`;
    htmlCode = htmlCode.replace(new RegExp(placeholder, "g"), replacements[key]);
  });

  return htmlCode; // Return the modified HTML code
}

export default assignClaimMail;