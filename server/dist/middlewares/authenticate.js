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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "";
const authenticate = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const accessToken = (_a = req.header("Authorization")) === null || _a === void 0 ? void 0 : _a.replace("Bearer ", "");
    try {
        if (!accessToken) {
            return res.status(401).json({ error: "Unauthorized: No token provided" });
        }
        let decodedAccessToken = null;
        try {
            decodedAccessToken = jsonwebtoken_1.default.verify(accessToken, JWT_SECRET);
        }
        catch (error) {
            console.error(error);
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                return res.status(401).json({ error: "Unauthorized: Token expired" });
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return res.status(401).json({ error: "Unauthorized: Invalid token" });
            }
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (!decodedAccessToken) {
            return res
                .status(401)
                .json({ error: "Unauthorized: Invalid accessToken token" });
        }
        const user = yield prisma.users.findUnique({
            where: {
                id: decodedAccessToken.userId,
            },
        });
        if (!user) {
            return res
                .status(403)
                .json({ error: "Forbidden: User not found" });
        }
        req.user = decodedAccessToken;
        next();
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal Server Error" });
    }
});
exports.authenticate = authenticate;
//# sourceMappingURL=authenticate.js.map