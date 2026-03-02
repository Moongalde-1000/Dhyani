import { Request, Response } from "express";
import { db } from "../db";

export const upsertStaticPage = async (req: Request, res: Response) => {
  try {
    const {
      staticType,
      title,
      description,
      phone,
      email,
      location,
      goalText,
      missionDescription,
      visionDescription,
      valuesDescription
    } = req.body || {};

    if (!staticType) {
      return res.status(400).json({ success: false, message: "staticType is required" });
    }

    const file = req.file as Express.Multer.File | undefined;
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const staticImagePath = file ? `${baseUrl}/uploads/Static/${file.filename}` : undefined;

    const existing = await db.staticPage.findFirst({
      where: { staticType }
    });

    const data: any = {
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
      // Update
      result = await db.staticPage.update({
        where: { id: existing.id },
        data: data
      });
      return res.status(200).json({ success: true, message: "Static page updated successfully", data: result });
    } else {
      // Create
      result = await db.staticPage.create({
        data: data
      });
      return res.status(201).json({ success: true, message: "Static page created successfully", data: result });
    }
  } catch (error: any) {
    console.error("Error in upsertStaticPage:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getStaticPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await db.staticPage.findUnique({ where: { id } });
    if (!item) return res.status(404).json({ success: false, message: "Static page not found" });
    return res.status(200).json({ success: true, message: "Static data found", data: item });
  } catch (error) {
    console.error("Error in getStaticPage:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getStaticPageList = async (req: Request, res: Response) => {
  try {
    const pages = await db.staticPage.findMany({});
    res.status(200).json({
      success: true,
      message: "Successfully retrieved static pages",
      data: pages,
    });
  } catch (error) {
    console.error("Error in getStaticPageList:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const deleteStaticPage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const existing = await db.staticPage.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ success: false, message: "Static page not found" });
    await db.staticPage.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Static page deleted successfully" });
  } catch (error) {
    console.error("Error in deleteStaticPage:", error);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
