"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clientRouter = void 0;
const express_1 = __importDefault(require("express"));
const client_controller_1 = require("../controllers/client.controller");
const authenticate_1 = require("../middlewares/authenticate");
exports.clientRouter = express_1.default.Router();
exports.clientRouter.post("/add", client_controller_1.addClient);
exports.clientRouter.put("/edit/:id", authenticate_1.authenticate, client_controller_1.editClient);
exports.clientRouter.get("/:id", authenticate_1.authenticate, client_controller_1.getClientById);
exports.clientRouter.post("/:id/suspend", authenticate_1.authenticate, client_controller_1.suspendClient);
//# sourceMappingURL=client.route.js.map