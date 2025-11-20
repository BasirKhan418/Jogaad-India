import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendFieldExecutiveOtpParams {
  email: string;
  otp: string;
}

export const sendFieldExecutiveOtp = async ({
  email,
  otp,
}: SendFieldExecutiveOtpParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const emailContent = `
    <h2 style="color: #333333; margin-top: 0;">Employee Login Verification</h2>
    <p>Hello Employee,</p>
    <p>You requested an OTP to access your Jogaad India Employee dashboard.</p>
    
    <div style="background: white; border: 2px solid #2B9EB3; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
        <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
        <p style="font-size: 32px; font-weight: bold; color: #0A3D62; letter-spacing: 5px; margin: 10px 0;">${otp}</p>
    </div>
    
    <p><strong>This OTP will expire in 5 minutes.</strong></p>
    <p>If you didn't request this code, please ignore this email.</p>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: "Your OTP for Employee Login – Jogaad India",
      html: getEmailTemplate(emailContent),
      text: `
Employee Login Verification

Hello Employee,

You requested an OTP to access your Jogaad India Employee dashboard.
Your OTP Code is: ${otp}

This OTP will expire in 5 minutes.
If you didn't request this code, please ignore this email.
`,
    });

    return { message: "OTP sent successfully", success: true };
  } catch (error) {
    console.error("Error sending field executive OTP:", error);
    return { message: "Failed to send OTP", error, success: false };
  }
};
