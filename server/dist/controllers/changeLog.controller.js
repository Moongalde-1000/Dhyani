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
exports.getChangeLogUser = void 0;
const db_1 = require("../db");
const getChangeLogUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d, _e, _f;
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.results) || 10;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'ascend' ? 'asc' : 'desc';
    const search = req.query.search || '';
    const filterCondition = {
        createdAt: {
            gte: ((_a = req.query) === null || _a === void 0 ? void 0 : _a.createdAtFrom) ? new Date((_b = req.query) === null || _b === void 0 ? void 0 : _b.createdAtFrom) : undefined,
            lte: ((_c = req.query) === null || _c === void 0 ? void 0 : _c.createdAtTo) ? new Date((_d = req.query) === null || _d === void 0 ? void 0 : _d.createdAtTo) : undefined,
        },
        module: req.query.module ? {
            mode: 'insensitive',
            in: Array.isArray(req.query.module) ? req.query.module : [req.query.module]
        } : undefined,
        description: req.query.description ? {
            mode: 'insensitive',
            contains: req.query.description,
        } : undefined,
        newValue: req.query.newValue ? {
            mode: 'insensitive',
            contains: req.query.newValue,
        } : undefined,
        oldValue: req.query.oldValue ? {
            mode: 'insensitive',
            contains: req.query.oldValue,
        } : undefined,
    };
    try {
        const data = yield db_1.db.changeLog.findMany({
            select: {
                id: true,
                description: true,
                module: true,
                newValue: true,
                oldValue: true,
                createdAt: true,
            },
            where: Object.assign(Object.assign({ userId: ((_e = req.user) === null || _e === void 0 ? void 0 : _e.userId) || "" }, filterCondition), { AND: [
                    {
                        OR: [
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            },
                            {
                                module: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            },
                            {
                                oldValue: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            },
                            {
                                newValue: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            }
                        ]
                    }
                ] }),
            skip: (page - 1) * pageSize,
            take: pageSize,
            orderBy: {
                [sortField]: sortOrder,
            },
        });
        const totalCountData = yield db_1.db.changeLog.count({
            where: Object.assign(Object.assign({ userId: ((_f = req.user) === null || _f === void 0 ? void 0 : _f.userId) || "" }, filterCondition), { AND: [
                    {
                        OR: [
                            {
                                description: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            },
                            {
                                module: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            },
                            {
                                oldValue: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            },
                            {
                                newValue: {
                                    contains: search,
                                    mode: 'insensitive',
                                }
                            }
                        ]
                    }
                ] })
        });
        res.status(200).json({
            success: true,
            message: "Successfully",
            data: data,
            total: totalCountData
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal Server Error", success: false });
    }
});
exports.getChangeLogUser = getChangeLogUser;
//# sourceMappingURL=changeLog.controller.js.map