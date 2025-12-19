import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

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
    const dashboardUrl = isAdmin ? "https://jogaadindia.com/admin/dashboard" : "https://jogaadindia.com/user/dashboard";

    const emailContent = `
    <h2>Hello ${name}! 🎉</h2>

    <p>
      We're thrilled to have you join us at <strong>Jogaad India</strong>!  
      Your account as a <strong>${role}</strong> has been successfully created.
    </p>

    <div style="background: #e8f8fb; border-left: 5px solid #2B9EB3; padding: 20px; margin: 25px 0; border-radius: 10px;">
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

    <a href="${dashboardUrl}" style="display: inline-block; background: #2B9EB3; color: #fff; padding: 14px 32px; margin-top: 25px; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold;">
      Go to Dashboard
    </a>

    <p style="margin-top:30px; font-size:14px; color:#777;">
      If you have any questions, feel free to reach out to our support team.  
      We're here to help!
    </p>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: `Welcome to Jogaad India – Your Account is Ready!`,
      html: getEmailTemplate(emailContent),
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
  console.log("Preparing to send booking confirmation email to:", email);
  console.log("Booking details - Name:", name, "Service:", serviceName);
  try {
    const emailTransporter = await ConnectEmailClient();

    if (!emailTransporter) {
      return { message: "Failed to connect to email client", success: false };
    }

    const emailContent = `
    <h2>Dear ${name},</h2>

    <p>
      Thank you for choosing <strong>Jogaad India</strong>!  
      Your booking for the following service has been successfully confirmed:
    </p>

    <div style="background: #e9f9fc; border-left: 5px solid #2B9EB3; padding: 18px; border-radius: 10px; margin: 25px 0;">
      <p style="margin: 0; font-size: 16px; color: #0A3D62; font-weight: bold;">📌 Service Booked: <strong>${serviceName}</strong></p>
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

    <a href="https://jogaadindia.com/user/bookings" style="display: inline-block; padding: 14px 28px; background: #2B9EB3; color: #fff; text-decoration: none; font-size: 15px; font-weight: bold; border-radius: 8px; margin-top: 20px;">
      View Your Booking
    </a>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER_V2}>`,
      to: email,
      subject: `Booking Confirmed – ${serviceName}`,
      html: getEmailTemplate(emailContent),
      text: `
Dear ${name},

Your booking for the service: ${serviceName} has been confirmed.

Your initial payment has been received successfully.

Next Step: A service engineer will be assigned to your booking soon. You will be notified instantly.

Thank you for booking with Jogaad India.
Customer’s problem is our solution.

View your booking: https://jogaadindia.com/user/bookings

- Jogaad India Team
`,
    });

    return { message: "Booking confirmation email sent", success: true };

  } catch (error) {
    console.error("Error sending booking confirmation email:", error);
    return { message: "Failed to send booking confirmation email", error, success: false };
  }
};
