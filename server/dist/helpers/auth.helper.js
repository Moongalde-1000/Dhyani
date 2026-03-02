"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordLinkValidation = exports.resetPasswordTokenVerifyValidation = exports.resetPasswordValidation = exports.forgotPasswordValidation = exports.forgotUsernameValidation = exports.otpVerifyValidation = exports.phoneVerifySendValidation = exports.emailVerifySendValidation = exports.checkEmalValidation = exports.checkPhoneNumberValidation = exports.checkUsernameValidation = exports.loginValidation = exports.registrationChangeValidation = exports.registrationValidation = void 0;
const zod_1 = require("zod");
const phoneNumberWithCountryCodeRegex = /^\+?\d{1,3}?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/;
const minDate = new Date(new Date().getFullYear() - 18, new Date().getMonth(), new Date().getDate());
exports.registrationValidation = zod_1.z.object({
    username: zod_1.z
        .string({ message: "username is required" })
        .min(3, { message: "username is required" })
        .toLowerCase()
        .or(zod_1.z.literal(''))
        .optional(),
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email format" })
        .toLowerCase()
        .or(zod_1.z.literal(''))
        .optional(),
    password: zod_1.z
        .string({ message: "password is required" })
        .min(8, { message: "password must be min 8 char" })
        .or(zod_1.z.literal(''))
        .optional(),
});
exports.registrationChangeValidation = zod_1.z.object({
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email format" })
        .toLowerCase(),
    phoneNumber: zod_1.z
        .string()
        .refine((value) => phoneNumberWithCountryCodeRegex.test(value.toString()), {
        message: "Invalid phone number format.",
    }),
    userId: zod_1.z
        .string({ message: "userId is required" })
        .min(3, { message: "userId is required" }),
});
exports.loginValidation = zod_1.z.object({
    email: zod_1.z
        .string({ message: "email or username is required" })
        .optional(),
    password: zod_1.z
        .string({ message: "password is required" })
        .min(8, { message: "password must be min 8 char" })
        .optional(),
});
exports.checkUsernameValidation = zod_1.z.object({
    username: zod_1.z
        .string({ message: "username is required" })
        .min(3, { message: "username is required" }),
});
exports.checkPhoneNumberValidation = zod_1.z.object({
    phoneNumber: zod_1.z
        .string({ message: "username is required" })
        .min(3, { message: "username is required" }),
});
exports.checkEmalValidation = zod_1.z.object({
    email: zod_1.z
        .string({ message: "username is required" })
        .email()
});
exports.emailVerifySendValidation = zod_1.z.object({
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email format" })
        .toLowerCase(),
    userId: zod_1.z
        .string({ message: "userId is required" })
        .min(3, { message: "userId is required" }),
    type: zod_1.z.enum(["NEW", "CHANGE"]),
});
exports.phoneVerifySendValidation = zod_1.z.object({
    phoneNumber: zod_1.z
        .string()
        .refine((value) => phoneNumberWithCountryCodeRegex.test(value.toString()), {
        message: "Invalid phone number format.",
    }),
    userId: zod_1.z
        .string({ message: "userId is required" })
        .min(3, { message: "userId is required" }),
    type: zod_1.z.enum(["NEW", "CHANGE"]),
});
exports.otpVerifyValidation = zod_1.z.object({
    otp: zod_1.z.number({ message: "OTP is required" }).min(100000).max(999999),
    id: zod_1.z
        .string({ message: "id is required" })
        .min(3, { message: "id is required" }),
});
exports.forgotUsernameValidation = zod_1.z.object({
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email format" }),
    firstName: zod_1.z
        .string({ message: "First Name is required" })
        .min(3, { message: "First Name is required" }),
    lastName: zod_1.z
        .string({ message: "Last Name is required" })
        .min(3, { message: "Last Name is required" }),
});
exports.forgotPasswordValidation = zod_1.z.object({
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email format" }),
});
exports.resetPasswordValidation = zod_1.z.object({
    userId: zod_1.z.string({ message: "userId is required" }),
    token: zod_1.z.string({ message: "token is required" }),
    password: zod_1.z.string({ required_error: "password is required" }),
});
exports.resetPasswordTokenVerifyValidation = zod_1.z.object({
    token: zod_1.z
        .string({ message: "token is required" }),
});
exports.resetPasswordLinkValidation = zod_1.z.object({
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email format" }),
});
//# sourceMappingURL=auth.helper.js.map