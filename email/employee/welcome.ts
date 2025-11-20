import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendEmployeeActivationEmailParams {
  name: string;
  email: string;
}

export const sendEmployeeActivationEmail = async ({
  name,
  email,
}: SendEmployeeActivationEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const emailContent = `
    <h2>Hello ${name}! 🎉</h2>

    <p>
      Congratulations! Your account has been <strong>successfully activated</strong>.
    </p>

    <div style="background: #e8f8fb; border-left: 5px solid #2B9EB3; padding: 20px; margin: 25px 0; border-radius: 10px;">
      <p style="margin:0; color:#0A3D62; font-weight:bold;">
        Welcome to the Jogaad India Team!
      </p>
    </div>

    <p>
      You can now log in to your dashboard and start accepting service requests.
      We are excited to have you on board.
    </p>

    <a href="https://jogaadindia.in/employee/login" style="display: inline-block; background: #2B9EB3; color: #fff; padding: 14px 32px; margin-top: 25px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
      Login to Dashboard
    </a>

    <p style="margin-top:30px; font-size:14px; color:#777;">
      If you have any questions, feel free to reach out to our support team.
    </p>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: "Your Account is Activated – Welcome to Jogaad India!",
      html: getEmailTemplate(emailContent),
      text: `
Hello ${name}!

Congratulations! Your account has been successfully activated.

Welcome to the Jogaad India Team!

You can now log in to your dashboard and start accepting service requests.

Login to Dashboard: https://jogaadindia.in/employee/login

- Jogaad India Team
`,
    });

    return { message: "Activation email sent successfully", success: true };
  } catch (error) {
    console.error("Error sending activation email:", error);
    return { message: "Failed to send activation email", error, success: false };
  }
};
