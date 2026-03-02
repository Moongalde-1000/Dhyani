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
exports.testRouter = void 0;
const express_1 = __importDefault(require("express"));
const middlewares_1 = require("../middlewares");
const objectDifferences_1 = require("../utils/objectDifferences");
exports.testRouter = express_1.default.Router();
exports.testRouter.post("/prisma", (0, middlewares_1.authorize)(["ADMIN", "DEFAULT"]), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const objectDif = (0, objectDifferences_1.objectDifferences)({}, {
            email: "abcd02@yopmail.com",
            products: {
                name: "PS",
                price: [40, 50, 70],
            },
            date: new Date("2023/10/10"),
        });
        res.status(201).json({
            success: true,
            message: "working",
            objectDif,
        });
    }
    catch (error) {
        console.error(error);
        res
            .status(500)
            .json({ message: "Internal Server Error", success: false });
    }
}));
//# sourceMappingURL=test.route.js.map