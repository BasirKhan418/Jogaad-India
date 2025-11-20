import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendFieldExecutiveWelcomeParams {
  name: string;
  email: string;
}

export const sendFieldExecutiveWelcomeEmail = async ({
  name,
  email,
}: SendFieldExecutiveWelcomeParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const emailContent = `
    <h2>Hello ${name}! 🎉</h2>

    <p>
      Congratulations! Your employee account has been <strong>successfully created</strong>.
    </p>

    <p>
      You are now part of the Jogaad India team. You can log in to your dashboard to manage your tasks and profile.
    </p>

    <a href="https://jogaadindia.in/field-executive/login" style="display: inline-block; margin-top: 25px; background: #2B9EB3; color: white; padding: 14px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
      Login to Dashboard
    </a>

    <p style="margin-top:30px; font-size:14px; color:#777;">
      If you have any questions, feel free to reach out to our support team.
    </p>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Employee Account is Ready – Jogaad India",
      html: getEmailTemplate(emailContent),
      text: `
Hello ${name}!

Congratulations! Your employee account has been successfully created.

You are now part of the Jogaad India team. You can log in to your dashboard to manage your tasks and profile.

Login to Dashboard: https://jogaadindia.in/field-executive/login

- Jogaad India Team
`,
    });

    return { message: "Welcome email sent successfully", success: true };
  } catch (error) {
    console.error("Error sending field executive welcome email:", error);
    return { message: "Failed to send welcome email", error, success: false };
  }
};
