import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendRefundInitiatedEmailParams {
  name: string;
  email: string;
  serviceName: string;
  orderId: string;
}

export const sendRefundInitiatedEmail = async ({
  name,
  email,
  serviceName,
  orderId,
}: SendRefundInitiatedEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to mail client", success: false };
    }

    const emailContent = `
    <p>Dear ${name},</p>
    <p>We want to inform you that the refund process for your booking has been <strong>successfully initiated</strong>.</p>

    <div style="background: #e9f9fc; border-left: 5px solid #2B9EB3; padding: 18px; border-radius: 10px; margin: 25px 0; font-size: 16px; color: #0A3D62; font-weight: bold;">
      📌 Service: <strong>${serviceName}</strong><br/>
      📌 Order ID: <strong>${orderId}</strong><br/>
      📌 Status: <strong>Refund Initiated</strong>
    </div>

    <p>Your refund will be processed and credited to your original payment method within <strong>3 to 5 business days</strong>.</p>

    <p>If you have any questions, our support team is always here to help you.<br/><strong>Customer’s Problem is Our Solution.</strong></p>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: `Refund Initiated – Order ${orderId}`,
      html: getEmailTemplate(emailContent),
      text: `
Dear ${name},

Your refund request has been initiated.

Service: ${serviceName}
Order ID: ${orderId}

Your amount will be refunded to your original payment method within 3 to 5 business days.

Thank you,
Jogaad India Team
`,
    });

    return { message: "Refund initiated email sent", success: true };
  } catch (error) {
    console.error("Error sending refund initiated email:", error);
    return { message: "Failed to send refund initiated email", error, success: false };
  }
};
