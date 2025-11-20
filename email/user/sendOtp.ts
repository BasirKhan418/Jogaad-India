import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendOtpEmailParams {
  email: string;
  otp: string;
  isAdmin?: boolean;
}

export const sendOtpEmail = async ({ email, otp, isAdmin = false }: SendOtpEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    // Dynamic subject and title
    const subject = isAdmin
      ? "Admin OTP for Jogaad India Dashboard"
      : "Your OTP for Jogaad India";
    const title = isAdmin
      ? "Admin Access Verification"
      : "Your One-Time Password";
    const greeting = isAdmin ? "Hello Admin!" : "Hello!";

    const emailContent = `
      <h2 style="color: #333333; margin-top: 0;">${title}</h2>
      <p>${greeting}</p>
      <p>${
        isAdmin
          ? "You are attempting to log in to the Jogaad India Admin Dashboard. Use the OTP below to verify your identity:"
          : "You requested an OTP to access your Jogaad India account. Use the code below to complete your verification:"
      }</p>
      
      <div style="background: white; border: 2px solid #2B9EB3; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
          <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
          <p style="font-size: 32px; font-weight: bold; color: #0A3D62; letter-spacing: 5px; margin: 10px 0;">${otp}</p>
      </div>
      
      <p><strong>This OTP will expire in 5 minutes.</strong></p>
      <p>If you didn't request this code, please ignore this email.</p>
    `;

    // Send mail
    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject,
      html: getEmailTemplate(emailContent),
      text: `${
        isAdmin
          ? "Your admin OTP for Jogaad India Dashboard"
          : "Your OTP for Jogaad India"
      } is: ${otp}\n\nThis OTP will expire in 5 minutes.\n\nIf you didn't request this code, please ignore this email.`,
    });

    console.log(`${isAdmin ? "Admin" : "User"} OTP email sent successfully to ${email}`);
    return { message: `${isAdmin ? "Admin" : "User"} OTP sent to ${email}`, success: true };

  } catch (error) {
    console.error(`Error sending ${isAdmin ? "Admin" : "User"} OTP email:`, error);
    return { message: "Error sending OTP email", error, success: false };
  }
};
