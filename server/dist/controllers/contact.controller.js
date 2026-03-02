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
exports.deleteContact = exports.getContactById = exports.getContacts = exports.createContact = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, phone, email, subject, message } = req.body;
        if (!name || !phone || !email || !subject || !message) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
                data: null
            });
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Invalid email format",
                data: null
            });
        }
        const contact = yield prisma.contact.create({
            data: {
                name,
                phone,
                email,
                subject,
                message
            }
        });
        res.status(201).json({
            success: true,
            message: "Contact form submitted successfully",
            data: contact
        });
    }
    catch (error) {
        console.error("Error creating contact:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
});
exports.createContact = createContact;
const getContacts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const contacts = yield prisma.contact.findMany({
            orderBy: {
                createdAt: 'desc'
            }
        });
        res.status(200).json({
            success: true,
            message: "Contacts retrieved successfully",
            data: contacts
        });
    }
    catch (error) {
        console.error("Error fetching contacts:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
});
exports.getContacts = getContacts;
const getContactById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contact = yield prisma.contact.findUnique({
            where: { id }
        });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
                data: null
            });
        }
        res.status(200).json({
            success: true,
            message: "Contact retrieved successfully",
            data: contact
        });
    }
    catch (error) {
        console.error("Error fetching contact:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
});
exports.getContactById = getContactById;
const deleteContact = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const contact = yield prisma.contact.findUnique({
            where: { id }
        });
        if (!contact) {
            return res.status(404).json({
                success: false,
                message: "Contact not found",
                data: null
            });
        }
        yield prisma.contact.delete({
            where: { id }
        });
        res.status(200).json({
            success: true,
            message: "Contact deleted successfully",
            data: null
        });
    }
    catch (error) {
        console.error("Error deleting contact:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            data: null
        });
    }
});
exports.deleteContact = deleteContact;
//# sourceMappingURL=contact.controller.js.map