import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendBookingConfirmationEmailParams {
    name: string;
    email: string;
    serviceName: string;
    bookingId: string;
    scheduledDate: string;
}


export const sendScheduletoEmployee = async ({
    name,
    email,
    serviceName,
    bookingId,
    scheduledDate,
}: SendBookingConfirmationEmailParams) => {
    try {
        const emailTransporter = await ConnectEmailClient();

        if (!emailTransporter) {
            return { message: "Failed to connect to email client", success: false };
        }

        const emailContent = `
        <h2>Hello ${name},</h2>

        <p>
          You have been assigned a new booking for <strong>${serviceName}</strong>.
        </p>

        <div style="background: #e9f9fc; border-left: 4px solid #2B9EB3; padding: 14px 16px; border-radius: 10px; margin: 18px 0; font-size: 15px;">
          <p style="margin: 4px 0;"><strong>Booking ID:</strong> ${bookingId}</p>
          <p style="margin: 4px 0;"><strong>Service:</strong> ${serviceName}</p>
          <p style="margin: 4px 0;"><strong>Scheduled Date:</strong> ${scheduledDate}</p>
        </div>

        <p>
          Please check your dashboard for more details and to manage this booking.
        </p>

        <a href="https://jogaadindia.com/employee/bookings" style="display: inline-block; padding: 12px 24px; background: #2B9EB3; color: #ffffff !important; text-decoration: none; font-size: 15px; font-weight: bold; border-radius: 8px; margin-top: 18px; text-align: center;">
          View Booking
        </a>
        `;

        await emailTransporter.sendMail({
            from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
            to: email,
            subject: `New Booking Assigned – ${serviceName}`,
            html: getEmailTemplate(emailContent),
            text: `
Hello ${name},

You have been assigned a new booking for ${serviceName}.

Booking ID: ${bookingId}
Service: ${serviceName}
Scheduled Date: ${scheduledDate}

Please check your dashboard for more details.

View Booking: https://jogaadindia.com/employee/bookings

- Jogaad India Team
`,
        });

        return { message: "Booking confirmation email sent", success: true };

    } catch (error) {
        console.error("Error sending booking confirmation email:", error);
        return { message: "Failed to send booking confirmation email", error, success: false };
    }
};
