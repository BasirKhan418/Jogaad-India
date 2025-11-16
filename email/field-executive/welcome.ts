import ConnectEmailClient from "@/middleware/connectEmailClient";

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

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Field Executive Account is Ready – Jogaad India",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Welcome Field Executive</title>
  <style>
    body {
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      font-family: Arial, sans-serif;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #fff;
      border-radius: 14px;
      overflow: hidden;
      box-shadow: 0 4px 18px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #2B9EB3, #0A3D62);
      text-align: center;
      padding: 35px 20px;
      color: #fff;
    }
    .header img {
      width: 110px;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 10px 0;
      font-size: 26px;
    }
    .content {
      padding: 30px 25px;
      text-align: center;
    }
    .content h2 {
      color: #0A3D62;
      font-size: 22px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      color: #444;
      line-height: 1.6;
    }
    .cta-button {
      display: inline-block;
      margin-top: 25px;
      background: #2B9EB3;
      color: white;
      padding: 14px 32px;
      border-radius: 8px;
      text-decoration: none;
      font-weight: bold;
      font-size: 16px;
      transition: 0.3s ease;
    }
    .cta-button:hover {
      background: #0A3D62;
    }
    .footer {
      text-align: center;
      background: #f1f1f1;
      padding: 15px;
      font-size: 12px;
      color: #666;
    }
    @media (max-width: 600px) {
      .content { padding: 20px; }
      .header h1 { font-size: 22px; }
      .cta-button { padding: 12px 24px; font-size: 15px; }
    }
  </style>
</head>
<body>

  <div class="container">
    <div class="header">
      <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad India Logo" />
      <h1>Welcome, Field Executive!</h1>
      <p style="font-size: 14px; color: #dff8ff">Your account has been created</p>
    </div>

    <div class="content">
      <h2>Hello ${name},</h2>
      <p>
        Your Field Executive account has been successfully created by our admin team.
        You can now access your dashboard, add employees, and start managing your tasks.
      </p>

      <p style="margin-top: 20px; font-weight: bold;">
        👉 You do NOT need a password to log in.
      </p>
      <p>
        Simply enter your registered email (<strong>${email}</strong>) and you will receive a one-time OTP to continue.
      </p>

      <a href="https://jogaadindia.in/field-executive-login" class="cta-button">
        Login to Your Dashboard
      </a>
    </div>

    <div class="footer">
      <p>© 2025 Jogaad India. All rights reserved.</p>
      <p>This is an automated email — please do not reply.</p>
    </div>
  </div>

</body>
</html>
      `,
      text: `
Hello ${name},

Your Field Executive account has been created.

Email: ${email}
No password needed — you will receive an OTP after entering your email.

Login here: https://jogaadindia.in/field-executive-login

- Jogaad India Team
`,
    });

    return { message: "Email sent successfully", success: true };
  } catch (error) {
    console.error("Error sending Field Executive welcome email:", error);
    return { message: "Email sending failed", error, success: false };
  }
};
