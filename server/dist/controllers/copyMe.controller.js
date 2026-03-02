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
exports.copyMe = void 0;
const db_1 = require("../db");
const copyMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { gender, email, password, username, dob, firstName, middleName, lastName, } = req.body;
        const saveData = yield db_1.db.users.create({
            data: {
                username: username.toLowerCase(),
                firstName,
                middleName,
                lastName,
                email: email.toLowerCase(),
                gender,
                dob: new Date(dob),
                password: "",
            },
        });
        res.status(201).json({
            success: true,
            message: "User created successfully",
            userId: saveData.id,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.copyMe = copyMe;
//# sourceMappingURL=copyMe.controller.js.map