import { z } from "zod";
const urlWithoutProtocolSchema = z.string().refine((value) => {
  const urlRegex =
    /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:www\.)?(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}(?:\/[^\s]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?$/;

  // const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:www\.)?(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}(?:\/[^\s]*)?$/;
  return urlRegex.test(value);
}, "Invalid URL formats");


export const changePaswordValidation = z.object({
  oldPassword: z.string({ message: "old password Info is required" }).min(3, { message: "min 3 char is required" }),
  newPassword: z
    .string({ message: "new password is required" })
    .min(8, { message: "new password must be min 8 char" }),
  
});

export const addUserValidation = z.object({
  username: z.string({ message: "Username is required" }).min(3, { message: "Username must be at least 3 characters" }),
  email: z.string({ message: "Email is required" }).email({ message: "Invalid email format" }),
  password: z.string({ message: "Password is required" }).min(8, { message: "Password must be at least 8 characters" }),
  contactNumber: z.string().optional(),
  role: z.enum(["DEFAULT", "ADMIN"]).optional(),
});

export const editUserValidation = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
  email: z.string().email({ message: "Invalid email format" }).optional(),
  contactNumber: z.string().optional(),
  role: z.enum(["DEFAULT", "ADMIN"]).optional(),
});