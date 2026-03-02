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
exports.generateBadgePdf = generateBadgePdf;
const jspdf_1 = require("jspdf");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
function generateBadgePdf(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const { badgeName, date, badgeType, description, imageUrl, outputPath } = options;
        const doc = new jspdf_1.jsPDF({ unit: 'pt', format: 'a4' });
        doc.setFillColor(255, 255, 255);
        doc.rect(0, 0, 595, 842, 'F');
        doc.setFontSize(28);
        doc.setFont('helvetica', 'bold');
        doc.text(badgeName || badgeType, 297.5, 80, { align: 'center' });
        let imgData;
        try {
            let imageBuffer;
            if (imageUrl.startsWith('http')) {
                const response = yield axios_1.default.get(imageUrl, { responseType: 'arraybuffer' });
                imageBuffer = Buffer.from(response.data, 'binary');
            }
            else {
                imageBuffer = fs_1.default.readFileSync(imageUrl);
            }
            imgData = 'data:image/png;base64,' + imageBuffer.toString('base64');
            doc.addImage(imgData, 'PNG', 197.5, 100, 200, 200);
        }
        catch (e) {
            console.error('Error loading badge image for PDF:', e);
        }
        doc.setFillColor(240, 240, 240);
        doc.roundedRect(222.5, 320, 150, 30, 10, 10, 'F');
        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(date, 297.5, 340, { align: 'center' });
        doc.setFontSize(20);
        doc.setFont('helvetica', 'bold');
        doc.text(badgeType, 297.5, 380, { align: 'center' });
        doc.setFontSize(14);
        doc.setFont('helvetica', 'normal');
        doc.text('Awarded for completing a week of sessions toward this goals.', 297.5, 420, { align: 'center', maxWidth: 400 });
        const pdfBuffer = doc.output('arraybuffer');
        fs_1.default.writeFileSync(outputPath, Buffer.from(pdfBuffer));
        return outputPath;
    });
}
//# sourceMappingURL=pdfBadgeGenerator.js.map