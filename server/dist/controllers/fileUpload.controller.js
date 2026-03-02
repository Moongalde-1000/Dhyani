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
Object.defineProperty(exports, "__esModule", { value: true });
exports.fileUpload = void 0;
const fileUpload = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    try {
        if (req.file) {
            const file = req.file;
            console.log('req.body:', req.body);
            res.status(200).json({
                success: true,
                message: "File Upload successfully",
                data: {
                    "originalname": file.originalname,
                    "mimetype": file.mimetype,
                    "size": file.size,
                    "bucket": (_a = file.bucket) !== null && _a !== void 0 ? _a : '',
                    "key": (_b = file.key) !== null && _b !== void 0 ? _b : '',
                    "contentType": (_c = file.contentType) !== null && _c !== void 0 ? _c : '',
                    "type": 'public',
                    "location": (_d = file.location) !== null && _d !== void 0 ? _d : ''
                },
            });
        }
        else {
            res.status(201).json({
                success: false,
                message: "File Upload faild",
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.fileUpload = fileUpload;
//# sourceMappingURL=fileUpload.controller.js.map