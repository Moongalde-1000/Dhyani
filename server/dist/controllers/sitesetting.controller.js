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
exports.getSiteSetting = exports.upsertSiteSetting = void 0;
const db_1 = require("../db");
const upsertSiteSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { signUpTitle, loginTitle, forgotPasswordTitle, aboutpageTitle, contactusTitle, faqTitle, eventListTitle, myEventDetailTitle, publicEventDetailTitle, footerTitle, footerDescription, linkedInID, twitterID } = req.body;
        const existingSetting = yield db_1.db.siteSetting.findFirst();
        let siteSetting;
        if (existingSetting) {
            siteSetting = yield db_1.db.siteSetting.update({
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
        }
        else {
            siteSetting = yield db_1.db.siteSetting.create({
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
    }
    catch (error) {
        console.error("Error in upsertSiteSetting:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.upsertSiteSetting = upsertSiteSetting;
const getSiteSetting = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const siteSetting = yield db_1.db.siteSetting.findFirst();
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
    }
    catch (error) {
        console.error("Error in getSiteSetting:", error);
        return res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.getSiteSetting = getSiteSetting;
//# sourceMappingURL=sitesetting.controller.js.map