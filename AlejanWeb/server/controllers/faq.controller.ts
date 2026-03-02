import { Request, Response } from "express";
import { db } from "../db";

export const createFaq = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;

        if (!title || !description) {
            return res.status(400).json({ success: false, message: "Title and description are required" });
        }

        const faqEntry = await db.faq.create({
            data: {
                title,
                description,
            },
        });

        return res.status(201).json({ success: true, message: "FAQ entry created successfully", data: faqEntry });
    } catch (error: any) {
        console.error("Error in createFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getFaq = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const faqEntry = await db.faq.findUnique({ where: { id } });
        if (!faqEntry) return res.status(404).json({ success: false, message: "FAQ entry not found" });
        return res.status(200).json({ success: true, message: "FAQ entry found", data: faqEntry });
    } catch (error) {
        console.error("Error in getFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getFaqList = async (req: Request, res: Response) => {
    try {
        const faqEntries = await db.faq.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved FAQ entries",
            data: faqEntries,
        });
    } catch (error) {
        console.error("Error in getFaqList:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const updateFaq = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { title, description } = req.body;

        const existing = await db.faq.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: "FAQ entry not found" });

        const updated = await db.faq.update({
            where: { id },
            data: { title, description }
        });

        return res.status(200).json({ success: true, message: "FAQ entry updated successfully", data: updated });
    } catch (error) {
        console.error("Error in updateFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const deleteFaq = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const existing = await db.faq.findUnique({ where: { id } });
        if (!existing) return res.status(404).json({ success: false, message: "FAQ entry not found" });
        await db.faq.delete({ where: { id } });
        return res.status(200).json({ success: true, message: "FAQ entry deleted successfully" });
    } catch (error) {
        console.error("Error in deleteFaq:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
