import express from "express";
import {
    upsertSiteSetting,
    getSiteSetting
} from "../controllers/sitesetting.controller";
import { authorize, authenticate } from "../middlewares";

export const siteSettingRouter = express.Router();

// Get settings (Retrieval)
siteSettingRouter.get("/", getSiteSetting);

// Create/Update settings (Protected - ADMIN)
siteSettingRouter.post(
    "/",
    authenticate,
    authorize(["ADMIN"]),
    upsertSiteSetting
);
