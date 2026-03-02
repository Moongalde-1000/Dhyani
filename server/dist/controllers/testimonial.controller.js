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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = exports.deleteTestimonial = exports.updateTestimonial = exports.getTestimonialList = exports.getTestimonial = exports.createTestimonial = void 0;
const db_1 = require("../db");
const multer_1 = __importDefault(require("multer"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/Testimonial/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    },
});
const upload = (0, multer_1.default)({ storage: storage });
exports.upload = upload;
const createTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const file = req.file;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const { name, description, isActive = true } = req.body || {};
        if (!name) {
            return res.status(400).json({ success: false, message: "name is required" });
        }
        if (!description) {
            return res.status(400).json({ success: false, message: "description is required" });
        }
        const imagePath = file ? `${baseUrl}/uploads/Testimonial/${file.filename}` : "";
        const created = yield db_1.db.testimonial.create({
            data: {
                name,
                description,
                image: imagePath,
                isActive: isActive === 'true' || isActive === true,
            },
        });
        return res.status(201).json({ success: true, message: "Testimonial created successfully", data: created });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createTestimonial = createTestimonial;
const getTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield prisma.testimonial.findUnique({ where: { id } });
        if (!item)
            return res.status(404).json({ success: false, message: "Testimonial not found" });
        return res.status(200).json({ success: true, message: "Testimonial found", data: item });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTestimonial = getTestimonial;
const getTestimonialList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { isActive } = req.query;
        const where = {};
        if (isActive !== undefined) {
            where.isActive = isActive === 'true';
        }
        const testimonials = yield prisma.testimonial.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved testimonials",
            data: testimonials,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getTestimonialList = getTestimonialList;
const updateTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, description, isActive } = req.body || {};
        const existing = yield prisma.testimonial.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "Testimonial not found" });
        const file = req.file;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const image = file ? `${baseUrl}/uploads/Testimonial/${file.filename}` : undefined;
        const data = {};
        if (typeof name !== "undefined")
            data.name = name;
        if (typeof description !== "undefined")
            data.description = description;
        if (typeof isActive !== "undefined")
            data.isActive = isActive === 'true' || isActive === true;
        if (image)
            data.image = image;
        const updatedTestimonial = yield prisma.testimonial.update({
            where: { id },
            data: data
        });
        return res.status(200).json({ success: true, message: "Testimonial updated successfully", data: updatedTestimonial });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateTestimonial = updateTestimonial;
const deleteTestimonial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existing = yield prisma.testimonial.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "Testimonial not found" });
        yield prisma.testimonial.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "Testimonial deleted successfully" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteTestimonial = deleteTestimonial;
//# sourceMappingURL=testimonial.controller.js.map