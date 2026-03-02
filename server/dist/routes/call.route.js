"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.callRouter = void 0;
const express_1 = __importDefault(require("express"));
const call_controller_1 = require("../controllers/call.controller");
exports.callRouter = express_1.default.Router();
exports.callRouter.post("/start", call_controller_1.startCall);
//# sourceMappingURL=call.route.js.map