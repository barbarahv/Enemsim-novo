const admin = require("firebase-admin");

// Initialize Firebase only if not already initialized
if (!admin.apps.length) {
    try {
        const serviceAccount = require("./serviceAccountKey.json");
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount)
        });
        console.log("Firebase initialized successfully.");
    } catch (error) {
        console.error("Error initializing Firebase:", error.message);
        console.error("Make sure 'serviceAccountKey.json' exists in the backend folder and is valid.");
    }
}

const db = admin.firestore();

module.exports = { admin, db };
