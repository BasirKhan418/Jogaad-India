import ConnectEmailClient from "@/middleware/connectEmailClient";

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

    // Send mail
    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
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
        border-radius: 10px 10px 0 0; 
    }
    .logo {
        max-width: 120px;
        width: 30%;
        height: auto;
        margin-bottom: 10px;
    }
    .content { 
        background: #f9f9f9; 
        padding: 30px; 
        border-radius: 0 0 10px 10px; 
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
        .content { padding: 20px; }
        .otp-code { font-size: 26px; letter-spacing: 3px; }
    }
  </style>
</head>
<body>
  <div class="container">
      <div class="header">
          <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad India Logo" class="logo">
          <h1>Jogaad India</h1>
          <p>${title}</p>
      </div>
      <div class="content">
          <h2>${greeting}</h2>
          <p>${
            isAdmin
              ? "You are attempting to log in to the Jogaad India Admin Dashboard. Use the OTP below to verify your identity:"
              : "You requested an OTP to access your Jogaad India account. Use the code below to complete your verification:"
          }</p>
          
          <div class="otp-box">
              <p style="margin: 0; font-size: 14px; color: #666;">Your OTP Code</p>
              <p class="otp-code">${otp}</p>
          </div>
          
          <p><strong>This OTP will expire in 5 minutes.</strong></p>
          <p>If you didn't request this code, please ignore this email.</p>
          
          <div class="footer">
              <p>© 2025 Jogaad India. All rights reserved.</p>
              <p>This is an automated email, please do not reply.</p>
          </div>
      </div>
  </div>
</body>
</html>
      `,
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
