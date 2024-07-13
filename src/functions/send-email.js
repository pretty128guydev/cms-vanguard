"use server";
import nodemailer from "nodemailer";
import { get_smtp_config } from "@/functions/db-smtp-config";

export async function emailSender(email, mailTemplate, subject) {
  try {
    // Fetch SMTP configuration from the database
    const res = await get_smtp_config();
    // console.log(res);

    // Create a Nodemailer transporter using the fetched configuration
    const transporter = nodemailer.createTransport({
      host: res.smtp_server,
      port: res.smtp_port,
      secure: res.smtp_port === "465", // true for port 465, false otherwise
      auth: {
        user: res.smtp_user,
        pass: res.smtp_password,
      },
      tls: {
        rejectUnauthorized: false, // Use this if you encounter self-signed certificate issues
      },
    });

    // Compose the email message using HTML table
    const mailOptions = {
      from: `"Vanguard Landmark" <${res.smtp_user}>`,
      to: email,
      subject: subject,
      html: mailTemplate,
    };
    // Send the email
    try {
      await transporter.sendMail(mailOptions);
      return { success: true, message: "Email sent successfully." };
      
    } catch (error) {
      return { success: false, message: "Failed to send email. " + error.message };
      
    }
    // Return success message
  } catch (error) {
    return { success: false, message: "Failed to send email. " + error.message };
    // Return error message
  }
}
