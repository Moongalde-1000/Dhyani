"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactUsRouter = void 0;
const express_1 = __importDefault(require("express"));
const contactus_controller_1 = require("../controllers/contactus.controller");
const middlewares_1 = require("../middlewares");
exports.contactUsRouter = express_1.default.Router();
exports.contactUsRouter.post("/", contactus_controller_1.createContactUs);
exports.contactUsRouter.get("/", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), contactus_controller_1.getContactUsList);
exports.contactUsRouter.get("/:id", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), contactus_controller_1.getContactUsById);
//# sourceMappingURL=contactus.route.js.map