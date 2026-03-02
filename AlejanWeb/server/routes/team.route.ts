import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
    createTeam,
    updateTeam,
    getTeam,
    getTeamList,
    deleteTeam
} from "../controllers/team.controller";
import { authorize, authenticate } from "../middlewares";

const uploadDir = path.join(__dirname, "..", "uploads", "Team");
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
        cb(null, `team-${uniqueSuffix}${ext}`);
    },
});

const upload = multer({ storage });

export const teamRouter = express.Router();

// Create
teamRouter.post(
    "/",
    authenticate,
    authorize(["ADMIN"]),
    upload.single("teamImage"),
    createTeam
);

// Update
teamRouter.put(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    upload.single("teamImage"),
    updateTeam
);

// Read
teamRouter.get("/", getTeamList);
teamRouter.get("/:id", getTeam);

// Delete
teamRouter.delete(
    "/:id",
    authenticate,
    authorize(["ADMIN"]),
    deleteTeam
);
