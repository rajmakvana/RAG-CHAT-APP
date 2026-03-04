import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT) || 587,
  secure: process.env.SMTP_SECURE === "true", // true for 465, false for 587
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Send an organization invite email
 * @param {string} to - recipient email
 * @param {string} orgName - organization name
 * @param {string} inviteLink - full invite URL
 * @param {string} role - invited role (USER/ADMIN)
 */
export const sendInviteEmail = async (to, orgName, inviteLink, role = "USER") => {
  const mailOptions = {
    from: `"${process.env.SMTP_FROM_NAME || "RAG Platform"}" <${process.env.SMTP_USER}>`,
    to,
    subject: `You're invited to join ${orgName}`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 0;">
        <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); padding: 40px 30px; border-radius: 12px 12px 0 0; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">You're Invited! 🎉</h1>
        </div>
        <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
          <p style="color: #374151; font-size: 16px; line-height: 1.6; margin-top: 0;">
            You've been invited to join <strong>${orgName}</strong> as a <strong>${role}</strong>.
          </p>
          <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
            Click the button below to accept your invitation and create your account.
          </p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${inviteLink}" 
               style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: #ffffff; padding: 14px 36px; border-radius: 8px; text-decoration: none; font-size: 16px; font-weight: 600; display: inline-block;">
              Accept Invitation
            </a>
          </div>
          <p style="color: #9ca3af; font-size: 12px; line-height: 1.5; border-top: 1px solid #f3f4f6; padding-top: 20px; margin-bottom: 0;">
            This invitation expires in 7 days. If you didn't expect this email, you can safely ignore it.<br/>
            <span style="color: #d1d5db;">Link: ${inviteLink}</span>
          </p>
        </div>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
};

export default transporter;
