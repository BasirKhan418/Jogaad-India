import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendRefundCompletedEmailParams {
  name: string;
  email: string;
  serviceName: string;
  orderId: string;
}

export const sendRefundCompletedEmail = async ({
  name,
  email,
  serviceName,
  orderId,
}: SendRefundCompletedEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to mail client", success: false };
    }

    const emailContent = `
    <p>Dear ${name},</p>
    <p>We are pleased to inform you that your refund has been <strong>successfully processed</strong>.</p>

    <div style="background: #e8ffe8; border-left: 5px solid #28a745; padding: 18px; border-radius: 10px; margin: 25px 0; font-size: 16px; color: #1e7d32; font-weight: bold;">
      ✅ Service: <strong>${serviceName}</strong><br/>
      ✅ Order ID: <strong>${orderId}</strong><br/>
      ✅ Status: <strong>Refund Completed</strong>
    </div>

    <p>The refunded amount has been credited to your original payment method.</p>

    <p>If you need any assistance, feel free to reach out anytime.<br/><strong>Customer’s Problem is Our Solution.</strong></p>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: `Refund Completed – Order ${orderId}`,
      html: getEmailTemplate(emailContent),
      text: `
Dear ${name},

Your refund has been successfully completed.

Service: ${serviceName}
Order ID: ${orderId}

The amount has been credited to your original payment method.

Thank you,
Jogaad India Team
`,
    });

    return { message: "Refund completed email sent", success: true };
  } catch (error) {
    console.error("Error sending refund completed email:", error);
    return { message: "Failed to send refund completed email", error, success: false };
  }
};
