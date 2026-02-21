const admin = require("firebase-admin");

const fs = require('fs');
const path = require('path');

// Initialize Firebase only if not already initialized
if (!admin.apps.length) {
    try {
        let serviceAccount;
        const localPath = path.join(__dirname, "serviceAccountKey.json");
        const secretPath = "/etc/secrets/serviceAccountKey.json";

        if (fs.existsSync(localPath)) {
            serviceAccount = require(localPath);
        } else if (fs.existsSync(secretPath)) {
            serviceAccount = require(secretPath);
        }

        if (serviceAccount) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
            console.log("Firebase initialized successfully.");
        } else {
            throw new Error("serviceAccountKey.json not found in local path or /etc/secrets/");
        }
    } catch (error) {
        console.error("Error initializing Firebase:", error.message);
    }
}

const db = admin.firestore();

module.exports = { admin, db };
