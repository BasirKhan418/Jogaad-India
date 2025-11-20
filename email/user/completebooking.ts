import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendServiceCompletionEmailParams {
  name: string;
  email: string;
  serviceName: string;
  bookingId: string;
}

export const sendServiceCompletionEmailUser = async ({
  name,
  email,
  serviceName,
  bookingId,
}: SendServiceCompletionEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const emailContent = `
    <h2>Hello ${name},</h2>

    <p>
      We are happy to inform you that your service for <strong>${serviceName}</strong> 
      has been successfully marked as <strong>Completed</strong>.
    </p>

    <div style="background: #e7f8ec; padding: 18px 20px; border-left: 5px solid #28a745; border-radius: 10px; margin: 25px 0;">
      <p style="margin: 6px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
      <p style="margin: 6px 0;"><strong>Service:</strong> ${serviceName}</p>
      <p style="margin: 6px 0;"><strong>Status:</strong> <span style="color:#28a745; font-weight:bold;">Completed</span></p>
    </div>

    <p>
      We hope you are satisfied with our service. Your feedback helps us improve!
    </p>

    <a href="https://jogaadindia.in/user/bookings" style="display: inline-block; padding: 14px 26px; background: #28a745; color: #fff !important; text-decoration: none; font-size: 15px; font-weight: bold; border-radius: 8px; margin-top: 20px;">
      View Booking Details
    </a>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: `Your Service for ${serviceName} is Completed ✔️`,
      html: getEmailTemplate(emailContent),
      text: `
Hello ${name},

Your service for ${serviceName} has been completed successfully.

Booking ID: ${bookingId}
Service: ${serviceName}
Status: Completed

We hope you are satisfied with our service.

View Booking Details: https://jogaadindia.in/user/bookings

- Jogaad India Team
`,
    });

    return { message: "Service completion email sent", success: true };

  } catch (error) {
    console.error("Error sending service completion email:", error);
    return { message: "Failed to send service completion email", error, success: false };
  }
};
