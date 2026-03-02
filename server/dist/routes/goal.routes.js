"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const goal_controller_1 = require("../controllers/goal.controller");
const router = (0, express_1.Router)();
router.post('/create', goal_controller_1.createGoal);
router.get('/', goal_controller_1.getAllGoals);
router.get('/:id', goal_controller_1.getGoalById);
router.put('/:id', goal_controller_1.editGoal);
router.delete('/:id', goal_controller_1.deleteGoal);
exports.default = router;
//# sourceMappingURL=goal.routes.js.map