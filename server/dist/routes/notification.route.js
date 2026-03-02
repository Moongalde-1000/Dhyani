"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const notification_controller_1 = require("../controllers/notification.controller");
exports.notificationRouter = express_1.default.Router();
exports.notificationRouter.get("/", middlewares_1.authenticate, notification_controller_1.getNotifications);
//# sourceMappingURL=notification.route.js.map