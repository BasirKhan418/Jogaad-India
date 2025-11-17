import ConnectEmailClient from "@/middleware/connectEmailClient";

interface SendRefundCompletedEmailParams {
  name: string;
  email: string;
  serviceName: string;
  orderId: string;
}

export const sendRefundCompletedEmail = async ({
  name,
  email,
  serviceName,
  orderId,
}: SendRefundCompletedEmailParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to mail client", success: false };
    }

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Refund Completed – Order ${orderId}`,
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Refund Completed</title>

<style>
  body { margin:0; padding:0; background:#f7f9fb; font-family:Arial; }
  .container { max-width:650px; margin:30px auto; background:#ffffff; border-radius:16px; box-shadow:0 4px 20px rgba(0,0,0,0.08); overflow:hidden; }
  .header { background:linear-gradient(135deg,#0A3D62,#2B9EB3); padding:35px 20px; text-align:center; }
  .header img { width:110px; }
  .header h1 { color:white; margin-top:10px; font-size:24px; }
  .content { padding:30px; }
  .content p { font-size:16px; color:#555; line-height:1.7; }
  .highlight { background:#e8ffe8; border-left:5px solid #28a745; padding:18px; border-radius:10px; margin:25px 0; font-size:16px; color:#1e7d32; font-weight:bold; }
  .footer { background:#f1f3f4; text-align:center; padding:15px; font-size:12px; color:#777; }
</style>
</head>
<body>

<div class="container">

  <div class="header">
    <img src="https://jogaadindiaassets.s3.ap-south-1.amazonaws.com/logo.png" alt="Jogaad Logo">
    <h1>Refund Completed</h1>
  </div>

  <div class="content">
    <p>Dear ${name},</p>
    <p>We are pleased to inform you that your refund has been <strong>successfully processed</strong>.</p>

    <div class="highlight">
      ✅ Service: <strong>${serviceName}</strong><br/>
      ✅ Order ID: <strong>${orderId}</strong><br/>
      ✅ Status: <strong>Refund Completed</strong>
    </div>

    <p>The refunded amount has been credited to your original payment method.</p>

    <p>If you need any assistance, feel free to reach out anytime.<br/><strong>Customer’s Problem is Our Solution.</strong></p>
  </div>

  <div class="footer">
    © 2025 Jogaad India. This is an automated message. Please do not reply.
  </div>

</div>

</body>
</html>
      `,
      text: `
Dear ${name},

Your refund has been successfully completed.

Service: ${serviceName}
Order ID: ${orderId}

The amount has been credited to your original payment method.

Thank you,
Jogaad India Team
`,
    });

    return { message: "Refund completed email sent", success: true };
  } catch (error) {
    console.error("Error sending refund completed email:", error);
    return { message: "Failed to send refund completed email", error, success: false };
  }
};
