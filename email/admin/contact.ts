import ConnectEmailClient from "@/middleware/connectEmailClient";
import { getEmailTemplate } from "../template";

interface SendContactToAdminParams {
  enqType: string;

  name: string;
  email: string;
  phone: string;

  // Enquiry
  address?: string;
  requirement?: string;

  // Support
  issueType?: string;
  issueDescription?: string;

  // Job
  position?: string;
  coverLetter?: string;

  // Feedback
  rating?: string;
  feedback?: string;
  likeMost?: string;

  // Resume File URL (if you upload to S3)
  resumeUrl?: string;
}

export const sendContactToAdmin = async (data: SendContactToAdminParams) => {
  try {
    const emailTransporter = await ConnectEmailClient();
    if (!emailTransporter) {
      return { success: false, message: "Failed to connect to email client" };
    }

    const {
      enqType,
      name,
      email,
      phone,

      address,
      requirement,

      issueType,
      issueDescription,

      position,
      coverLetter,
      resumeUrl,

      rating,
      feedback,
      likeMost,
    } = data;

    // 🎨 Dynamic Section Based on Enquiry Type
    let dynamicContent = "";

    if (enqType === "Enquiry") {
      dynamicContent = `
        <div style="background: #fff7e6; padding: 16px; border-left: 5px solid #ff8c00; border-radius: 8px; margin: 18px 0;">
          <p><strong>Address:</strong> ${address}</p>
          <p><strong>Requirement:</strong> ${requirement}</p>
        </div>
      `;
    }

    if (enqType === "Support") {
      dynamicContent = `
        <div style="background: #e6faff; padding: 16px; border-left: 5px solid #2B9EB3; border-radius: 8px; margin: 18px 0;">
          <p><strong>Issue Type:</strong> ${issueType}</p>
          <p><strong>Description:</strong> ${issueDescription}</p>
        </div>
      `;
    }

    if (enqType === "Job Enquiry") {
      dynamicContent = `
        <div style="background: #fff0f5; padding: 16px; border-left: 5px solid #cc0066; border-radius: 8px; margin: 18px 0;">
          <p><strong>Position Applied:</strong> ${position}</p>
          <p><strong>Resume:</strong> ${resumeUrl ? `<a href="${resumeUrl}" style="color:#cc0066; font-weight:bold;">Download Resume</a>` : "Not uploaded"}</p>
          ${
            coverLetter
              ? `<p><strong>Cover Letter:</strong><br/>${coverLetter}</p>`
              : ""
          }
        </div>
      `;
    }

    if (enqType === "Feedback") {
      dynamicContent = `
        <div style="background: #e8ffe6; padding: 16px; border-left: 5px solid #2ecc71; border-radius: 8px; margin: 18px 0;">
          <p><strong>Rating:</strong> ⭐ ${rating} / 5</p>
          <p><strong>Feedback:</strong><br/>${feedback}</p>
          ${
            likeMost
              ? `<p><strong>What they liked most:</strong> ${likeMost}</p>`
              : ""
          }
        </div>
      `;
    }

    // ⭐ Main Email Body
    const emailContent = `
      <h2>Hello Admin,</h2>

      <p>A new <strong>${enqType}</strong> request has been submitted on <strong>Jogaad India</strong>.</p>

      <div style="background: #f0f4ff; padding: 16px; border-left: 5px solid #2B9EB3; border-radius: 8px; margin: 18px 0;">
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Enquiry Type:</strong> ${enqType}</p>
      </div>

      ${dynamicContent}

      <p style="margin-top: 20px;">
        Please review the request and take the required action.
      </p>

      <a href="https://jogaadindia.com/admin/contacts" 
        style="
          display: inline-block; 
          padding: 12px 22px; 
          background: #2B9EB3; 
          color: #fff !important; 
          text-decoration: none; 
          font-size: 15px; 
          font-weight: bold; 
          border-radius: 6px;
          margin-top: 18px;">
        View Enquiries
      </a>
    `;

    await emailTransporter.sendMail({
      from: `"Jogaad India" <${process.env.EMAIL_USER}>`,
      to: "jogaadindia@gmail.com",
      subject: `New ${enqType} Received – ${name}`,
      html: getEmailTemplate(emailContent),
      text: `
New ${enqType} received

Name: ${name}
Email: ${email}
Phone: ${phone}

${enqType === "Enquiry" ? `Address: ${address}\nRequirement: ${requirement}` : ""}
${enqType === "Support" ? `Issue Type: ${issueType}\nDescription: ${issueDescription}` : ""}
${enqType === "Job Enquiry" ? `Position: ${position}\nResume: ${resumeUrl}` : ""}
${enqType === "Feedback" ? `Rating: ${rating}\nFeedback: ${feedback}` : ""}
      `,
    });

    return { success: true, message: "Contact email sent to admin" };
  } catch (error) {
    console.error("Error sending contact email:", error);
    return { success: false, message: "Failed to send email", error };
  }
};
