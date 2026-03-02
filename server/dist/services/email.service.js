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
exports.sendEmail = exports.verifyEmailSend = void 0;
const db_1 = require("../db");
const general_1 = require("../utils/general");
const mail_1 = __importDefault(require("@sendgrid/mail"));
const verifyEmailSend = (email, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, general_1.generateOTP)();
    const resSave = yield db_1.db.verifyEmail.create({
        data: {
            email: email,
            otp: otp,
            UserId: userId,
        },
    });
    const content = `your email verification code is ${otp}`;
    (0, exports.sendEmail)("Email Verification", email, content);
    console.log(`EMAIL SEND ${email} OTP ${otp}`);
    return { verifyId: resSave.id, otp: resSave.otp };
});
exports.verifyEmailSend = verifyEmailSend;
const sendEmail = (subject, toEmail, content) => {
    var _a;
    const SENDGRID_API_KEY = (_a = process.env.SENDGRID_API_KEY) !== null && _a !== void 0 ? _a : '';
    mail_1.default.setApiKey(SENDGRID_API_KEY);
    const msg = {
        to: toEmail,
        from: 'info@test.com',
        subject: subject,
        text: content,
        html: content,
    };
    mail_1.default
        .send(msg)
        .then((response) => {
        console.log(response[0].statusCode);
        console.log(response[0].headers);
    })
        .catch((error) => {
        console.error(error);
        console.error('error.body', error.response.body);
    });
};
exports.sendEmail = sendEmail;
//# sourceMappingURL=email.service.js.map