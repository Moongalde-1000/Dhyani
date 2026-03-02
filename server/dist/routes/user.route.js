"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const user_controller_1 = require("../controllers/user.controller");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const user_helper_1 = require("../helpers/user.helper");
const middlewares_2 = require("../middlewares");
exports.userRouter = express_1.default.Router();
exports.userRouter.post("/editProfile", middlewares_2.authenticate, user_controller_1.editProfile);
exports.userRouter.get("/", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), user_controller_1.getDefaultUsers);
exports.userRouter.put("/", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), user_controller_1.updateUser);
exports.userRouter.post("/change-password", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), (0, validationMiddleware_1.validateData)(user_helper_1.changePaswordValidation), user_controller_1.changePassword);
//# sourceMappingURL=user.route.js.map