import nodemailer from 'nodemailer';
import { config } from 'dotenv';

config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export const sendPasswordResetEmail = async (email: string, newPassword: string) => {
  try {
    const mailOptions = {
      from: `"${process.env.EMAIL_FROM_NAME || 'ATH App'}" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Password Reset - ATH App',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset</h2>
          <p>Your password has been reset successfully. Here is your new temporary password:</p>
          <div style="background-color: #f5f5f5; padding: 10px; border-radius: 5px; margin: 15px 0;">
            <h3 style="margin: 0; color: #333;">${newPassword}</h3>
          </div>
          <p>Please log in using this password and change it immediately for security reasons.</p>
          <p>If you didn't request this change, please contact our support team immediately.</p>
          <p>Best regards,<br>ATH App Team</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return false;
  }
};
