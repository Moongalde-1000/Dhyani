import { Request, Response } from "express";
import { db } from "../db";

export const createContactUs = async (req: Request, res: Response) => {
    try {
        const { name, email, phone, subject } = req.body;

        if (!name || !email || !phone || !subject) {
            return res.status(400).json({ success: false, message: "All fields (name, email, phone, subject) are required" });
        }

        const contactInquiry = await db.contactUs.create({
            data: {
                name,
                email,
                phone,
                subject,
            },
        });

        return res.status(201).json({ success: true, message: "Inquiry submitted successfully", data: contactInquiry });
    } catch (error: any) {
        console.error("Error in createContactUs:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getContactUsList = async (req: Request, res: Response) => {
    try {
        const inquiries = await db.contactUs.findMany({
            orderBy: { createdAt: 'desc' }
        });
        res.status(200).json({
            success: true,
            message: "Successfully retrieved contact inquiries",
            data: inquiries,
        });
    } catch (error) {
        console.error("Error in getContactUsList:", error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getContactUsById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const inquiry = await db.contactUs.findUnique({ where: { id } });
        if (!inquiry) return res.status(404).json({ success: false, message: "Contact inquiry not found" });
        return res.status(200).json({ success: true, message: "Inquiry found", data: inquiry });
    } catch (error) {
        console.error("Error in getContactUsById:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
