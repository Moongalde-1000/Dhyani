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
exports.getContactUsById = exports.getContactUsList = exports.createContactUs = void 0;
const db_1 = require("../db");
const createContactUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, phone, subject } = req.body;
        if (!name || !email || !phone || !subject) {
            return res.status(400).json({ success: false, message: "All fields (name, email, phone, subject) are required" });
        }
        const contactInquiry = yield db_1.db.contactUs.create({
            data: {
                name,
                email,
                phone,
                subject,
            },
        });
        return res.status(201).json({ success: true, message: "Inquiry submitted successfully", data: contactInquiry });
    }
    catch (error) {
        console.error("Error in createContactUs:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createContactUs = createContactUs;
const getContactUsList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const inquiries = yield db_1.db.contactUs.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved contact inquiries",
            data: inquiries,
        });
    }
    catch (error) {
        console.error("Error in getContactUsList:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getContactUsList = getContactUsList;
const getContactUsById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const inquiry = yield db_1.db.contactUs.findUnique({ where: { id } });
        if (!inquiry)
            return res.status(404).json({ success: false, message: "Contact inquiry not found" });
        return res.status(200).json({ success: true, message: "Inquiry found", data: inquiry });
    }
    catch (error) {
        console.error("Error in getContactUsById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getContactUsById = getContactUsById;
//# sourceMappingURL=contactus.controller.js.map