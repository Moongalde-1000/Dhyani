"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeLogRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const changeLog_controller_1 = require("../controllers/changeLog.controller");
exports.changeLogRouter = express_1.default.Router();
exports.changeLogRouter.get("/user", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), changeLog_controller_1.getChangeLogUser);
//# sourceMappingURL=changeLog.route.js.map