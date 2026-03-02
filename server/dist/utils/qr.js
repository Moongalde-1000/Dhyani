"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserQrPng = generateUserQrPng;
const qrcode_1 = __importDefault(require("qrcode"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
function generateUserQrPng(userId, content) {
    return __awaiter(this, void 0, void 0, function* () {
        const uploadsDir = path_1.default.join(__dirname, '..', 'uploads', 'qrcodes');
        if (!fs_1.default.existsSync(uploadsDir)) {
            fs_1.default.mkdirSync(uploadsDir, { recursive: true });
        }
        const filename = `${userId}-${Date.now()}.png`;
        const filePath = path_1.default.join(uploadsDir, filename);
        yield qrcode_1.default.toFile(filePath, content, {
            type: 'png',
            margin: 2,
            width: 512,
            errorCorrectionLevel: 'M'
        });
        const publicUrl = `/uploads/qrcodes/${filename}`;
        return { filePath, publicUrl };
    });
}
//# sourceMappingURL=qr.js.map