import ConnectEmailClient from "@/middleware/connectEmailClient";

interface SendBookingConfirmationEmailParams {
    name: string;
    email: string;
    serviceName: string;
    bookingId: string;
    scheduledDate: string;
}


export const sendScheduletoEmployee = async ({
    name,
    email,
    serviceName,
    bookingId,
    scheduledDate,
}: SendBookingConfirmationEmailParams) => {
    try {
        const emailTransporter = await ConnectEmailClient();

        if (!emailTransporter) {
            return { message: "Failed to connect to email client", success: false };
        }

        await emailTransporter.sendMail({
            from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: `New Booking Assigned – ${serviceName}`,
            html: `
      <!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>New Booking Assigned</title>

<style>
  body {
    margin: 0;
    padding: 0;
    background: #f5f7fa;
    font-family: Arial, sans-serif;
    color: #333;
  }
  .container {
    max-width: 650px;
    margin: 30px auto;
    background: #ffffff;
    border-radius: 16px;
    box-shadow: 0 4px 25px rgba(0,0,0,0.08);
    overflow: hidden;
  }
  .header {
    background: linear-gradient(135deg, #2B9EB3, #0A3D62);
    padding: 32px 20px;
    text-align: center;
  }
  .header h1 {
    color: #fff;
    font-size: 24px;
    margin: 0;
    font-weight: bold;
  }
  .content {
    padding: 26px 28px;
  }
  .content p {
    font-size: 16px;
    line-height: 1.6;
    color: #555;
    margin-bottom: 14px;
  }
  .info-box {
    background: #e9f9fc;
    border-left: 4px solid #2B9EB3;
    padding: 14px 16px;
    border-radius: 10px;
    margin: 18px 0;
    font-size: 15px;
  }
  .info-box p {
    margin: 4px 0;
  }
  .cta-btn {
    display: inline-block;
    padding: 12px 24px;
    background: #2B9EB3;
    color: #ffffff !important;
    text-decoration: none;
    font-size: 15px;
    font-weight: bold;
    border-radius: 8px;
    margin-top: 18px;
    text-align: center;
  }
  .cta-btn:hover {
    background: #0A3D62;
  }
  .note {
    font-size: 13px;
    color: #777;
    margin-top: 12px;
  }
  .footer {
    background: #f1f3f4;
    text-align: center;
    padding: 14px;
    font-size: 12px;
    color: #777;
  }
  @media(max-width:600px) {
    .content { padding: 20px; }
    .header h1 { font-size: 20px; }
    .cta-btn { width: 100%; }
  }
</style>
</head>
<body>

<div class="container">

  <div class="header">
    <h1>New Booking Assigned</h1>
  </div>

  <div class="content">
    <p>Hi ${name},</p>

    <p>
      Admin has recently scheduled a new booking for your ID on <strong>Jogaad India</strong>.
      Please review the details and click <strong>Accept</strong> to continue.
    </p>

    <div class="info-box">
      <p><strong>Service:</strong> ${serviceName}</p>
      <p><strong>Booking ID:</strong> ${bookingId}</p>
      <p><strong>Scheduled Date:</strong> ${scheduledDate}</p>
    </div>

    <a class="cta-btn" href="https://jogaadindia.in/employee/accept-booking">
      Accept Booking &amp; Continue
    </a>

    <p class="note">
      Note: You may be asked to log in to your account to complete the acceptance.
      If the button does not work, copy and paste this link into your browser:<br/>
      <span>https://jogaadindia.in/employee/accept-booking</span>
    </p>
  </div>

  <div class="footer">
    © 2025 Jogaad India. Service Engineer Notification.
  </div>

</div>

</body>
</html>
      `,
            text: `
Hi ${name},

A new booking has been assigned to your ID by the admin on Jogaad India.

Please review the details below and click the link to accept and continue:

Service: ${serviceName}
Booking ID: ${bookingId}
Scheduled Date: ${scheduledDate}

            Accept Booking:
            https://jogaadindia.in/employee/accept-booking

Note: You may be asked to log in to your account before accepting the booking.

- Jogaad India Service Engineer Portal

`,
        });



    } catch (error) {
        console.error("Error sending booking confirmation email:", error);
        return { message: "Failed to send booking confirmation email", error, success: false };
    }
};
