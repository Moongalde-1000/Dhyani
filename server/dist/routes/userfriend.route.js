"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.friendRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const userfriend_controller_1 = require("../controllers/userfriend.controller");
exports.friendRouter = express_1.default.Router();
exports.friendRouter.post("/add", middlewares_1.authenticate, userfriend_controller_1.addUserFriend);
exports.friendRouter.get("/list", middlewares_1.authenticate, userfriend_controller_1.getFriendList);
exports.friendRouter.post("/block", middlewares_1.authenticate, userfriend_controller_1.blockUnblockFriend);
//# sourceMappingURL=userfriend.route.js.map