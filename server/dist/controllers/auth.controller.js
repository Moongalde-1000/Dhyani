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
exports.logout = exports.deleteAccount = exports.changePassword = exports.forgotPassword = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = require("../db");
const multer_1 = __importDefault(require("multer"));
const date_fns_1 = require("date-fns");
const password_1 = require("../utils/password");
const client_1 = require("@prisma/client");
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "";
const JWT_SECRET = process.env.JWT_SECRET || "";
const FRONT_URL = process.env.FRONT_URL || "";
const TOKEN_EXPIRY_MINUTES = 30;
const VERIFICATION_CODE_EXPIRY_MINUTES = 10;
const prisma = new client_1.PrismaClient();
const generateVerificationCode = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                success: 0,
                message: "Email and password are required",
                data: {}
            });
        }
        const identifier = String(email).trim().toLowerCase();
        const user = yield db_1.db.users.findFirst({
            where: {
                OR: [
                    { email: identifier },
                    { username: identifier }
                ]
            },
            select: {
                id: true,
                email: true,
                username: true,
                password: true,
                role: true,
                displayName: true,
                fullName: true,
                phone: true,
            },
        });
        if (!user) {
            return res
                .status(401)
                .json({ success: 0, message: "Invalid email/username or password", data: {} });
        }
        if (!(yield bcrypt_1.default.compare(password, user.password))) {
            return res
                .status(401)
                .send({ success: 0, message: "Invalid Password", data: {} });
        }
        const jwtPayload = {
            userId: user.id,
            displayName: user.displayName || "",
            email: user.email,
            fullName: user.fullName || "",
            role: user.role,
        };
        console.log('jwtPayload', jwtPayload);
        const refreshToken = jsonwebtoken_1.default.sign(jwtPayload, REFRESH_TOKEN_SECRET, {
            expiresIn: "30d",
        });
        const sessionToken = jsonwebtoken_1.default.sign(jwtPayload, JWT_SECRET, {
            expiresIn: "2h",
        });
        const verificationCode = generateVerificationCode();
        const verificationExpiry = (0, date_fns_1.addMinutes)(new Date(), VERIFICATION_CODE_EXPIRY_MINUTES);
        const lastLoginAt = new Date();
        const data = {
            userId: user.id,
            fullName: user.fullName || "",
            displayName: user.displayName || "",
            email: user.email,
            phone: user.phone,
            lastLoginAt: lastLoginAt,
        };
        if (user.role === "ADMIN") {
            res.status(200).json({
                success: 1,
                message: "Login successful",
                sessionToken,
                refreshToken,
                data,
            });
        }
        else if (user.role === "CLIENT") {
            yield db_1.db.users.update({
                where: { id: user.id },
                data: {
                    lastLoginAt: new Date(),
                },
            });
            return res.status(200).json({
                success: 1,
                message: "Login successful",
                sessionToken,
                refreshToken,
                data,
            });
        }
        else {
            yield db_1.db.users.update({
                where: { id: user.id },
                data: {
                    lastLoginAt: new Date(),
                },
            });
            return res.status(200).json({
                success: 1,
                message: 'Verification code sent to your email',
                data
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: 0 });
    }
});
exports.login = login;
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                success: 0,
                message: "Email is required",
            });
        }
        const user = yield db_1.db.users.findFirst({
            where: { email: email.toLowerCase() },
        });
        if (!user) {
            return res.status(200).json({
                success: 1,
                message: "If your email exists in our system, you will receive a password reset email",
            });
        }
        const newPassword = (0, password_1.generateRandomPassword)();
        const hashedPassword = yield (0, password_1.hashPassword)(newPassword);
        yield db_1.db.users.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                authToken: null,
            },
        });
        return res.status(200).json({
            success: 1,
            message: "Password reset email sent successfully. Please check your email for the new password.",
        });
    }
    catch (error) {
        console.error("Forgot password error:", error);
        return res.status(500).json({
            success: 0,
            message: "An error occurred while processing your request. Please try again later.",
        });
    }
});
exports.forgotPassword = forgotPassword;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { oldPassword, newPassword, confirmPassword } = req.body;
        if (!oldPassword || !newPassword || !confirmPassword) {
            return res.status(400).json({
                success: 0,
                message: "oldPassword, newPassword and confirmPassword are required",
            });
        }
        if (newPassword !== confirmPassword) {
            return res
                .status(400)
                .json({ success: 0, message: "New password and confirm password do not match" });
        }
        const user = yield db_1.db.users.findUnique({
            where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId },
        });
        if (!user) {
            return res
                .status(401)
                .json({ success: 0, message: "Username not found", details: { path: "username" } });
        }
        if (!(yield bcrypt_1.default.compare(oldPassword, user.password))) {
            return res
                .status(401)
                .send({ success: 0, message: "Invalid Old Password", details: { path: "oldPassword" } });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const findResult = yield db_1.db.users.update({
            where: {
                id: user.id,
            },
            data: {
                password: hashedPassword
            }
        });
        res.status(200).json({
            success: 1,
            message: "Password Updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.changePassword = changePassword;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existingUser = yield prisma.users.findUnique({
            where: { id }
        });
        if (!existingUser) {
            return res.status(404).json({ success: 0, message: 'User not found' });
        }
        yield prisma.users.delete({
            where: { id }
        });
        res.json({ success: 1, message: 'User deleted successfully' });
    }
    catch (error) {
        console.error('Error in deleteUser:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});
exports.deleteAccount = deleteAccount;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!userId) {
            return res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        yield prisma.users.update({
            where: { id: userId },
            data: { authToken: null },
        });
        return res.status(200).json({ success: 1, message: "Logout successful" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: 0, message: "Internal Server Error" });
    }
});
exports.logout = logout;
//# sourceMappingURL=auth.controller.js.map