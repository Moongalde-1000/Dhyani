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
exports.suspendClient = exports.getClientById = exports.editClient = exports.addClient = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret";
const addClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, phonenumber, password } = req.body;
        if (!userName || !email || !password) {
            return res.status(400).json({
                success: 0,
                message: "UserName, email and password are required",
            });
        }
        const normalizedEmail = email.toLowerCase().trim();
        const existingUser = yield prisma.users.findUnique({
            where: { email: normalizedEmail },
        });
        if (existingUser) {
            return res.status(409).json({
                success: 0,
                message: "Email already exists",
            });
        }
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const newClient = yield prisma.users.create({
            data: {
                fullName: userName,
                displayName: userName,
                username: userName.toLowerCase().trim(),
                email: normalizedEmail,
                phone: phonenumber || null,
                password: hashedPassword,
                role: "CLIENT",
            },
        });
        const authToken = jsonwebtoken_1.default.sign({ userId: newClient.id, email: newClient.email, role: newClient.role }, JWT_SECRET, { expiresIn: "7d" });
        const updatedClient = yield prisma.users.update({
            where: { id: newClient.id },
            data: { authToken },
        });
        return res.status(201).json({
            success: 1,
            message: "Client added successfully",
            data: {
                id: updatedClient.id,
                userName: updatedClient.displayName,
                email: updatedClient.email,
                phonenumber: updatedClient.phone,
                role: updatedClient.role,
                authToken: updatedClient.authToken,
            },
        });
    }
    catch (error) {
        console.error("Add Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.addClient = addClient;
const editClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { userName, email, phonenumber, password } = req.body;
        const client = yield prisma.users.findUnique({
            where: { id },
        });
        if (!client || client.role !== "CLIENT") {
            return res.status(404).json({
                success: 0,
                message: "Client not found",
            });
        }
        const updateData = {};
        if (userName) {
            updateData.fullName = userName;
            updateData.displayName = userName;
            updateData.username = userName.toLowerCase().trim();
        }
        if (email) {
            const normalizedEmail = email.toLowerCase().trim();
            const existingEmail = yield prisma.users.findUnique({
                where: { email: normalizedEmail },
            });
            if (existingEmail && existingEmail.id !== id) {
                return res.status(409).json({
                    success: 0,
                    message: "Email already exists",
                });
            }
            updateData.email = normalizedEmail;
        }
        if (phonenumber)
            updateData.phone = phonenumber;
        if (password) {
            updateData.password = yield bcrypt_1.default.hash(password, 10);
        }
        const updatedClient = yield prisma.users.update({
            where: { id },
            data: updateData,
        });
        return res.status(200).json({
            success: 1,
            message: "Client updated successfully",
            data: {
                id: updatedClient.id,
                userName: updatedClient.displayName,
                email: updatedClient.email,
                phonenumber: updatedClient.phone,
                role: updatedClient.role,
            },
        });
    }
    catch (error) {
        console.error("Edit Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.editClient = editClient;
const getClientById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const client = yield prisma.users.findUnique({
            where: { id },
        });
        if (!client || client.role !== "CLIENT") {
            return res.status(404).json({
                success: 0,
                message: "Client not found",
            });
        }
        return res.status(200).json({
            success: 1,
            data: {
                id: client.id,
                userName: client.displayName,
                email: client.email,
                role: client.role,
                phonenumber: client.phone,
                profileImage: client.profileImage,
                is_suspended: client.is_suspended,
                createdAt: client.createdAt,
                updatedAt: client.updatedAt,
                lastLoginAt: client.lastLoginAt
            },
        });
    }
    catch (error) {
        console.error("Get Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.getClientById = getClientById;
const suspendClient = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { suspend } = req.body;
        if (typeof suspend !== 'boolean') {
            return res.status(400).json({
                success: 0,
                message: "Property 'suspend' (boolean) is required in the request body",
            });
        }
        const client = yield prisma.users.findUnique({
            where: { id },
        });
        if (!client || client.role !== "CLIENT") {
            return res.status(404).json({
                success: 0,
                message: "Client not found",
            });
        }
        const updatedClient = yield prisma.users.update({
            where: { id },
            data: { is_suspended: suspend },
        });
        return res.status(200).json({
            success: 1,
            message: suspend ? "Client suspended successfully" : "Client unsuspended successfully",
            data: {
                id: updatedClient.id,
                is_suspended: updatedClient.is_suspended,
            },
        });
    }
    catch (error) {
        console.error("Suspend Client Error:", error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            error: error.message,
        });
    }
});
exports.suspendClient = suspendClient;
//# sourceMappingURL=client.controller.js.map