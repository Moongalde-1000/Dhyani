"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendPasswordResetEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const transporter = nodemailer_1.default.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});
const sendPasswordResetEmail = (email, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
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
        yield transporter.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.error('Error sending password reset email:', error);
        return false;
    }
});
exports.sendPasswordResetEmail = sendPasswordResetEmail;
//# sourceMappingURL=email.js.map