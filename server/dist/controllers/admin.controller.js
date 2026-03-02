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
exports.deleteUserAccount = exports.getUserById = exports.adminSuspendUser = exports.getAllUser = void 0;
const db_1 = require("../db");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield db_1.db.users.findMany({
            where: {
                role: 'DEFAULT',
            },
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved users",
            data: users,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getAllUser = getAllUser;
const adminSuspendUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { suspend } = req.body;
        const user = yield db_1.db.users.findUnique({ where: { id } });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        const updated = yield db_1.db.users.update({ where: { id }, data: { is_suspended: !!suspend } });
        res.status(200).json({ success: true, message: suspend ? "User suspended" : "User unsuspended", data: updated });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.adminSuspendUser = adminSuspendUser;
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const user = yield db_1.db.users.findUnique({
            where: { id },
        });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        res.status(200).json({
            success: true,
            message: "User data retrieved successfully",
            data: user,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getUserById = getUserById;
const deleteUserAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
exports.deleteUserAccount = deleteUserAccount;
//# sourceMappingURL=admin.controller.js.map