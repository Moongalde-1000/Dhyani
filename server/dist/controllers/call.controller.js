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
exports.startCall = void 0;
const db_1 = require("../db");
const firebase_1 = __importDefault(require("../utils/firebase"));
const startCall = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c;
    const receiverId = (_a = req.body) === null || _a === void 0 ? void 0 : _a.receiverId;
    let platform = 'unknown';
    try {
        const { callerId, channelId, token, callerName, avatar, friendData, platform: bodyPlatform, } = req.body;
        if (!callerId || !receiverId || !channelId) {
            return res.status(400).json({
                success: 0,
                error: 'Missing required fields: callerId, receiverId, channelId',
            });
        }
        const { v4: uuidv4 } = require('uuid');
        const callId = uuidv4();
        const receiverTokenRef = firebase_1.default.database().ref(`users/${receiverId}/fcmToken`);
        const receiverVoIPTokenRef = firebase_1.default.database().ref(`users/${receiverId}/voipToken`);
        const receiverDeviceRef = firebase_1.default.database().ref(`users/${receiverId}/deviceInfo`);
        const [tokenSnapshot, voipTokenSnapshot, deviceSnapshot] = yield Promise.all([
            receiverTokenRef.once('value'),
            receiverVoIPTokenRef.once('value'),
            receiverDeviceRef.once('value'),
        ]);
        let fcmToken = tokenSnapshot.val();
        let voipToken = voipTokenSnapshot.val();
        const deviceInfo = deviceSnapshot.val() || {};
        const platform = deviceInfo.platform || 'unknown';
        console.log(`📱 Fetching tokens for receiver: ${receiverId}`);
        console.log(`📱 Platform: ${platform}`);
        console.log(`📱 FCM Token exists: ${!!fcmToken}`);
        console.log(`📱 VoIP Token exists: ${!!voipToken}`);
        let tokenToUse = null;
        let tokenType = 'unknown';
        if (platform.toLowerCase() === 'ios') {
            if (voipToken) {
                tokenToUse = voipToken;
                tokenType = 'voip';
                console.log(`📱 Using VoIP token for iOS VoIP push`);
            }
            else if (fcmToken) {
                tokenToUse = fcmToken;
                tokenType = 'fcm';
                console.log(`⚠️ VoIP token not found, falling back to FCM token (may not work for VoIP pushes)`);
            }
        }
        else {
            tokenToUse = fcmToken;
            tokenType = 'fcm';
            console.log(`📱 Using FCM token for Android`);
        }
        if (tokenToUse) {
            if (typeof tokenToUse !== 'string') {
                console.log(`⚠️ Token is not a string, converting...`);
                tokenToUse = String(tokenToUse);
            }
            tokenToUse = tokenToUse.trim();
            if (tokenType === 'voip') {
                if (tokenToUse.length !== 64) {
                    console.log(`❌ VoIP token appears to be invalid: ${tokenToUse.length} characters (expected 64)`);
                    return res.status(400).json({
                        success: 0,
                        error: 'Invalid VoIP token format',
                        details: `The receiver's VoIP token appears to be malformed. They need to log in again.`,
                    });
                }
            }
            else {
                if (tokenToUse.length < 50) {
                    console.log(`❌ FCM token appears to be invalid (too short): ${tokenToUse.length} characters`);
                    return res.status(400).json({
                        success: 0,
                        error: 'Invalid FCM token format',
                        details: `The receiver's FCM token appears to be malformed. They need to log in again.`,
                    });
                }
            }
            const maskedToken = tokenToUse.length > 20 ? `${tokenToUse.substring(0, 20)}...` : tokenToUse;
            console.log(`📱 Token (masked): ${maskedToken}`);
            console.log(`📱 Token length: ${tokenToUse.length} characters`);
            console.log(`📱 Token type: ${tokenType}`);
        }
        if (!tokenToUse || tokenToUse.trim().length === 0) {
            const errorMsg = platform.toLowerCase() === 'ios'
                ? `No ${voipToken ? 'FCM' : 'VoIP'} token found for receiver: ${receiverId}. For iOS VoIP pushes, VoIP token is required.`
                : `No FCM token found for receiver: ${receiverId}`;
            console.log(`❌ ${errorMsg}`);
            return res.status(404).json({
                success: 0,
                error: 'Receiver not reachable - No token found',
                details: `The receiver (${receiverId}) has not logged in recently or VoIP token is missing. They need to log in to receive call notifications.`,
            });
        }
        let displayName = callerName || 'Someone';
        let callerProfile = null;
        if (friendData) {
            displayName = friendData.displayName || friendData.fullName || callerName || 'Someone';
            callerProfile = friendData;
        }
        else {
            try {
                callerProfile = yield db_1.db.users.findUnique({
                    where: { id: callerId }
                });
                if (callerProfile) {
                    displayName = callerProfile.displayName ||
                        callerProfile.fullName ||
                        callerName ||
                        'Someone';
                }
            }
            catch (e) {
                console.log('Could not fetch caller profile:', e);
            }
        }
        const message = {
            token: tokenToUse,
            data: {
                type: 'call',
                uuid: callId,
                caller_name: displayName,
                avatar: avatar || (callerProfile === null || callerProfile === void 0 ? void 0 : callerProfile.profileImage) || '',
                channelId: channelId,
                agoraToken: token || '',
                remoteUid: String(callerId),
                friendId: String(callerId),
                friendName: displayName,
                friendDisplayName: (callerProfile === null || callerProfile === void 0 ? void 0 : callerProfile.displayName) || (friendData === null || friendData === void 0 ? void 0 : friendData.displayName) || '',
                friendEmail: (callerProfile === null || callerProfile === void 0 ? void 0 : callerProfile.email) || (friendData === null || friendData === void 0 ? void 0 : friendData.email) || '',
                friendAvatar: avatar || (callerProfile === null || callerProfile === void 0 ? void 0 : callerProfile.profileImage) || (friendData === null || friendData === void 0 ? void 0 : friendData.profileImage) || '',
                friendGender: (callerProfile === null || callerProfile === void 0 ? void 0 : callerProfile.gender) || (friendData === null || friendData === void 0 ? void 0 : friendData.gender) || '',
                friendLocation: (callerProfile === null || callerProfile === void 0 ? void 0 : callerProfile.location) || (friendData === null || friendData === void 0 ? void 0 : friendData.location) || '',
            },
        };
        if (platform.toLowerCase() === 'ios') {
            message.apns = {
                headers: {
                    'apns-priority': '10',
                    'apns-push-type': 'voip',
                    'apns-topic': 'com.bookMyLove.app.voip',
                },
                payload: {
                    aps: {
                        'content-available': 1,
                        sound: 'default',
                        badge: 1,
                        category: 'INCOMING_CALL',
                        'mutable-content': 1,
                        alert: {
                            title: 'Incoming Call',
                            body: `${displayName} is calling you...`,
                        },
                    },
                },
            };
            message.notification = {
                title: 'Incoming Call',
                body: `${displayName} is calling you...`,
            };
            console.log(`📱 iOS VoIP push configuration:`);
            console.log(`   - APNs push type: voip`);
            console.log(`   - Priority: 10 (high)`);
            console.log(`   - Content available: 1 (wakes app)`);
            console.log(`   - ⚠️ Ensure APNs Authentication Key is uploaded in Firebase Console`);
        }
        else {
            message.android = {
                priority: 'high',
                notification: {
                    channelId: 'incoming_calls',
                    priority: 'max',
                    sound: 'default',
                    title: 'Incoming Call',
                    body: `${displayName} is calling you...`,
                    clickAction: 'FLUTTER_NOTIFICATION_CLICK',
                    defaultSound: true,
                    defaultVibrateTimings: true,
                    defaultLightSettings: true,
                },
            };
            message.notification = {
                title: 'Incoming Call',
                body: `${displayName} is calling you...`,
            };
        }
        console.log(`📤 Attempting to send FCM notification to receiver: ${receiverId}`);
        console.log(`📤 Call ID: ${callId}`);
        console.log(`📤 Channel ID: ${channelId}`);
        console.log(`📤 Platform: ${platform}`);
        console.log(`📤 FCM Token (first 30 chars): ${fcmToken.substring(0, 30)}...`);
        console.log(`📤 Message structure:`, JSON.stringify({
            token: fcmToken.substring(0, 30) + '...',
            hasApns: !!message.apns,
            hasAndroid: !!message.android,
            dataKeys: Object.keys(message.data || {}),
        }, null, 2));
        const response = yield firebase_1.default.messaging().send(message);
        console.log(`✅ Successfully sent call notification for call ${callId}`);
        console.log(`✅ FCM Message ID: ${response}`);
        return res.status(200).json({
            success: 1,
            message: 'Call notification sent successfully',
            callId: callId,
            details: {
                receiverId: receiverId,
                channelId: channelId,
                platform: platform,
            },
        });
    }
    catch (error) {
        console.error('❌ Error sending call notification:', error);
        console.error('❌ Error code:', error.code);
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
        console.error('❌ Full error object:', JSON.stringify(error, null, 2));
        if (receiverId) {
            console.error(`❌ Receiver ID: ${receiverId}`);
            try {
                const debugTokenRef = firebase_1.default.database().ref(`users/${receiverId}/fcmToken`);
                const debugTokenSnapshot = yield debugTokenRef.once('value');
                const debugToken = debugTokenSnapshot.val();
                console.error(`❌ Token from DB (type): ${typeof debugToken}`);
                console.error(`❌ Token from DB (length): ${debugToken ? debugToken.length : 'null'}`);
                if (debugToken) {
                    console.error(`❌ Token from DB (first 50): ${String(debugToken).substring(0, 50)}...`);
                }
            }
            catch (debugError) {
                console.error('❌ Could not fetch token for debugging:', debugError);
            }
        }
        if (error.code === 'messaging/registration-token-not-registered' ||
            error.code === 'messaging/invalid-registration-token' ||
            ((_b = error.message) === null || _b === void 0 ? void 0 : _b.includes('Requested entity was not found')) ||
            ((_c = error.message) === null || _c === void 0 ? void 0 : _c.includes('Invalid registration token'))) {
            console.error(`❌ FCM token error for receiver: ${receiverId}`);
            console.error(`❌ Platform: ${platform}`);
            if (platform.toLowerCase() === 'ios') {
                console.error(`❌ iOS VoIP Push Error - This usually means:`);
                console.error(`   1. APNs Authentication Key is NOT uploaded in Firebase Console`);
                console.error(`      → Go to: Firebase Console → Project Settings → Cloud Messaging`);
                console.error(`      → Scroll to "iOS app configuration"`);
                console.error(`      → Upload APNs Authentication Key (.p8 file) with Key ID and Team ID`);
                console.error(`   2. APNs Key ID or Team ID is incorrect`);
                console.error(`   3. Bundle ID mismatch (check Firebase Console matches your app's bundle ID)`);
                console.error(`   4. Token is from a different Firebase project`);
                console.error(`   5. APNs certificate/key has expired or been revoked`);
                return res.status(410).json({
                    success: 0,
                    error: 'iOS VoIP push configuration error',
                    details: `The receiver's (${receiverId}) FCM token cannot be used for VoIP push. This is likely because APNs Authentication Key is not configured in Firebase Console. Go to Firebase Console → Project Settings → Cloud Messaging → iOS app configuration and upload your APNs Authentication Key (.p8 file).`,
                });
            }
            else {
                console.error(`❌ Android FCM Error - This could mean:`);
                console.error(`   1. Token is from a different Firebase project`);
                console.error(`   2. Token was revoked/uninstalled`);
                console.error(`   3. Token format is incorrect`);
                console.error(`   4. Firebase Admin SDK is configured for wrong project`);
                return res.status(410).json({
                    success: 0,
                    error: 'Stale FCM token',
                    details: `The receiver's (${receiverId}) device token is no longer valid or belongs to a different Firebase project. They need to log in again to update their FCM token.`,
                });
            }
        }
        if (error.code && error.code.startsWith('messaging/')) {
            console.error(`❌ FCM error: ${error.code} - ${error.message}`);
            return res.status(500).json({
                success: 0,
                error: 'FCM error',
                details: `${error.code}: ${error.message}`,
            });
        }
        return res.status(500).json({
            success: 0,
            error: 'Error sending call notification',
            details: error.message || 'Unknown error',
        });
    }
});
exports.startCall = startCall;
//# sourceMappingURL=call.controller.js.map