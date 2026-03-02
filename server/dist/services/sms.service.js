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
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSMS = exports.verifySmsSend = void 0;
const general_1 = require("../utils/general");
const db_1 = require("../db");
const twilio_1 = require("twilio");
const verifySmsSend = (phoneNumber, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const otp = (0, general_1.generateOTP)();
    const resSave = yield db_1.db.verifyPhone.create({
        data: {
            phone: `${phoneNumber}`,
            otp: otp,
            UserId: userId,
        },
    });
    const content = `Your  OTP Is ${otp}`;
    (0, exports.sendSMS)(`${phoneNumber}`, content);
    return { verifyId: resSave.id, otp: resSave.otp };
});
exports.verifySmsSend = verifySmsSend;
const sendSMS = (to, content) => __awaiter(void 0, void 0, void 0, function* () {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const TWILIO_NUMBER = process.env.TWILIO_NUMBER;
    const client = new twilio_1.Twilio(accountSid, authToken);
    const message = yield client.messages.create({
        body: content,
        from: TWILIO_NUMBER,
        to: to,
    });
    console.log(message.body);
});
exports.sendSMS = sendSMS;
//# sourceMappingURL=sms.service.js.map