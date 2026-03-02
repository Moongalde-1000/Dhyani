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
exports.changePassword = exports.updateUser = exports.getUsers = exports.getUserById = void 0;
const db_1 = require("../db");
const changeLog_helper_1 = require("../helpers/changeLog.helper");
const bcrypt_1 = __importDefault(require("bcrypt"));
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const findResult = yield db_1.db.users.findUnique({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
                username: true,
                gender: true,
                dob: true,
                role: true,
            },
            where: {
                id: id,
            },
        });
        res.status(200).json({
            success: true,
            message: "Successfully",
            data: findResult,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getUserById = getUserById;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const findResult = yield db_1.db.users.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                middleName: true,
                email: true,
                username: true,
                gender: true,
                dob: true,
                role: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Successfully",
            data: findResult,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getUsers = getUsers;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        const { gender, dob, firstName, lastName, middleName, imageUrl, designation } = req.body;
        let error = false;
        let errorDetails = [];
        const findResult = yield db_1.db.users.findFirst({
            where: {
                id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId,
            },
        });
        if (!findResult) {
            error = true;
            errorDetails.push({
                path: "user",
                message: "User not found",
            });
        }
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Invalid data",
                details: errorDetails,
            });
        }
        const saveData = yield db_1.db.users.update({
            where: {
                id: (_b = req.user) === null || _b === void 0 ? void 0 : _b.userId,
            },
            data: {
                firstName,
                lastName,
                middleName,
                gender,
                dob: dob && new Date(dob),
            },
        });
        (0, changeLog_helper_1.addChangeLog)({
            userId: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.userId) || "",
            role: ((_d = req.user) === null || _d === void 0 ? void 0 : _d.role) || "DEFAULT",
            module: "user",
            description: `Update User : ${(findResult === null || findResult === void 0 ? void 0 : findResult.username) || ""}`,
            oldValues: findResult || {},
            newValues: saveData,
        });
        res.status(200).json({
            success: true,
            message: "Updated successfully",
            data: saveData,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.updateUser = updateUser;
const changePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    try {
        const { oldPassword, newPassword } = req.body;
        const user = yield db_1.db.users.findUnique({
            where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId },
        });
        if (!user) {
            return res
                .status(401)
                .json({ success: false, message: "Username not found", details: { path: "username" } });
        }
        if (!(yield bcrypt_1.default.compare(oldPassword, user.password))) {
            return res
                .status(401)
                .send({ success: false, message: "Invalid Old Password", details: { path: "oldPassword" } });
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
        (0, changeLog_helper_1.addChangeLog)({
            userId: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.userId) || "",
            role: ((_c = req.user) === null || _c === void 0 ? void 0 : _c.role) || "DEFAULT",
            module: "user",
            description: `Profile Password Updated`,
            oldValues: user || {},
            newValues: findResult,
        });
        res.status(200).json({
            success: true,
            message: "Password Updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.changePassword = changePassword;
//# sourceMappingURL=user.controller.js.map