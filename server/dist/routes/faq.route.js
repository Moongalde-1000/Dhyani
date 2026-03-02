"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.faqRouter = void 0;
const express_1 = __importDefault(require("express"));
const faq_controller_1 = require("../controllers/faq.controller");
const middlewares_1 = require("../middlewares");
exports.faqRouter = express_1.default.Router();
exports.faqRouter.post("/", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), faq_controller_1.createFaq);
exports.faqRouter.put("/:id", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), faq_controller_1.updateFaq);
exports.faqRouter.get("/", faq_controller_1.getFaqList);
exports.faqRouter.get("/:id", faq_controller_1.getFaq);
exports.faqRouter.delete("/:id", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), faq_controller_1.deleteFaq);
//# sourceMappingURL=faq.route.js.map