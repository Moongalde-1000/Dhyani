"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const team_controller_1 = require("../controllers/team.controller");
const middlewares_1 = require("../middlewares");
const uploadDir = path_1.default.join(__dirname, "..", "uploads", "Team");
if (!fs_1.default.existsSync(uploadDir)) {
    fs_1.default.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, uploadDir);
    },
    filename: function (_req, file, cb) {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        const ext = path_1.default.extname(file.originalname) || "";
        cb(null, `team-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.teamRouter = express_1.default.Router();
exports.teamRouter.post("/", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), upload.single("teamImage"), team_controller_1.createTeam);
exports.teamRouter.put("/:id", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), upload.single("teamImage"), team_controller_1.updateTeam);
exports.teamRouter.get("/", team_controller_1.getTeamList);
exports.teamRouter.get("/:id", team_controller_1.getTeam);
exports.teamRouter.delete("/:id", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), team_controller_1.deleteTeam);
//# sourceMappingURL=team.route.js.map