import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
  upsertStaticPage,
  getStaticPage,
  getStaticPageList,
  deleteStaticPage
} from "../controllers/staticpage.controller";
import { authorize, authenticate } from "../middlewares";

const uploadDir = path.join(__dirname, "..", "uploads", "Static");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, uploadDir);
  },
  filename: function (_req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || "";
    cb(null, `static-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

export const staticPageRouter = express.Router();

// Upsert: Add or Edit based on staticType in body
staticPageRouter.post(
  "/",
  authenticate,
  upload.single("staticImage"),
  upsertStaticPage
);

// Read
staticPageRouter.get("/", getStaticPageList);
staticPageRouter.get("/:id", getStaticPage);

// Delete
staticPageRouter.delete(
  "/:id",
  authenticate,
  authorize(["ADMIN"]),
  deleteStaticPage
);
