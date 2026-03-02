import * as admin from 'firebase-admin';
import path from 'path';

const serviceAccountPath = path.join(__dirname, '..', 'uploads', 'bookmylove-empar-firebase-adminsdk-fbsvc-7033c4821d.json');
console.log(serviceAccountPath);
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccountPath),
        databaseURL: 'https://bookmylove-empar-default-rtdb.firebaseio.com' // Adjust if necessary
    });
}

export const db = admin.database();
export const messaging = admin.messaging();
export default admin;
