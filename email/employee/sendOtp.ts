import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendEmployeeOtpEmailParams {
  email: string;
  otp: string;
}

export const sendEmployeeOtpEmail = async ({ email, otp }: SendEmployeeOtpEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    // Email subject and title for service providers
    const subject = "Service Provider Login OTP for Jogaad India";
    const title = "Your Service Provider Login Verification";
    const greeting = "Hello Service Provider!";

    const emailContent = `
    <h2 style="color: #333333; margin-top: 0;">${title}</h2>
    <p>${greeting}</p>
    <p>You are attempting to log in to your Jogaad India Service Provider Account. Use the OTP below to verify your identity:</p>
    
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
      text: `
${title}

${greeting}

You are attempting to log in to your Jogaad India Service Provider Account.
Your OTP Code is: ${otp}

This OTP will expire in 5 minutes.
If you didn't request this code, please ignore this email.
`,
    });

    console.log(`Service Provider OTP email sent successfully to ${email}`);
    return { message: `OTP sent to ${email}`, success: true };

  } catch (error) {
    console.error(`Error sending Service Provider OTP email:`, error);
    return { message: "Error sending OTP email", error, success: false };
  }
};
