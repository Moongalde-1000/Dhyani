"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.contactRouter = void 0;
const express_1 = __importDefault(require("express"));
const contact_controller_1 = require("../controllers/contact.controller");
exports.contactRouter = express_1.default.Router();
exports.contactRouter.post("/", contact_controller_1.createContact);
exports.contactRouter.get("/", contact_controller_1.getContacts);
exports.contactRouter.get("/:id", contact_controller_1.getContactById);
exports.contactRouter.delete("/:id", contact_controller_1.deleteContact);
//# sourceMappingURL=contact.route.js.map