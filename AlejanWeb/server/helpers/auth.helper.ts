// import { COUNTRY, GENDER } from "@prisma/client";
import { z } from "zod";

// {
//   "username": "user12",
//   "firstName": "Hello",
//   "middleName": "", // optional
//   "lastName": "World",
//   "gender": "",
//   "email": "",
//   "phoneNumber": 9876543212, // 9876543212,
//   "dob": "",
//   "country": ""
// }

// Define a regular expression for phone number validation (10 or 11 digits)
// const phoneNumberRegex = /^\d{10,11}$/;
const phoneNumberWithCountryCodeRegex =
  /^\+?\d{1,3}?[-.\s]?\(?\d{2,4}\)?[-.\s]?\d{3,4}[-.\s]?\d{4}$/;

// Calculate the minimum date (18 years ago from today)
const minDate = new Date(
  new Date().getFullYear() - 18,
  new Date().getMonth(),
  new Date().getDate()
);

export const registrationValidation = z.object({
  username: z
    .string({ message: "username is required" })
    .min(3, { message: "username is required" })
    .toLowerCase()
    .or(z.literal(''))
    .optional(),
  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email format" })
    .toLowerCase()
    .or(z.literal(''))
    .optional(),
  password: z
    .string({ message: "password is required" })
    .min(8, { message: "password must be min 8 char" })
    .or(z.literal(''))
    .optional(),
});
export const registrationChangeValidation = z.object({
  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email format" })
    .toLowerCase(),
  phoneNumber: z
    .string()
    .refine((value) => phoneNumberWithCountryCodeRegex.test(value.toString()), {
      message: "Invalid phone number format.",
    }),
  userId: z
    .string({ message: "userId is required" })
    .min(3, { message: "userId is required" }),
});

export const loginValidation = z.object({
  email: z
    .string({ message: "email or username is required" })
    .optional(),

  password: z
    .string({ message: "password is required" })
    .min(8, { message: "password must be min 8 char" })
    .optional(),
});

export const checkUsernameValidation = z.object({
  username: z
    .string({ message: "username is required" })
    .min(3, { message: "username is required" }),
});
export const checkPhoneNumberValidation = z.object({
  phoneNumber: z
    .string({ message: "username is required" })
    .min(3, { message: "username is required" }),
});
export const checkEmalValidation = z.object({
  email: z
    .string({ message: "username is required" })
    .email()
});

export const emailVerifySendValidation = z.object({
  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email format" })
    .toLowerCase(),
  userId: z
    .string({ message: "userId is required" })
    .min(3, { message: "userId is required" }),
  type: z.enum(["NEW", "CHANGE"]),
});
export const phoneVerifySendValidation = z.object({
  phoneNumber: z
    .string()
    // .positive()
    .refine((value) => phoneNumberWithCountryCodeRegex.test(value.toString()), {
      message: "Invalid phone number format.",
    }),
  userId: z
    .string({ message: "userId is required" })
    .min(3, { message: "userId is required" }),
  type: z.enum(["NEW", "CHANGE"]),
});

export const otpVerifyValidation = z.object({
  otp: z.number({ message: "OTP is required" }).min(100000).max(999999),
  id: z
    .string({ message: "id is required" })
    .min(3, { message: "id is required" }),
});



export const forgotUsernameValidation = z.object({
  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email format" }),
  firstName: z
    .string({ message: "First Name is required" })
    .min(3, { message: "First Name is required" }),
  lastName: z
    .string({ message: "Last Name is required" })
    .min(3, { message: "Last Name is required" }),
});
export const forgotPasswordValidation = z.object({
  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email format" }),
});
export const resetPasswordValidation = z.object({
  userId: z.string({ message: "userId is required" }),
  token: z.string({ message: "token is required" }),
  password: z.string({ required_error: "password is required" }),
});

export const resetPasswordTokenVerifyValidation = z.object({
  token: z
    .string({ message: "token is required" }),
});

export const resetPasswordLinkValidation = z.object({
  email: z
    .string({ message: "email is required" })
    .email({ message: "invalid email format" }),
});