"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.copyMeRouter = void 0;
const express_1 = __importDefault(require("express"));
const copyMe_helper_1 = require("../helpers/copyMe.helper");
const copyMe_controller_1 = require("../controllers/copyMe.controller");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const middlewares_1 = require("../middlewares");
exports.copyMeRouter = express_1.default.Router();
exports.copyMeRouter.post("/", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), (0, validationMiddleware_1.validateData)(copyMe_helper_1.copyMeValidation), copyMe_controller_1.copyMe);
//# sourceMappingURL=copyMe.route.js.map