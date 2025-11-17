import ConnectEmailClient from "@/middleware/connectEmailClient";

interface SendWelcomeEmailParams {
  name: string;
  email: string;
  isAdmin: boolean;
}

interface SendBookingConfirmationEmailParams {
  name: string;
  email: string;
  serviceName: string;
}

export const sendWelcomeEmail = async ({
  name,
  email,
  isAdmin,
}: SendWelcomeEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const role = isAdmin ? "Admin" : "User";
    const dashboardUrl = isAdmin ? "https://jogaadindia.in/admin/dashboard" : "https://jogaadindia.in/user/dashboard";

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Welcome to Jogaad India – Your Account is Ready!`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Welcome to Jogaad India</title>

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
    color: #777;
  }
  @media(max-width:600px) {
    .content { padding: 20px; }
    .header h1 { font-size: 22px; }
  }
</style>
</head>
<body>

<div class="container">

  <div class="header">
    <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad India Logo"/>
    <h1>Welcome to Jogaad India!</h1>
  </div>

  <div class="content">
    <h2>Hello ${name}! 🎉</h2>

    <p>
      We're thrilled to have you join us at <strong>Jogaad India</strong>!  
      Your account as a <strong>${role}</strong> has been successfully created.
    </p>

    <div class="highlight-box">
      <p style="margin:0; color:#0A3D62; font-weight:bold;">
        "Customer's Problem is Our Solution"
      </p>
    </div>

    <p>
      At Jogaad India, we're committed to providing you with the best service experience.  
      Whether you need home repairs, professional services, or expert consultations, 
      we've got you covered.
    </p>

    <p>
      Get started now by logging into your dashboard and exploring all the features 
      we have to offer.
    </p>

    <a class="cta-btn" href="${dashboardUrl}">
      Go to Dashboard
    </a>

    <p style="margin-top:30px; font-size:14px; color:#777;">
      If you have any questions, feel free to reach out to our support team.  
      We're here to help!
    </p>
  </div>

  <div class="footer">
    © 2025 Jogaad India. All rights reserved.<br/>
    This is an automated email. Please do not reply.
  </div>

</div>

</body>
</html>
      `,
      text: `
Welcome to Jogaad India!

Hello ${name},

We're thrilled to have you join us! Your account as a ${role} has been successfully created.

At Jogaad India, we're committed to providing you with the best service experience.
"Customer's Problem is Our Solution"

Get started now by logging into your dashboard: ${dashboardUrl}

If you have any questions, feel free to reach out to our support team.

- Jogaad India Team
`,
    });

    return { message: "Welcome email sent successfully", success: true };

  } catch (error) {
    console.error("Error sending welcome email:", error);
    return { message: "Failed to send welcome email", error, success: false };
  }
};

export const sendBookingConfirmationEmail = async ({
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
      subject: `Booking Confirmed – ${serviceName}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Booking Confirmed</title>

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
    padding: 40px 20px;
    text-align: center;
  }
  .header img {
    width: 120px;
    margin-bottom: 10px;
  }
  .header h1 {
    color: #fff;
    font-size: 26px;
    margin: 0;
    font-weight: bold;
  }
  .content {
    padding: 30px;
  }
  .content h2 {
    color: #0A3D62;
    font-size: 22px;
    margin-bottom: 15px;
  }
  .content p {
    color: #555;
    font-size: 16px;
    line-height: 1.7;
  }
  .service-box {
    background: #e9f9fc;
    border-left: 5px solid #2B9EB3;
    padding: 18px;
    border-radius: 10px;
    margin: 25px 0;
  }
  .service-box p {
    margin: 0;
    font-size: 16px;
    color: #0A3D62;
    font-weight: bold;
  }
  .cta-btn {
    display: inline-block;
    padding: 14px 28px;
    background: #2B9EB3;
    color: #fff;
    text-decoration: none;
    font-size: 15px;
    font-weight: bold;
    border-radius: 8px;
    margin-top: 20px;
    transition: all 0.3s ease;
  }
  .cta-btn:hover {
    background: #0A3D62;
  }
  .footer {
    background: #f1f3f4;
    text-align: center;
    padding: 15px;
    font-size: 12px;
    color: #777;
  }
  @media(max-width:600px) {
    .content { padding: 20px; }
    .header h1 { font-size: 22px; }
    .cta-btn { width: 100%; text-align: center; }
  }
</style>
</head>
<body>

<div class="container">

  <div class="header">
    <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad India Logo"/>
    <h1>Booking Confirmed Successfully</h1>
  </div>

  <div class="content">
    <h2>Dear ${name},</h2>

    <p>
      Thank you for choosing <strong>Jogaad India</strong>!  
      Your booking for the following service has been successfully confirmed:
    </p>

    <div class="service-box">
      <p>📌 Service Booked: <strong>${serviceName}</strong></p>
    </div>

    <p>
      We are happy to inform you that your <strong>initial payment has been received</strong>.
      Our team is now preparing the next steps.
    </p>

    <p>
      🔧 <strong>Next Step:</strong>  
      A qualified service engineer will be assigned shortly, and you will be notified instantly once that happens.
    </p>

    <p>
      If you have any questions, we are always here to help.  
      Your comfort and satisfaction are our priority — at Jogaad India, 
      <strong>“Customer’s Problem is Our Solution.”</strong>
    </p>

    <a class="cta-btn" href="https://jogaadindia.in/user/bookings">
      View Your Booking
    </a>
  </div>

  <div class="footer">
    © 2025 Jogaad India. All rights reserved.<br/>
    This is an automated email. Please do not reply.
  </div>

</div>

</body>
</html>
      `,
      text: `
Dear ${name},

Your booking for the service: ${serviceName} has been confirmed.

Your initial payment has been received successfully.

Next Step: A service engineer will be assigned to your booking soon. You will be notified instantly.

Thank you for booking with Jogaad India.
Customer’s problem is our solution.

View your booking: https://jogaadindia.in/user/bookings

- Jogaad India Team
`,
    });

    return { message: "Booking confirmation email sent", success: true };

  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return { message: "Failed to send booking confirmation email", error, success: false };
  }
};
