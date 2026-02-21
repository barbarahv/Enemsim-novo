const { resolve } = require('path');
require('dotenv').config({ path: resolve(__dirname, '../.env') });
const { db } = require('../firebaseConfig');

async function clearUsers() {
    console.log("Starting user deletion...");
    // Debug info
    console.log("Service Account:", process.env.GOOGLE_APPLICATION_CREDENTIALS || "Using default/code config");

    try {
        const usersRef = db.collection('users');
        const snapshot = await usersRef.get();

        if (snapshot.empty) {
            console.log('No users found.');
            return;
        }

        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });

        await batch.commit();
        console.log(`Successfully deleted ${snapshot.size} users.`);
    } catch (error) {
        console.error("Error deleting users:", error);
    }
}

clearUsers();
