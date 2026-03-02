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
exports.sendPushNotification = void 0;
const firebase_1 = require("./firebase");
const sendPushNotification = (fcmToken, title, body, data) => __awaiter(void 0, void 0, void 0, function* () {
    if (!fcmToken) {
        console.log('No FCM token provided, skipping push notification');
        return;
    }
    const message = {
        notification: {
            title,
            body,
        },
        data: data || {},
        token: fcmToken,
    };
    try {
        const response = yield firebase_1.messaging.send(message);
        console.log('Successfully sent message:', response);
        return response;
    }
    catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
});
exports.sendPushNotification = sendPushNotification;
//# sourceMappingURL=fcm.js.map