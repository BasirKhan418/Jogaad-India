import ConnectEmailClient from "@/middleware/connectEmailClient";

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

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Account is Activated – Welcome to Jogaad India!",
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Account Activated</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background: #f4f6f8;
    font-family: Arial, sans-serif;
    color: #333;
  }
  .container {
    max-width: 650px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 4px 18px rgba(0,0,0,0.1);
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, #2B9EB3, #0A3D62);
    padding: 35px 20px;
    text-align: center;
    color: #ffffff;
  }
  .header img {
    width: 110px;
    margin-bottom: 10px;
  }
  .header h1 {
    font-size: 26px;
    margin: 10px 0;
  }
  .content {
    padding: 30px;
    text-align: center;
  }
  .content h2 {
    color: #0A3D62;
    font-size: 22px;
    margin-bottom: 12px;
  }
  .content p {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
  }
  .highlight-box {
    background: #e8f8fb;
    border-left: 5px solid #2B9EB3;
    padding: 20px;
    margin: 25px 0;
    border-radius: 10px;
  }
  .cta-btn {
    display: inline-block;
    background: #2B9EB3;
    color: #fff;
    padding: 14px 32px;
    margin-top: 25px;
    text-decoration: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: bold;
    transition: 0.3s;
  }
  .cta-btn:hover {
    background: #0A3D62;
  }
  .footer {
    background: #f1f1f1;
    padding: 15px;
    text-align: center;
    font-size: 12px;
    color: #666;
  }

  @media (max-width: 600px) {
    .content { padding: 20px; }
    .header h1 { font-size: 22px; }
    .cta-btn { padding: 12px 24px; font-size: 15px; }
  }
</style>
</head>

<body>
  <div class="container">

    <div class="header">
      <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad India Logo">
      <h1>Account Activated Successfully</h1>
    </div>

    <div class="content">
      <h2>Dear ${name},</h2>
      <p>
        We are happy to inform you that your <strong>one-time payment has been received successfully</strong>.
        Your employee account is now <strong>fully activated</strong> on Jogaad India.
      </p>

      <div class="highlight-box">
        <p style="margin:0; font-size: 16px;">
          ✅ Your account is now active  
          <br />
          ✅ You can start taking bookings  
          <br />
          ✅ You can manage your profile, work status, and more  
        </p>
      </div>

      <p>
        Please click the button below to log in and start managing your account.
      </p>

      <a href="https://jogaadindia.in/employee/login" class="cta-btn">
        Login to Your Account
      </a>

      <p style="margin-top: 25px; font-size: 14px; color: #777;">
        No password required — simply enter your email and you will receive an OTP instantly.
      </p>
    </div>

    <div class="footer">
      <p>© 2025 Jogaad India. All rights reserved.</p>
      <p>This is an automated message. Please do not reply.</p>
    </div>

  </div>
</body>
</html>
      `,
      text: `
Dear ${name},

Your one-time payment has been received successfully and your employee account is now activated.

You can now start taking bookings and manage your account.

Login here: https://jogaadindia.in/employee-login

- Jogaad India Team
`,
    });

    return { message: "Employee activation email sent", success: true };
  } catch (error) {
    console.error("Error sending employee activation email:", error);
    return { message: "Failed to send activation email", error, success: false };
  }
};
