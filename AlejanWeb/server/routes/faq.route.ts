import express from "express";
import {
    createFaq,
    updateFaq,
    getFaq,
    getFaqList,
    deleteFaq
} from "../controllers/faq.controller";
import { authorize, authenticate } from "../middlewares";

export const faqRouter = express.Router();

// Create
faqRouter.post(
    "/",
    authenticate,
    authorize(["ADMIN"]),
    createFaq
);

// Update
faqRouter.put(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    updateFaq
);

// Read
faqRouter.get("/", getFaqList);
faqRouter.get("/:id", getFaq);

// Delete
faqRouter.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    deleteFaq
);
