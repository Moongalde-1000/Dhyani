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
exports.getStaticPage = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const JWT_SECRET = process.env.JWT_SECRET || "";
const prisma = new client_1.PrismaClient();
const getStaticPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { authToken, pageId } = req.query;
        if (!authToken || !pageId) {
            return res.status(400).json({
                success: 0,
                message: "Missing required params: authToken, pageId",
                data: {},
            });
        }
        try {
            const decoded = jsonwebtoken_1.default.verify(authToken, JWT_SECRET);
            if (!decoded || !decoded.userId) {
                return res.status(401).json({ success: 0, message: "Unauthorized" });
            }
            const user = yield prisma.users.findUnique({ where: { id: decoded.userId } });
            if (!user) {
                return res.status(404).json({ success: 0, message: "User not found" });
            }
        }
        catch (err) {
            return res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        const page = yield prisma.staticPages.findUnique({ where: { id: pageId } });
        if (!page) {
            return res.status(404).json({ success: 0, message: "Page not found" });
        }
        return res.status(200).json({
            success: 1,
            message: "Static page fetched successfully",
            data: {
                id: page.id,
                pageTitle: page.pageTitle,
                shortDescription: page.shortDescription,
                description: page.description,
                updatedAt: page.updatedAt,
            },
        });
    }
    catch (error) {
        console.error("getStaticPage error:", (error === null || error === void 0 ? void 0 : error.message) || error);
        return res.status(500).json({
            success: 0,
            message: "Internal Server Error",
            data: {},
        });
    }
});
exports.getStaticPage = getStaticPage;
//# sourceMappingURL====staticPage.controller.js.map