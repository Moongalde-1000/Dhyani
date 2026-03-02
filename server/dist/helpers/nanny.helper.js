"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editNannyValidation = exports.addNannyValidation = exports.changePaswordValidation = void 0;
const zod_1 = require("zod");
const urlWithoutProtocolSchema = zod_1.z.string().refine((value) => {
    const urlRegex = /^(?:(?:https?|ftp):\/\/)?(?:\S+(?::\S*)?@)?(?:www\.)?(?!-)([A-Za-z0-9-]{1,63}(?<!-)\.)+[A-Za-z]{2,6}(?:\/[^\s]*)?(?:\?[^\s#]*)?(?:#[^\s]*)?$/;
    return urlRegex.test(value);
}, "Invalid URL formats");
exports.changePaswordValidation = zod_1.z.object({
    oldPassword: zod_1.z.string({ message: "old password Info is required" }).min(3, { message: "min 3 char is required" }),
    newPassword: zod_1.z
        .string({ message: "new password is required" })
        .min(8, { message: "new password must be min 8 char" }),
});
exports.addNannyValidation = zod_1.z.object({
    username: zod_1.z.string({ message: "Username is required" }).min(3, { message: "Username must be at least 3 characters" }),
    email: zod_1.z.string({ message: "Email is required" }).email({ message: "Invalid email format" }),
    password: zod_1.z.string({ message: "Password is required" }).min(8, { message: "Password must be at least 8 characters" }),
    contactNumber: zod_1.z.string().optional(),
    role: zod_1.z.enum(["Nanny", "ADMIN"]).optional(),
});
exports.editNannyValidation = zod_1.z.object({
    username: zod_1.z.string().min(3, { message: "Username must be at least 3 characters" }).optional(),
    email: zod_1.z.string().email({ message: "Invalid email format" }).optional(),
    contactNumber: zod_1.z.string().optional(),
    role: zod_1.z.enum(["Nanny", "ADMIN"]).optional(),
});
//# sourceMappingURL=nanny.helper.js.map