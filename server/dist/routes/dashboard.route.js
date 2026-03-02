"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const dashboard_controller_1 = require("../controllers/dashboard.controller");
exports.dashboardRouter = express_1.default.Router();
exports.dashboardRouter.get("/", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), dashboard_controller_1.getDashboard);
//# sourceMappingURL=dashboard.route.js.map