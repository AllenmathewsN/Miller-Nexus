import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendMagicLinkEmail({
  to,
  magicUrl,
  documentName,
  expiryDays,
  customMessage,
  senderName,
}: {
  to: string;
  magicUrl: string;
  documentName: string;
  expiryDays: number;
  customMessage?: string;
  senderName: string;
}) {
  const mailOptions = {
    from: `"${process.env.APP_NAME || 'Miller Nexus'}" <${process.env.SMTP_USER}>`,
    to,
    subject: `Document Access Invitation - ${documentName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #d4af37;">Document Access Invitation</h2>
        
        <p>Hello,</p>
        
        <p><strong>${senderName}</strong> has invited you to access: <strong>${documentName}</strong></p>

        ${customMessage ? `
        <div style="background: #fef3c7; padding: 15px; border-left: 4px solid #d4af37; margin: 20px 0;">
          <strong>Message:</strong><br/>
          ${customMessage}
        </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${magicUrl}" 
             style="background: #d4af37; color: black; padding: 12px 24px; 
                    text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            Access Document
          </a>
        </div>

        <div style="background: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0;">
          <strong>⚠️ Security Information:</strong>
          <ul style="margin: 10px 0; padding-left: 20px;">
            <li>This link expires in <strong>${expiryDays} days</strong></li>
            <li>This link can only be used <strong>once</strong></li>
            <li>Do not share this email with others</li>
          </ul>
        </div>

        <p style="color: #6b7280; font-size: 14px;">
          Button not working? Copy and paste this link:<br/>
          <a href="${magicUrl}" style="color: #d4af37; word-break: break-all;">
            ${magicUrl}
          </a>
        </p>

        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
        
        <p style="color: #9ca3af; font-size: 12px;">
          This is an automated message. Please do not reply to this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}
