"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.staticPageRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const staticpage_controller_1 = require("../controllers/staticpage.controller");
const middlewares_1 = require("../middlewares");
const uploadDir = path_1.default.join(__dirname, "..", "uploads", "Static");
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
        cb(null, `static-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.staticPageRouter = express_1.default.Router();
exports.staticPageRouter.post("/", middlewares_1.authenticate, upload.single("staticImage"), staticpage_controller_1.upsertStaticPage);
exports.staticPageRouter.get("/", staticpage_controller_1.getStaticPageList);
exports.staticPageRouter.get("/:id", staticpage_controller_1.getStaticPage);
exports.staticPageRouter.delete("/:id", middlewares_1.authenticate, (0, middlewares_1.authorize)(["ADMIN"]), staticpage_controller_1.deleteStaticPage);
//# sourceMappingURL=staticpage.route.js.map