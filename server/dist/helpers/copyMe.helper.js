"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyMeValidation = void 0;
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
exports.copyMeValidation = zod_1.z.object({
    username: zod_1.z.string({ message: "username is required" }).toLowerCase(),
    email: zod_1.z
        .string({ message: "email is required" })
        .email({ message: "invalid email format" })
        .toLowerCase(),
    password: zod_1.z
        .string({ message: "password is required" })
        .min(8, { message: "password must be min 8 char" }),
    firstName: zod_1.z.string({ message: "first name is required" }),
    middleName: zod_1.z.string().toLowerCase().optional(),
    lastName: zod_1.z.string({ message: "last name is required" }),
    gender: zod_1.z.nativeEnum(client_1.Gender),
});
//# sourceMappingURL=copyMe.helper.js.map