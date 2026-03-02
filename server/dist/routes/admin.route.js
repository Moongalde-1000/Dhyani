"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminRouter = void 0;
const express_1 = __importDefault(require("express"));
const admin_controller_1 = require("../controllers/admin.controller");
exports.adminRouter = express_1.default.Router();
exports.adminRouter.get("/", admin_controller_1.getAllUser);
exports.adminRouter.get("/:id", admin_controller_1.getUserById);
exports.adminRouter.post("/:id/suspend", admin_controller_1.adminSuspendUser);
exports.adminRouter.delete('/delete/:id', admin_controller_1.deleteUserAccount);
//# sourceMappingURL=admin.route.js.map