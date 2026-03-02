import { Request, Response } from "express";
import { db } from "../db";

export const createTeam = async (req: Request, res: Response) => {
    try {
        const { name, designation, linkedInID, twitterID } = req.body;

        if (!name || !designation) {
            return res.status(400).json({ success: false, message: "Name and designation are required" });
        }

        const file = req.file as Express.Multer.File | undefined;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const teamImage = file ? `${baseUrl}/uploads/Team/${file.filename}` : "";

        const teamMember = await db.team.create({
            data: {
                name,
                designation,
                linkedInID: linkedInID || "",
                twitterID: twitterID || "",
                teamImage: teamImage,
            },
        });

        return res.status(201).json({ success: true, message: "Team member created successfully", data: teamMember });
    } catch (error: any) {
        console.error("Error in createTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const teamMember = await db.team.findUnique({ where: { id } });
        if (!teamMember) return res.status(404).json({ success: false, message: "Team member not found" });
        return res.status(200).json({ success: true, message: "Team member found", data: teamMember });
    } catch (error) {
        console.error("Error in getTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getTeamList = async (req: Request, res: Response) => {
    try {
        const teamMembers = await db.team.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved team members",
            data: teamMembers,
        });
    } catch (error) {
        console.error("Error in getTeamList:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, designation, linkedInID, twitterID } = req.body;

        const existing = await db.team.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: "Team member not found" });

        const file = req.file as Express.Multer.File | undefined;
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const teamImage = file ? `${baseUrl}/uploads/Team/${file.filename}` : undefined;

        const data: any = {};
        if (name) data.name = name;
        if (designation) data.designation = designation;
        if (typeof linkedInID !== "undefined") data.linkedInID = linkedInID;
        if (typeof twitterID !== "undefined") data.twitterID = twitterID;
        if (teamImage) data.teamImage = teamImage;

        const updated = await db.team.update({
            where: { id },
            data: data
        });

        return res.status(200).json({ success: true, message: "Team member updated successfully", data: updated });
    } catch (error) {
        console.error("Error in updateTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteTeam = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const existing = await db.team.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: "Team member not found" });
        await db.team.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "Team member deleted successfully" });
    } catch (error) {
        console.error("Error in deleteTeam:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
