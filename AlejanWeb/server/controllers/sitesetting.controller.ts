import { Request, Response } from "express";
import { db } from "../db";

export const upsertSiteSetting = async (req: Request, res: Response) => {
    try {
        const {
            signUpTitle,
            loginTitle,
            forgotPasswordTitle,
            aboutpageTitle,
            contactusTitle,
            faqTitle,
            eventListTitle,
            myEventDetailTitle,
            publicEventDetailTitle,
            footerTitle,
            footerDescription,
            linkedInID,
            twitterID
        } = req.body;

        // We only ever want one SiteSetting record. 
        // We'll look for any existing record first.
        const existingSetting = await db.siteSetting.findFirst();

        let siteSetting;

        if (existingSetting) {
            siteSetting = await db.siteSetting.update({
                where: { id: existingSetting.id },
                data: {
                    signUpTitle,
                    loginTitle,
                    forgotPasswordTitle,
                    aboutpageTitle,
                    contactusTitle,
                    faqTitle,
                    eventListTitle,
                    myEventDetailTitle,
                    publicEventDetailTitle,
                    footerTitle,
                    footerDescription,
                    linkedInID,
                    twitterID
                },
            });
        } else {
            siteSetting = await db.siteSetting.create({
                data: {
                    signUpTitle: signUpTitle || "",
                    loginTitle: loginTitle || "",
                    forgotPasswordTitle: forgotPasswordTitle || "",
                    aboutpageTitle: aboutpageTitle || "",
                    contactusTitle: contactusTitle || "",
                    faqTitle: faqTitle || "",
                    eventListTitle: eventListTitle || "",
                    myEventDetailTitle: myEventDetailTitle || "",
                    publicEventDetailTitle: publicEventDetailTitle || "",
                    footerTitle: footerTitle || "",
                    footerDescription: footerDescription || "",
                    linkedInID: linkedInID || "",
                    twitterID: twitterID || "",
                },
            });
        }

        return res.status(200).json({
            success: true,
            message: existingSetting ? "Site settings updated successfully" : "Site settings created successfully",
            data: siteSetting
        });
    } catch (error: any) {
        console.error("Error in upsertSiteSetting:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const getSiteSetting = async (req: Request, res: Response) => {
    try {
        const siteSetting = await db.siteSetting.findFirst();

        if (!siteSetting) {
            return res.status(200).json({
                success: true,
                message: "No site settings found",
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Site settings retrieved successfully",
            data: siteSetting,
        });
    } catch (error) {
        console.error("Error in getSiteSetting:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};
