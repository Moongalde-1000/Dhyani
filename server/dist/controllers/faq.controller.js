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
exports.deleteFaq = exports.updateFaq = exports.getFaqList = exports.getFaq = exports.createFaq = void 0;
const db_1 = require("../db");
const createFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description } = req.body;
        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }
        const faqEntry = yield db_1.db.faq.create({
            data: {
                title,
                description,
            },
        });
        return res.status(201).json({ success: true, message: "FAQ entry created successfully", data: faqEntry });
    }
    catch (error) {
        console.error("Error in createFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createFaq = createFaq;
const getFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const faqEntry = yield db_1.db.faq.findUnique({ where: { id } });
        if (!faqEntry)
            return res.status(404).json({ success: false, message: "FAQ entry not found" });
        return res.status(200).json({ success: true, message: "FAQ entry found", data: faqEntry });
    }
    catch (error) {
        console.error("Error in getFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getFaq = getFaq;
const getFaqList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const faqEntries = yield db_1.db.faq.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved FAQ entries",
            data: faqEntries,
        });
    }
    catch (error) {
        console.error("Error in getFaqList:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getFaqList = getFaqList;
const updateFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { title, description } = req.body;
        const existing = yield db_1.db.faq.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "FAQ entry not found" });
        const updated = yield db_1.db.faq.update({
            where: { id },
            data: { title, description }
        });
        return res.status(200).json({ success: true, message: "FAQ entry updated successfully", data: updated });
    }
    catch (error) {
        console.error("Error in updateFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateFaq = updateFaq;
const deleteFaq = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existing = yield db_1.db.faq.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "FAQ entry not found" });
        yield db_1.db.faq.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "FAQ entry deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteFaq = deleteFaq;
//# sourceMappingURL=faq.controller.js.map