"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUploadRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const awsS3FileUploader_1 = require("../middlewares/awsS3FileUploader");
const fileUpload_controller_1 = require("../controllers/fileUpload.controller");
exports.fileUploadRouter = express_1.default.Router();
exports.fileUploadRouter.post("/", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), awsS3FileUploader_1.upload.single('file'), fileUpload_controller_1.fileUpload);
//# sourceMappingURL=fileUpload.route.js.map