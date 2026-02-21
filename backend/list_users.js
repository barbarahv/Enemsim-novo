const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

// Initialize Firebase (if not already initialized)
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();

async function listUsers() {
    try {
        const snapshot = await db.collection('users').get();
        if (snapshot.empty) {
            console.log('No users found.');
            return;
        }

        console.log('--- Registered Emails ---');
        snapshot.forEach(doc => {
            const data = doc.data();
            if (data.email) {
                console.log(data.email);
            }
        });
        console.log('-------------------------');
    } catch (error) {
        console.error('Error getting users:', error);
    }
}

listUsers();
