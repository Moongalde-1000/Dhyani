"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_s3_1 = __importDefault(require("multer-s3"));
const client_s3_1 = require("@aws-sdk/client-s3");
const IAM_USER_KEY = process.env.IAM_USER_KEY || "";
const IAM_USER_SECRET = process.env.IAM_USER_SECRET || "";
const PUBLIC_BUCKET_NAME = process.env.PUBLIC_BUCKET_NAME || "";
const s3Config = new client_s3_1.S3Client({
    region: 'us-east-1',
    credentials: {
        accessKeyId: IAM_USER_KEY,
        secretAccessKey: IAM_USER_SECRET
    }
});
exports.upload = (0, multer_1.default)({
    storage: (0, multer_s3_1.default)({
        s3: s3Config,
        bucket: PUBLIC_BUCKET_NAME,
        metadata: (req, file, cb) => {
            cb(null, { fieldName: file.fieldname });
        },
        key: (req, file, cb) => {
            cb(null, `uploads/${Date.now().toString() + '-' + file.originalname}`);
        },
    }),
});
//# sourceMappingURL=awsS3FileUploader.js.map