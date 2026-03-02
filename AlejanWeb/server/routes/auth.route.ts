// auth.route.ts
import express, { Request, Response } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from "../middlewares";
import { authorize } from "../middlewares";

import { loginValidation, registrationValidation } from "../helpers/auth.helper";
import { login, changePassword, deleteAccount, logout, forgotPassword } from "../controllers/auth.controller";
import { uploadProfileImage } from "../middlewares/upload";
import { validateData } from "../middlewares/validationMiddleware";
import { changePaswordValidation } from "../helpers/user.helper";

export const authRouter = express.Router();

const uploadDir = path.join(__dirname, "..", "uploads", "User");
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
    cb(null, `user-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

authRouter.post("/login", validateData(loginValidation), login);
authRouter.post("/change-password", authenticate, validateData(changePaswordValidation), changePassword);
authRouter.delete('/delete/:id', deleteAccount);
authRouter.post("/logout", authenticate, logout);
authRouter.post("/forgot-password", forgotPassword);