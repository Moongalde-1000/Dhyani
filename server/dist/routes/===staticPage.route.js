"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticPageRouter = void 0;
const express_1 = __importDefault(require("express"));
const staticPage_controller_1 = require("../controllers/staticPage.controller");
exports.staticPageRouter = express_1.default.Router();
exports.staticPageRouter.get("/", staticPage_controller_1.getStaticPage);
//# sourceMappingURL====staticPage.route.js.map