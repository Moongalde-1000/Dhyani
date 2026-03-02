import { messaging } from './firebase';

export const sendPushNotification = async (fcmToken: string, title: string, body: string, data?: any) => {
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
        const response = await messaging.send(message);
        console.log('Successfully sent message:', response);
        return response;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
