import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendBookingConfirmationEmailParams {
  name: string;
  email: string;
  serviceName: string;
}

export const sendBookingConfirmationEmailAdmin = async ({
  name,
  email,
  serviceName,
}: SendBookingConfirmationEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const emailContent = `
    <h2>Hello Admin,</h2>

    <p>
      A new booking has been received on <strong>Jogaad India</strong>.
    </p>

    <div style="background: #fff7e6; padding: 16px 18px; border-left: 5px solid #ff8c00; border-radius: 8px; margin: 18px 0;">
      <p style="margin: 6px 0; font-size: 15px;"><strong>Customer Name:</strong> ${name}</p>
      <p style="margin: 6px 0; font-size: 15px;"><strong>Service:</strong> ${serviceName}</p>
      <p style="margin: 6px 0; font-size: 15px;"><strong>Status:</strong> <span style="color:#ff8c00; font-weight:bold;">Confirmed</span></p>
    </div>

    <p>
      Please review the booking details and assign a service engineer as soon as possible.
    </p>

    <a href="https://jogaadindia.in/admin/bookings" style="display: inline-block; padding: 12px 22px; background: #ff8c00; color: #fff !important; text-decoration: none; font-size: 15px; font-weight: bold; border-radius: 6px; margin-top: 18px;">
      Manage Bookings
    </a>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: "jogaadindia@gmail.com",
      subject: `Admin New Booking Confirmed – ${serviceName}`,
      html: getEmailTemplate(emailContent),
      text: `
Hello Admin,

A new booking has been received.

Customer Name: ${name}
Service: ${serviceName}
Status: Confirmed

Please review the booking details and assign a service engineer.

Manage Bookings: https://jogaadindia.in/admin/bookings

- Jogaad India Team
`,
    });

    return { message: "Booking confirmation email sent", success: true };
  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return {
      message: "Failed to send booking confirmation email",
      error,
      success: false,
    };
  }
};
