"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.objectDifferences = void 0;
const deep_diff_1 = __importDefault(require("deep-diff"));
const normalizeValue = (value) => {
    if (value === null || value === undefined || value === "")
        return null;
    return value;
};
const formatDate = (dateString) => {
    if (isNaN(Date.parse(dateString)))
        return dateString;
    const date = new Date(dateString);
    return date.toISOString();
};
const objectDifferences = (oldObj, newObj, excludeKeys = []) => {
    const normalizeAndFormat = (obj) => {
        const newObj = {};
        for (const key in obj) {
            if (excludeKeys.includes(key))
                continue;
            if (typeof obj[key] === "string" && !isNaN(Date.parse(obj[key]))) {
                newObj[key] = formatDate(obj[key]);
            }
            else {
                newObj[key] = normalizeValue(obj[key]);
            }
        }
        return newObj;
    };
    const normalizedOldObj = normalizeAndFormat(oldObj);
    const normalizedNewObj = normalizeAndFormat(newObj);
    const differences = (0, deep_diff_1.default)(normalizedOldObj, normalizedNewObj);
    const oldChanges = {};
    const newChanges = {};
    if (!differences)
        return { oldChanges, newChanges };
    differences.forEach((difference) => {
        var _a;
        const path = (_a = difference === null || difference === void 0 ? void 0 : difference.path) === null || _a === void 0 ? void 0 : _a.join(".");
        switch (difference.kind) {
            case "E":
                oldChanges[path] = difference.lhs;
                newChanges[path] = difference.rhs;
                break;
            case "N":
                newChanges[path] = difference.rhs;
                break;
            case "D":
                oldChanges[path] = difference.lhs;
                break;
            case "A":
                if (difference.item) {
                    const arrayChanges = (0, exports.objectDifferences)(difference.item.lhs, difference.item.rhs, excludeKeys);
                    oldChanges[path] = arrayChanges.oldChanges;
                    newChanges[path] = arrayChanges.newChanges;
                }
                break;
        }
    });
    return { oldChanges, newChanges };
};
exports.objectDifferences = objectDifferences;
//# sourceMappingURL=objectDifferences.js.map