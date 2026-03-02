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
exports.deleteStaticPage = exports.getStaticPageList = exports.getStaticPage = exports.upsertStaticPage = void 0;
const db_1 = require("../db");
const upsertStaticPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { staticType, title, description, phone, email, location, goalText, missionDescription, visionDescription, valuesDescription } = req.body || {};
        if (!staticType) {
            return res.status(400).json({ success: false, message: "staticType is required" });
        }
        const file = req.file;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const staticImagePath = file ? `${baseUrl}/uploads/Static/${file.filename}` : undefined;
        const existing = yield db_1.db.staticPage.findFirst({
            where: { staticType }
        });
        const data = {
            staticType,
            title: title || "",
            description: description || "",
            phone: phone || "",
            email: email || "",
            location: location || "",
            goalText: goalText || "",
            missionDescription: missionDescription || "",
            visionDescription: visionDescription || "",
            valuesDescription: valuesDescription || "",
        };
        if (staticImagePath) {
            data.staticImage = staticImagePath;
        }
        let result;
        if (existing) {
            result = yield db_1.db.staticPage.update({
                where: { id: existing.id },
                data: data
            });
            return res.status(200).json({ success: true, message: "Static page updated successfully", data: result });
        }
        else {
            result = yield db_1.db.staticPage.create({
                data: data
            });
            return res.status(201).json({ success: true, message: "Static page created successfully", data: result });
        }
    }
    catch (error) {
        console.error("Error in upsertStaticPage:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.upsertStaticPage = upsertStaticPage;
const getStaticPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const item = yield db_1.db.staticPage.findUnique({ where: { id } });
        if (!item)
            return res.status(404).json({ success: false, message: "Static page not found" });
        return res.status(200).json({ success: true, message: "Static data found", data: item });
    }
    catch (error) {
        console.error("Error in getStaticPage:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getStaticPage = getStaticPage;
const getStaticPageList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pages = yield db_1.db.staticPage.findMany({});
        res.status(200).json({
            success: true,
            message: "Successfully retrieved static pages",
            data: pages,
        });
    }
    catch (error) {
        console.error("Error in getStaticPageList:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getStaticPageList = getStaticPageList;
const deleteStaticPage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existing = yield db_1.db.staticPage.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "Static page not found" });
        yield db_1.db.staticPage.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "Static page deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteStaticPage:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteStaticPage = deleteStaticPage;
//# sourceMappingURL=staticpage.controller.js.map