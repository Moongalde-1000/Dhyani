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
exports.blockUnblockFriend = exports.getFriendList_1811 = exports.getFriendList = exports.addUserFriend = void 0;
const db_1 = require("../db");
const client_1 = require("@prisma/client");
const fcm_1 = require("../utils/fcm");
const prisma = new client_1.PrismaClient();
const addUserFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loginUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { friendId, isAccept } = req.body;
        if (!loginUserId) {
            return res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        if (!friendId || (isAccept !== 1 && isAccept !== 2)) {
            return res.status(400).json({ success: 0, message: "friendId and isAccept (1|2) are required" });
        }
        if (isAccept === 2) {
            try {
                yield db_1.db.userfriend.deleteMany({
                    where: { OR: [{ userId: loginUserId, friendId }, { userId: friendId, friendId: loginUserId }] },
                });
            }
            catch (_b) { }
            try {
                const [fromUser, toUser] = yield Promise.all([
                    db_1.db.users.findUnique({ where: { id: loginUserId } }),
                    db_1.db.users.findUnique({ where: { id: friendId } }),
                ]);
                if (toUser && toUser.fcmToken) {
                    yield (0, fcm_1.sendPushNotification)(toUser.fcmToken, 'Friend Request Rejected', `@${(fromUser === null || fromUser === void 0 ? void 0 : fromUser.displayName) || (fromUser === null || fromUser === void 0 ? void 0 : fromUser.fullName) || 'Someone'} rejected your friend request.`, { notificationType: 'FRIEND_REJECTED', fromUserId: loginUserId });
                }
            }
            catch (fcmError) {
                console.error('Failed to send FCM notification:', fcmError);
            }
            try {
                yield db_1.db.notification.create({
                    data: {
                        toUserId: friendId,
                        fromUserId: loginUserId,
                        notificationType: 'FRIEND_REJECTED',
                        notificationTitle: 'Friend Request Rejected',
                        description: 'Your friend request was rejected',
                    },
                });
            }
            catch (_c) { }
            return res.status(200).json({ success: 1, message: 'Friend request rejected' });
        }
        const existingAB = yield db_1.db.userfriend.findFirst({ where: { userId: loginUserId, friendId } });
        if (existingAB) {
            yield db_1.db.userfriend.update({ where: { id: existingAB.id }, data: { isFriend: 1 } });
        }
        else {
            yield db_1.db.userfriend.create({ data: { userId: loginUserId, friendId, isFriend: 1 } });
        }
        const existingBA = yield db_1.db.userfriend.findFirst({ where: { userId: friendId, friendId: loginUserId } });
        if (existingBA) {
            yield db_1.db.userfriend.update({ where: { id: existingBA.id }, data: { isFriend: 1 } });
        }
        else {
            yield db_1.db.userfriend.create({ data: { userId: friendId, friendId: loginUserId, isFriend: 1 } });
        }
        try {
            yield db_1.db.notification.create({
                data: {
                    toUserId: friendId,
                    fromUserId: loginUserId,
                    notificationType: 'FRIEND_ACCEPTED',
                    notificationTitle: 'Friend Request Accepted',
                    description: 'Your friend request was accepted',
                },
            });
        }
        catch (_d) { }
        try {
            const [fromUser, toUser] = yield Promise.all([
                db_1.db.users.findUnique({ where: { id: loginUserId } }),
                db_1.db.users.findUnique({ where: { id: friendId } }),
            ]);
            if (toUser && toUser.fcmToken) {
                yield (0, fcm_1.sendPushNotification)(toUser.fcmToken, 'Friend Request Accepted', `@${(fromUser === null || fromUser === void 0 ? void 0 : fromUser.displayName) || (fromUser === null || fromUser === void 0 ? void 0 : fromUser.fullName) || 'Someone'} accepted your friend request.`, { notificationType: 'FRIEND_ACCEPTED', fromUserId: loginUserId });
            }
        }
        catch (fcmError) {
            console.error('Failed to send FCM notification:', fcmError);
        }
        return res.status(200).json({ success: 1, message: 'Friend request accepted' });
    }
    catch (error) {
        console.error('addUserFriend error:', error);
        return res.status(500).json({ success: 0, message: 'Internal Server Error' });
    }
});
exports.addUserFriend = addUserFriend;
const getFriendList = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const loginUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const loginUserRole = (_b = req.user) === null || _b === void 0 ? void 0 : _b.role;
        let targetUserId = loginUserId;
        if (req.query.userId && loginUserRole === 'ADMIN') {
            targetUserId = req.query.userId;
        }
        if (!targetUserId) {
            return res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        const relations = yield db_1.db.userfriend.findMany({
            where: { userId: targetUserId, isFriend: 1 },
            select: { friendId: true, isBlocked: true },
        });
        if (relations.length === 0) {
            return res.status(200).json({ success: 1, message: "No friends found", data: [] });
        }
        let friendIds = relations.map((rel) => rel.friendId);
        const blockedMe = yield db_1.db.userfriend.findMany({
            where: { userId: { in: friendIds }, friendId: targetUserId, isBlocked: 1 },
            select: { userId: true },
        });
        const blockedMeIds = blockedMe.map((b) => b.userId);
        friendIds = friendIds.filter((id) => !blockedMeIds.includes(id));
        if (friendIds.length === 0) {
            return res.status(200).json({ success: 1, message: "No friends found", data: [] });
        }
        const friends = yield db_1.db.users.findMany({
            where: { id: { in: friendIds } },
            select: {
                id: true,
                fullName: true,
                displayName: true,
                email: true,
                profileImage: true,
                gender: true,
                location: true,
            },
        });
        const friendsWithBlockStatus = friends.map((fr) => {
            var _a;
            const rel = relations.find((r) => r.friendId === fr.id);
            return Object.assign(Object.assign({}, fr), { isBlocked: (_a = rel === null || rel === void 0 ? void 0 : rel.isBlocked) !== null && _a !== void 0 ? _a : 0 });
        });
        return res.status(200).json({
            success: 1,
            message: "Friend list fetched successfully",
            data: friendsWithBlockStatus,
        });
    }
    catch (error) {
        console.error("getFriendList error:", error);
        return res.status(500).json({ success: 0, message: "Internal Server Error" });
    }
});
exports.getFriendList = getFriendList;
const getFriendList_1811 = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loginUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        if (!loginUserId) {
            return res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        const relations = yield db_1.db.userfriend.findMany({
            where: { userId: loginUserId, isFriend: 1, isBlocked: 0 },
            select: { friendId: true },
        });
        let friendIds = relations.map((rel) => rel.friendId);
        if (friendIds.length === 0) {
            return res.status(200).json({ success: 0, message: "No friends found" });
        }
        const blockedMe = yield db_1.db.userfriend.findMany({
            where: { userId: { in: friendIds }, friendId: loginUserId, isBlocked: 1 },
            select: { userId: true },
        });
        const blockedMeIds = blockedMe.map((b) => b.userId);
        friendIds = friendIds.filter((id) => !blockedMeIds.includes(id));
        if (friendIds.length === 0) {
            return res.status(200).json({ success: 0, message: "No friends found" });
        }
        const friends = yield db_1.db.users.findMany({
            where: { id: { in: friendIds } },
            select: {
                id: true,
                fullName: true,
                displayName: true,
                email: true,
                profileImage: true,
                gender: true,
                location: true,
            },
        });
        return res.status(200).json({ success: 1, message: "Friend list fetched successfully", data: friends });
    }
    catch (error) {
        console.error('getFriendList error:', error);
        return res.status(500).json({ success: 0, message: 'Internal Server Error' });
    }
});
exports.getFriendList_1811 = getFriendList_1811;
const blockUnblockFriend = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const loginUserId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.userId;
        const { friendId, isBlocked } = req.body;
        if (!loginUserId) {
            return res.status(401).json({ success: 0, message: "Unauthorized" });
        }
        if (!friendId || (isBlocked !== 0 && isBlocked !== 1)) {
            return res.status(400).json({ success: 0, message: "friendId and isBlocked (0|1) are required" });
        }
        try {
            yield db_1.db.userfriend.upsert({
                where: { userId_friendId: { userId: loginUserId, friendId } },
                update: { isBlocked },
                create: { userId: loginUserId, friendId, isFriend: 0, isBlocked },
            });
        }
        catch (e) {
            const existing = yield db_1.db.userfriend.findFirst({ where: { userId: loginUserId, friendId } });
            if (existing) {
                yield db_1.db.userfriend.update({ where: { id: existing.id }, data: { isBlocked } });
            }
            else {
                yield db_1.db.userfriend.create({ data: { userId: loginUserId, friendId, isFriend: 0, isBlocked } });
            }
        }
        const message = isBlocked === 1 ? 'User blocked successfully' : 'User unblocked successfully';
        return res.status(200).json({ success: 1, message });
    }
    catch (error) {
        console.error('blockUnblockFriend error:', error);
        return res.status(500).json({ success: 0, message: 'Internal Server Error' });
    }
});
exports.blockUnblockFriend = blockUnblockFriend;
//# sourceMappingURL=userfriend.controller.js.map