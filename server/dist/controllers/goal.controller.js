"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteGoal = exports.editGoal = exports.getGoalById = exports.getAllGoals = exports.createGoal = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { goalTitle, goalImage, description, isActive } = req.body;
        if (!goalTitle || !goalImage || !description) {
            return res.status(400).json({
                success: false,
                message: 'Missing required fields: goalTitle, goalImage, and description are required'
            });
        }
        const goal = yield prisma.goal.create({
            data: {
                goalTitle,
                goalImage,
                description,
                isActive: isActive || 1
            }
        });
        return res.status(201).json({
            success: true,
            message: 'Goal created successfully',
            data: goal
        });
    }
    catch (error) {
        console.error('Error creating goal:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.createGoal = createGoal;
const getAllGoals = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const goals = yield prisma.goal.findMany();
        return res.status(200).json({
            success: true,
            message: 'Goals fetched successfully',
            data: goals
        });
    }
    catch (error) {
        console.error('Error fetching goals:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getAllGoals = getAllGoals;
const getGoalById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const goal = yield prisma.goal.findUnique({ where: { id } });
        if (!goal) {
            return res.status(404).json({ success: false, message: 'Goal not found' });
        }
        return res.status(200).json({ success: true, data: goal });
    }
    catch (error) {
        console.error('Error fetching goal by id:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getGoalById = getGoalById;
const editGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { goalTitle, goalImage, description, isActive } = req.body;
        const updatedGoal = yield prisma.goal.update({
            where: { id },
            data: { goalTitle, goalImage, description, isActive }
        });
        return res.status(200).json({
            success: true,
            message: 'Goal updated successfully',
            data: updatedGoal
        });
    }
    catch (error) {
        console.error('Error updating goal:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.editGoal = editGoal;
const deleteGoal = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        yield prisma.goal.delete({ where: { id } });
        return res.status(200).json({ success: true, message: 'Goal deleted successfully' });
    }
    catch (error) {
        console.error('Error deleting goal:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deleteGoal = deleteGoal;
//# sourceMappingURL=goal.controller.js.map