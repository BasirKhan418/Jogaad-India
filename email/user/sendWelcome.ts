import ConnectEmailClient from "@/middleware/connectEmailClient";

interface SendWelcomeEmailParams {
  name: string;
  email: string;
  isAdmin?: boolean;
}

export const sendWelcomeEmail = async ({ name, email, isAdmin = false }: SendWelcomeEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const subject = isAdmin
      ? "Welcome to Jogaad India Admin Portal"
      : "Welcome to Jogaad India!";
    const greeting = isAdmin ? `Hello Admin ${name}!` : `Hello ${name}!`;
    const tagline = "Customer satisfaction is our solution";

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Welcome to Jogaad India</title>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      background-color: #f4f6f8;
      margin: 0;
      padding: 0;
      color: #333;
    }
    .container {
      max-width: 600px;
      margin: 40px auto;
      background: #ffffff;
      border-radius: 12px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #2B9EB3 0%, #0A3D62 100%);
      color: #ffffff;
      text-align: center;
      padding: 40px 20px;
    }
    .logo {
      max-width: 120px;
      width: 30%;
      height: auto;
      margin-bottom: 10px;
    }
    .header h1 {
      margin: 10px 0 5px;
      font-size: 26px;
    }
    .tagline {
      font-size: 14px;
      color: #e0f7fa;
    }
    .content {
      padding: 30px;
      text-align: center;
    }
    .content h2 {
      color: #0A3D62;
      font-size: 22px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 16px;
      line-height: 1.6;
      color: #555;
    }
    .cta-button {
      display: inline-block;
      margin-top: 25px;
      background-color: #2B9EB3;
      color: #fff;
      padding: 14px 32px;
      text-decoration: none;
      border-radius: 8px;
      font-weight: bold;
      transition: background 0.3s ease;
    }
    .cta-button:hover {
      background-color: #0A3D62;
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
      .cta-button { padding: 12px 24px; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad India Logo" class="logo" />
      <h1>Welcome to Jogaad India</h1>
      <p class="tagline">${tagline}</p>
    </div>
    <div class="content">
      <h2>${greeting}</h2>
      <p>
        We're excited to have you on board! At <strong>Jogaad India</strong>, we believe that great service begins and ends with customer satisfaction.
      </p>
      <p>
        Whether you’re looking for maintenance, home services, or professional help, we’re here to make booking simple and reliable.
      </p>
      <a href="https://jogaadindia.in/book-services" class="cta-button">Book Your Services Now</a>
    </div>
    <div class="footer">
      <p>© 2025 Jogaad India. All rights reserved.</p>
      <p>This is an automated email, please do not reply.</p>
    </div>
  </div>
</body>
</html>
      `,
      text: `Welcome to Jogaad India, ${name}!\n\nOur motto: Customer satisfaction is our solution.\n\nBook your services now at https://jogaadindia.in/book-services\n\n- Jogaad India Team`,
    });

    console.log(`Welcome email sent successfully to ${email}`);
    return { message: "Welcome email sent successfully", success: true };
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { message: "Error sending welcome email", error, success: false };
  }
};
