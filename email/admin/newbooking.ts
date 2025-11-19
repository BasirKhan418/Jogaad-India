import ConnectEmailClient from "@/middleware/connectEmailClient";

interface SendBookingConfirmationEmailParams {
  name: string;
  email: string;
  serviceName: string;
}


export const sendBookingConfirmationEmailAdmin = async ({
  name,
  email,
  serviceName,
}: SendBookingConfirmationEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Admin New Booking Confirmed – ${serviceName}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Booking Alert</title>

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
    margin: 30px auto;
    background: #ffffff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0,0,0,0.08);
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, #ff8c00, #d35400);
    padding: 35px 20px;
    text-align: center;
  }
  .header h1 {
    color: #fff;
    font-size: 24px;
    margin: 0;
  }
  .content {
    padding: 26px;
  }
  .content p {
    font-size: 16px;
    color: #555;
    line-height: 1.6;
    margin-bottom: 12px;
  }
  .info-box {
    background: #fff7e6;
    padding: 16px 18px;
    border-left: 5px solid #ff8c00;
    border-radius: 8px;
    margin: 18px 0;
  }
  .info-box p {
    margin: 6px 0;
    font-size: 15px;
  }
  .cta-btn {
    display: inline-block;
    padding: 12px 22px;
    background: #ff8c00;
    color: #fff !important;
    text-decoration: none;
    font-size: 15px;
    font-weight: bold;
    border-radius: 6px;
    margin-top: 18px;
  }
  .cta-btn:hover {
    background: #d35400;
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
    <h1>New Booking Received</h1>
  </div>

  <div class="content">

    <p>Hello Admin,</p>

    <p>A new service booking has just been received on Jogaad India.</p>

    <div class="info-box">
      <p><strong>Customer Name:</strong> ${name}</p>
      <p><strong>Service Booked:</strong> ${serviceName}</p>
      <p><strong>Customer Email:</strong> ${email}</p>
    </div>

    <p>Please assign a service engineer as soon as possible.</p>

    <a class="cta-btn" href="https://jogaadindia.in/admin/bookings">
      View Booking in Dashboard
    </a>

  </div>

  <div class="footer">
    © 2025 Jogaad India Admin Notification System
  </div>

</div>

</body>
</html>

      `,
      text: `
Hello Admin,

A new booking has been received on Jogaad India.

Customer Name: ${name}
Service Booked: ${serviceName}
Customer Email: ${email}

Please assign a service engineer at the earliest to ensure timely service delivery.

View booking in admin dashboard:
https://jogaadindia.in/admin/bookings

- Jogaad India Admin Alerts
`,
    });

    return { message: "Booking confirmation email sent", success: true };

  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return { message: "Failed to send booking confirmation email", error, success: false };
  }
};
