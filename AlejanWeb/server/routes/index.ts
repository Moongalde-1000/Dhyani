import express, { Request, Response } from "express";
import { authRouter } from "./auth.route";
import { staticPageRouter } from "./staticpage.route";
import { adminRouter } from "./admin.route";
import { clientRouter } from "./client.route";
import { teamRouter } from "./team.route";
import { faqRouter } from "./faq.route";
import { contactUsRouter } from "./contactus.route";
import { siteSettingRouter } from "./sitesetting.route";

export const mainRouter = express.Router();

mainRouter.use("/auth", authRouter);
mainRouter.use("/staticpage", staticPageRouter);
mainRouter.use("/admin", adminRouter);
mainRouter.use("/client", clientRouter);
mainRouter.use("/team", teamRouter);
mainRouter.use("/faq", faqRouter);
mainRouter.use("/contact-us", contactUsRouter);
mainRouter.use("/site-setting", siteSettingRouter);
