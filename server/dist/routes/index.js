"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainRouter = void 0;
const express_1 = __importDefault(require("express"));
const auth_route_1 = require("./auth.route");
const staticpage_route_1 = require("./staticpage.route");
const admin_route_1 = require("./admin.route");
const client_route_1 = require("./client.route");
const team_route_1 = require("./team.route");
const faq_route_1 = require("./faq.route");
const contactus_route_1 = require("./contactus.route");
const sitesetting_route_1 = require("./sitesetting.route");
exports.mainRouter = express_1.default.Router();
exports.mainRouter.use("/auth", auth_route_1.authRouter);
exports.mainRouter.use("/staticpage", staticpage_route_1.staticPageRouter);
exports.mainRouter.use("/admin", admin_route_1.adminRouter);
exports.mainRouter.use("/client", client_route_1.clientRouter);
exports.mainRouter.use("/team", team_route_1.teamRouter);
exports.mainRouter.use("/faq", faq_route_1.faqRouter);
exports.mainRouter.use("/contact-us", contactus_route_1.contactUsRouter);
exports.mainRouter.use("/site-setting", sitesetting_route_1.siteSettingRouter);
//# sourceMappingURL=index.js.map