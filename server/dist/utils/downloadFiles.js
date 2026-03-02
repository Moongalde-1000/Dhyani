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
exports.exportPDF = void 0;
const dayjs_1 = __importDefault(require("dayjs"));
const jspdf_1 = __importDefault(require("jspdf"));
const jspdf_autotable_1 = __importDefault(require("jspdf-autotable"));
const exportPDF = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const doc = new jspdf_1.default('l');
    const dataColumns = generateDataColumns(data);
    (0, jspdf_autotable_1.default)(doc, {
        body: data,
        columns: dataColumns,
        headStyles: { fillColor: "#4318ff" },
        margin: { top: 25 },
        theme: 'grid',
        didDrawPage: function () {
            doc.setFontSize(25);
            var fileTitle = "Report";
            doc.text(fileTitle, 130, 20);
            doc.setFontSize(20);
            var date = (0, dayjs_1.default)().format('MM/DD/YYYY hh:mm A');
            doc.text(date, 225, 20);
        }
    });
    const pdfBlob = doc.output('blob');
    return Buffer.from(yield pdfBlob.arrayBuffer());
});
exports.exportPDF = exportPDF;
const generateDataColumns = (data) => {
    if (data.length === 0)
        return [];
    const keys = Object.keys(data[0]);
    return keys.map(key => ({ header: key, dataKey: key }));
};
//# sourceMappingURL=downloadFiles.js.map