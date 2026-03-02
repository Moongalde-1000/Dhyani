import express from "express";
import {
    createContactUs,
    getContactUsList,
    getContactUsById
} from "../controllers/contactus.controller";
import { authorize, authenticate } from "../middlewares";

export const contactUsRouter = express.Router();

// Submit Inquiry (Anonymous)
contactUsRouter.post("/", createContactUs);

// Get List (Protected - ADMIN)
contactUsRouter.get(
    "/",
    authenticate,
    authorize(["ADMIN"]),
    getContactUsList
);

// Get By ID (Protected - ADMIN)
contactUsRouter.get(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    getContactUsById
);
