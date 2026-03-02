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
exports.deleteTeam = exports.updateTeam = exports.getTeamList = exports.getTeam = exports.createTeam = void 0;
const db_1 = require("../db");
const createTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, designation, linkedInID, twitterID } = req.body;
        if (!name || !designation) {
            return res.status(400).json({ success: false, message: "Name and designation are required" });
        }
        const file = req.file;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const teamImage = file ? `${baseUrl}/uploads/Team/${file.filename}` : "";
        const teamMember = yield db_1.db.team.create({
            data: {
                name,
                designation,
                linkedInID: linkedInID || "",
                twitterID: twitterID || "",
                teamImage: teamImage,
            },
        });
        return res.status(201).json({ success: true, message: "Team member created successfully", data: teamMember });
    }
    catch (error) {
        console.error("Error in createTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.createTeam = createTeam;
const getTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const teamMember = yield db_1.db.team.findUnique({ where: { id } });
        if (!teamMember)
            return res.status(404).json({ success: false, message: "Team member not found" });
        return res.status(200).json({ success: true, message: "Team member found", data: teamMember });
    }
    catch (error) {
        console.error("Error in getTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTeam = getTeam;
const getTeamList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teamMembers = yield db_1.db.team.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved team members",
            data: teamMembers,
        });
    }
    catch (error) {
        console.error("Error in getTeamList:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getTeamList = getTeamList;
const updateTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const { name, designation, linkedInID, twitterID } = req.body;
        const existing = yield db_1.db.team.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "Team member not found" });
        const file = req.file;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const teamImage = file ? `${baseUrl}/uploads/Team/${file.filename}` : undefined;
        const data = {};
        if (name)
            data.name = name;
        if (designation)
            data.designation = designation;
        if (typeof linkedInID !== "undefined")
            data.linkedInID = linkedInID;
        if (typeof twitterID !== "undefined")
            data.twitterID = twitterID;
        if (teamImage)
            data.teamImage = teamImage;
        const updated = yield db_1.db.team.update({
            where: { id },
            data: data
        });
        return res.status(200).json({ success: true, message: "Team member updated successfully", data: updated });
    }
    catch (error) {
        console.error("Error in updateTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.updateTeam = updateTeam;
const deleteTeam = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        const existing = yield db_1.db.team.findUnique({ where: { id } });
        if (!existing)
            return res.status(404).json({ success: false, message: "Team member not found" });
        yield db_1.db.team.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "Team member deleted successfully" });
    }
    catch (error) {
        console.error("Error in deleteTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.deleteTeam = deleteTeam;
//# sourceMappingURL=team.controller.js.map