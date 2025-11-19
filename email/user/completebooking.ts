import ConnectEmailClient from "@/middleware/connectEmailClient";

interface SendServiceCompletionEmailParams {
  name: string;
  email: string;
  serviceName: string;
  bookingId: string;
}

export const sendServiceCompletionEmailUser = async ({
  name,
  email,
  serviceName,
  bookingId,
}: SendServiceCompletionEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Your Service for ${serviceName} is Completed ✔️`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Service Completed</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background: #f4f7fa;
    font-family: Arial, sans-serif;
    color: #333;
  }
  .container {
    max-width: 650px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.07);
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, #28a745, #1e7e34);
    padding: 35px 20px;
    text-align: center;
  }
  .header h1 {
    color: #fff;
    font-size: 24px;
    margin: 0;
  }
  .content {
    padding: 30px;
  }
  .content p {
    font-size: 16px;
    color: #555;
    line-height: 1.7;
  }
  .info-box {
    background: #e7f8ec;
    padding: 18px 20px;
    border-left: 5px solid #28a745;
    border-radius: 10px;
    margin: 25px 0;
  }
  .info-box p {
    margin: 6px 0;
  }
  .cta-btn {
    display: inline-block;
    padding: 14px 26px;
    background: #28a745;
    color: #fff !important;
    text-decoration: none;
    font-size: 15px;
    font-weight: bold;
    border-radius: 8px;
    margin-top: 20px;
  }
  .cta-btn:hover {
    background: #1e7e34;
  }
  .footer {
    background: #f1f1f1;
    padding: 12px;
    text-align: center;
    font-size: 12px;
    color: #777;
  }
</style>

</head>
<body>

<div class="container">

  <div class="header">
    <h1>Service Completed Successfully</h1>
  </div>

  <div class="content">

    <p>Hi ${name},</p>

    <p>Your service <strong>${serviceName}</strong> has been completed successfully!</p>

    <div class="info-box">
      <p><strong>Service Name:</strong> ${serviceName}</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
    </div>

    <p>
      Thank you for choosing <strong>Jogaad India</strong>.  
      We hope you had a smooth experience with our service.
    </p>

    <p>
      To help us improve and continue delivering excellent service,  
      please take a moment to rate and review your experience.
    </p>

    <a class="cta-btn" href="https://jogaadindia.in/user/bookings/${bookingId}">
      Rate & Review Service
    </a>

  </div>

  <div class="footer">
    © 2025 Jogaad India. Thank you for trusting us.
  </div>

</div>

</body>
</html>
      `,
      text: `
Hi ${name},

Your service "${serviceName}" has been completed successfully.

Booking ID: ${bookingId}

Thank you for choosing Jogaad India!  
We would really appreciate it if you could take a moment to rate and review your service.

Rate & Review:
https://jogaadindia.in/user/bookings/${bookingId}

- Jogaad India Team
`,
    });

    return { message: "Service completion email sent", success: true };

  } catch (error) {
    console.error("Error sending service completion email:", error);
    return { message: "Failed to send service completion email", error, success: false };
  }
};
