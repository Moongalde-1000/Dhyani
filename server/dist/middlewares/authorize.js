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
exports.authorize = void 0;
const client_1 = require("@prisma/client");
const authorize = (roles = [client_1.UserRole.DEFAULT]) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        const role = (_a = req.user) === null || _a === void 0 ? void 0 : _a.role;
        console.log("User role:", req.user);
        if (!role) {
            return res.status(403).send("Unauthorized: role not found");
        }
        if (!roles.includes(role)) {
            return res.status(403).send("Forbidden: Insufficient permissions");
        }
        next();
    });
};
exports.authorize = authorize;
//# sourceMappingURL=authorize.js.map