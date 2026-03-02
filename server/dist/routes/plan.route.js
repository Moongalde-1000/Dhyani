"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.planRouter = void 0;
const express_1 = __importDefault(require("express"));
const plan_controller_1 = require("../controllers/plan.controller");
exports.planRouter = express_1.default.Router();
exports.planRouter.post("/", plan_controller_1.createPlan);
exports.planRouter.get("/", plan_controller_1.getPlanList);
//# sourceMappingURL=plan.route.js.map