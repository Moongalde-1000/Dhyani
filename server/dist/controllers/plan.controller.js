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
exports.getPlanList = exports.createPlan = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createPlan = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const anyReq = req;
        const { noOfQrCode, price } = req.body || {};
        if (!noOfQrCode) {
            return res.status(400).json({ success: false, message: "noOfQrCode is required" });
        }
        if (!price) {
            return res.status(400).json({ success: false, message: "price is required" });
        }
        const created = yield prisma.planPurchase.create({
            data: {
                noOfQrCode,
                price,
            },
        });
        const responseData = Object.assign({}, created);
        return res.status(201).json({ success: true, message: "Created", data: responseData });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createPlan = createPlan;
const getPlanList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const plan = yield prisma.planPurchase.findMany({});
        res.status(200).json({
            success: true,
            message: "Successfully retrieved plans",
            data: plan,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getPlanList = getPlanList;
//# sourceMappingURL=plan.controller.js.map