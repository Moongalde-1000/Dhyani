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
exports.addChangeLog = void 0;
const db_1 = require("../db");
const objectDifferences_1 = require("../utils/objectDifferences");
const convertToReadableFormat = (str) => {
    return str
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        .replace(/^./, (match) => match.toUpperCase());
};
const formatObjectToCommaSeparatedString = (obj) => {
    if (Object.keys(obj).length > 0) {
        return Object.entries(obj)
            .filter(([value]) => value !== null)
            .map(([key, value]) => {
            if (Array.isArray(value)) {
                return `${key} = ${value.join(", ")}`;
            }
            return `${key} = ${value}`;
        })
            .join(", ");
    }
    return "N/A";
};
const addChangeLog = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const _excludeKeys = ["id", "createdAt", "updatedAt", "userId", "UserId", "password"];
    const { newChanges, oldChanges } = (0, objectDifferences_1.objectDifferences)(data.oldValues, data.newValues, _excludeKeys);
    const newObjectToString = formatObjectToCommaSeparatedString(newChanges);
    const oldObjectToString = formatObjectToCommaSeparatedString(oldChanges);
    const newValue = convertToReadableFormat(newObjectToString);
    const oldValue = convertToReadableFormat(oldObjectToString);
    yield db_1.db.changeLog.create({
        data: {
            description: data.description,
            module: data.module,
            role: data.role,
            userId: data.userId,
            oldValues: oldChanges,
            newValues: newChanges,
            newValue: newValue,
            oldValue: oldValue,
        },
    });
});
exports.addChangeLog = addChangeLog;
//# sourceMappingURL=changeLog.helper.js.map