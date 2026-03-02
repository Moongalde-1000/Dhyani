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
exports.getNotifications = void 0;
const db_1 = require("../db");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getNotifications = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const toUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!toUserId) {
            return res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        const items = yield db_1.db.notification.findMany({
            where: { toUserId },
            orderBy: { createdAt: 'desc' },
        });
        if (!items || items.length === 0) {
            return res.status(200).json({ success: 0, message: 'No data found', data: [] });
        }
        const friendRequestFromIds = items
            .filter((n) => (n === null || n === void 0 ? void 0 : n.notificationType) === 'FRIEND_REQUEST' && (n === null || n === void 0 ? void 0 : n.fromUserId))
            .map((n) => n.fromUserId);
        let friendIdSet = new Set();
        if (friendRequestFromIds.length > 0) {
            try {
                const friendships = yield db_1.db.userfriend.findMany({
                    where: {
                        userId: toUserId,
                        friendId: { in: friendRequestFromIds },
                        isFriend: 1,
                    },
                    select: { friendId: true },
                });
                friendIdSet = new Set(friendships.map((f) => String(f.friendId)));
            }
            catch (_b) { }
        }
        const enrichedItems = items
            .filter((n) => {
            if ((n === null || n === void 0 ? void 0 : n.notificationType) !== 'FRIEND_REQUEST')
                return true;
            return !friendIdSet.has(String(n.fromUserId));
        })
            .map((n) => {
            if ((n === null || n === void 0 ? void 0 : n.notificationType) === 'FRIEND_REQUEST') {
                const isFriend = friendIdSet.has(String(n.fromUserId)) ? 1 : 0;
                return Object.assign(Object.assign({}, n), { isFriend: isFriend });
            }
            return n;
        });
        return res.status(200).json({
            success: 1,
            message: "Notifications fetched successfully",
            data: enrichedItems,
        });
    }
    catch (error) {
        console.error('getNotifications error:', error);
        return res.status(500).json({ success: 0, message: 'Internal Server Error' });
    }
});
exports.getNotifications = getNotifications;
//# sourceMappingURL=notification.controller.js.map