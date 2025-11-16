import ConnectEmailClient from "@/middleware/connectEmailClient";

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

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your OTP for Field Executive Login – Jogaad India",
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { 
        font-family: Arial, sans-serif; 
        line-height: 1.6; 
        color: #333; 
        margin: 0; 
        padding: 0; 
    }
    .container { 
        max-width: 600px; 
        margin: 0 auto; 
        padding: 20px; 
    }
    .header { 
        background: linear-gradient(135deg, #2B9EB3 0%, #0A3D62 100%); 
        color: white; 
        padding: 30px; 
        text-align: center; 
        border-radius: 12px 12px 0 0; 
    }
    .logo {
        max-width: 120px;
        width: 30%;
        margin-bottom: 10px;
    }
    .content { 
        background: #f9f9f9; 
        padding: 30px; 
        border-radius: 0 0 12px 12px; 
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
    }
    .otp-box { 
        background: white; 
        border: 2px solid #2B9EB3; 
        border-radius: 8px; 
        padding: 20px; 
        text-align: center; 
        margin: 20px 0; 
    }
    .otp-code { 
        font-size: 32px; 
        font-weight: bold; 
        color: #0A3D62; 
        letter-spacing: 5px; 
    }
    .footer { 
        text-align: center; 
        margin-top: 20px; 
        color: #666; 
        font-size: 12px; 
    }
    @media (max-width: 600px) {
        .container { padding: 10px; }
        .content { padding: 22px; }
        .otp-code { font-size: 26px; letter-spacing: 3px; }
    }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" 
               alt="Jogaad India Logo" class="logo" />
          <h1>Field Executive Login Verification</h1>
          <p style="margin: 0; font-size: 14px;">Use the OTP below to continue</p>
      </div>

      <div class="content">
          <p>Hello Field Executive,</p>

          <p>You requested an OTP to access your Jogaad India Field Executive dashboard.</p>

          <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
              <p class="otp-code">${otp}</p>
          </div>

          <p><strong>This OTP will expire in 5 minutes.</strong></p>

          <p>If you did not request this code, please ignore this email.</p>

          <div class="footer">
              <p>© 2025 Jogaad India. All rights reserved.</p>
              <p>This is an automated email — please do not reply.</p>
          </div>
      </div>
  </div>
</body>
</html>
      `,
      text: `
Your Field Executive OTP for Jogaad India is: ${otp}

This OTP will expire in 5 minutes.

If you didn't request this code, please ignore this email.
`,
    });

    return { message: "Field Executive OTP sent successfully", success: true };
  } catch (error) {
    console.error("Error sending Field Executive OTP email:", error);
    return { message: "Failed to send Field Executive OTP", error, success: false };
  }
};
