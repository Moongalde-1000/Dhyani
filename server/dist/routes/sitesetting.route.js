"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.siteSettingRouter = void 0;
const express_1 = __importDefault(require("express"));
const sitesetting_controller_1 = require("../controllers/sitesetting.controller");
const middlewares_1 = require("../middlewares");
exports.siteSettingRouter = express_1.default.Router();
exports.siteSettingRouter.get("/", sitesetting_controller_1.getSiteSetting);
exports.siteSettingRouter.post("/", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), sitesetting_controller_1.upsertSiteSetting);
//# sourceMappingURL=sitesetting.route.js.map