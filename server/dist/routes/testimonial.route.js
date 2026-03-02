"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testimonialRouter = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const testimonial_controller_1 = require("../controllers/testimonial.controller");
const uploadDir = path_1.default.join(__dirname, "..", "uploads", "Testimonial");
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
        cb(null, `testimonial-${uniqueSuffix}${ext}`);
    },
});
const upload = (0, multer_1.default)({ storage });
exports.testimonialRouter = express_1.default.Router();
exports.testimonialRouter.post("/", upload.single("image"), testimonial_controller_1.createTestimonial);
exports.testimonialRouter.put('/:id', upload.single('image'), testimonial_controller_1.updateTestimonial);
exports.testimonialRouter.get("/:id", testimonial_controller_1.getTestimonial);
exports.testimonialRouter.get("/", testimonial_controller_1.getTestimonialList);
exports.testimonialRouter.delete("/:id", testimonial_controller_1.deleteTestimonial);
//# sourceMappingURL=testimonial.route.js.map