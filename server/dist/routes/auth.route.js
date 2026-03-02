"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const middlewares_1 = require("../middlewares");
const auth_helper_1 = require("../helpers/auth.helper");
const auth_controller_1 = require("../controllers/auth.controller");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const user_helper_1 = require("../helpers/user.helper");
exports.authRouter = express_1.default.Router();
const uploadDir = path_1.default.join(__dirname, "..", "uploads", "User");
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
        cb(null, `user-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.authRouter.post("/login", (0, validationMiddleware_1.validateData)(auth_helper_1.loginValidation), auth_controller_1.login);
exports.authRouter.post("/change-password", middlewares_1.authenticate, (0, validationMiddleware_1.validateData)(user_helper_1.changePaswordValidation), auth_controller_1.changePassword);
exports.authRouter.delete('/delete/:id', auth_controller_1.deleteAccount);
exports.authRouter.post("/logout", middlewares_1.authenticate, auth_controller_1.logout);
exports.authRouter.post("/forgot-password", auth_controller_1.forgotPassword);
//# sourceMappingURL=auth.route.js.map