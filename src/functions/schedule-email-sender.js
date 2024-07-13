"use server";
import cron from "node-cron";
import { addDays, addSeconds, format } from "date-fns";
import { emailSender } from "./send-email";

export async function scheduleEmailSender(name, phone, email, message) {
  const futureDate = addDays(new Date(), 7);
//   const futureDate = addSeconds(new Date(), 40);

  const minutes = format(futureDate, "mm");
  const hours = format(futureDate, "HH");
  const dayOfMonth = format(futureDate, "d");
  const month = format(futureDate, "M");

  const cronExpression = `${minutes} ${hours} ${dayOfMonth} ${month} *`;

  cron.schedule(cronExpression, async () => {
    const result = await emailSender(name, phone, email, message);

    if (result.success) {
      console.log("Scheduled email sent successfully");
    } else {
      console.error("Failed to send scheduled email:", result.message);
    }
  });
  console.log(`Email scheduled to be sent at ${futureDate}`);
}
