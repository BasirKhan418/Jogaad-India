import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendFieldExecutiveWelcomeParams {
  name: string;
  email: string;
  link?: string;
}

export const sendFieldExecutiveWelcomeEmail = async ({
  name,
  email,
  link, // payment / activation link
}: SendFieldExecutiveWelcomeParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const emailContent = `
      <h2>Hello ${name}! 👋</h2>

      <p>
        Your employee account has been <strong>successfully created</strong>.
      </p>

      <p>
        To <strong>activate your account</strong> and start using the dashboard, 
        you need to complete the payment.
      </p>

      <a href="${link}" 
        style="
          display: inline-block;
          margin-top: 25px;
          background: #2B9EB3;
          color: white;
          padding: 14px 32px;
          border-radius: 8px;
          text-decoration: none;
          font-weight: bold;
          font-size: 16px;
        ">
        Activate Account & Pay Now
      </a>

      <p style="margin-top:30px; font-size:14px; color:#777;">
        Once the payment is completed, your account will be activated instantly.
        <br />
        If you have any questions, feel free to contact our support team.
      </p>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: "Activate Your Employee Account – Jogaad India",
      html: getEmailTemplate(emailContent),
      text: `
Hello ${name},

Your employee account has been successfully created.

To activate your account and start using the dashboard, please complete the payment using the link below:

Activate & Pay: ${link}

Once payment is completed, your account will be activated instantly.

– Jogaad India Team
      `,
    });

    return { message: "Activation email sent successfully", success: true };
  } catch (error) {
    console.error("Error sending field executive activation email:", error);
    return { message: "Failed to send activation email", error, success: false };
  }
};


