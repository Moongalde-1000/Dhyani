// auth.route.ts
import express, { Request, Response } from "express";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from "../middlewares";
import { authorize } from "../middlewares";

import { getAllUser, adminSuspendUser, getUserById, deleteUserAccount } from "../controllers/admin.controller";

export const adminRouter = express.Router();

adminRouter.get("/", getAllUser);
adminRouter.get(
  "/:id",
  getUserById
);
adminRouter.post(
  "/:id/suspend",
  adminSuspendUser
);

adminRouter.delete('/delete/:id', deleteUserAccount);